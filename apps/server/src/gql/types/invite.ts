import { encodeGlobalID } from "@pothos/plugin-relay";
import locationTimezone from "node-location-timezone";
import { and, count, eq, inArray } from "drizzle-orm";
import { render } from "@react-email/render";
import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import {
	Invite as InviteType,
	inviteStatusEnumType,
	invites,
} from "../../db/schemas/invites.js";
import { Organization } from "./organization.js";
import { Role } from "./role.js";
import { resolveWindowedConnection } from "../../utils/resolveWindowedConnection.js";
import { resend } from "../../lib/resend.js";
import { InviteEmail } from "../../emails/org/invite-team-member.js";
import { organizations } from "../../db/schemas/organizations.js";
import { getCityAddress } from "../../utils/address.js";
import { users } from "../../db/schemas/users.js";
import { memberships } from "../../db/schemas/memberships.js";
import { User } from "./user.js";
import { Membership } from "./membership.js";
import { emailsUsersLoader } from "../loaders/emails-users-loader.js";

const InviteStatus = builder.enumType("InviteStatus", {
	values: inviteStatusEnumType,
});

export const Invite = builder.loadableNodeRef("Invite", {
	id: {
		resolve: (invite) => invite.id,
	},
	load: async (ids: string[]) => {
		const invites = await db.query.invites.findMany({
			where: (invites, { inArray }) => inArray(invites.id, ids),
		});

		return ids.map((id) => {
			const invite = invites.find((invite) => invite.id == id);

			if (!invite) {
				return new Error(`Invite not found: ${id}`);
			}
			return invite;
		});
	},
});

Invite.implement({
	isTypeOf: (invite) => (invite as InviteType).id !== undefined,
	fields: (t) => ({
		email: t.field({
			type: "Email",
			resolve: (parent) => parent.email,
		}),
		role: t.loadable({
			type: Role,
			load: async (ids, { loadMany }) => loadMany(Role, ids),
			resolve: (parent) => parent.role_id,
		}),
		status: t.field({
			type: InviteStatus,
			resolve: (parent) => parent.status,
		}),
		organization: t.loadable({
			type: Organization,
			load: async (ids, { loadMany }) => loadMany(Organization, ids),
			resolve: (parent) => parent.organization_id,
		}),
		user: t.loadable({
			type: User,
			nullable: true,
			load: (emails: string[], context) =>
				emailsUsersLoader(context).loadMany(emails),
			resolve: (parent) => parent.email,
		}),
		created_at: t.field({
			type: "Timestamp",
			nullable: true,
			resolve: (parent) => parent.created_at,
		}),
		updated_at: t.field({
			type: "Timestamp",
			nullable: true,
			resolve: (parent) => parent.updated_at,
		}),
	}),
});

builder.queryFields((t) => ({
	invite: t.field({
		type: Invite,
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
	userInvites: t.connection({
		type: Invite,
		nullable: true,
		args: {
			offset: t.arg.int({ required: true }),
		},
		resolve: async (_parent, args, context) => {
			return await resolveWindowedConnection(
				{ args },
				async ({ limit }) => {
					const [items, totalCount] = await Promise.all([
						db
							.select()
							.from(invites)
							.where(eq(invites.email, context.user.email))
							.limit(limit)
							.offset(args.offset),
						db.select({ value: count() }).from(invites),
					]);

					return {
						items,
						totalCount: totalCount[0].value,
					};
				}
			);
		},
	}),
	orgInvites: t.connection({
		type: Invite,
		nullable: true,
		args: {
			offset: t.arg.int({ required: true }),
			orgId: t.arg.globalID({ required: true }),
		},
		resolve: async (_parent, args) => {
			return await resolveWindowedConnection(
				{ args },
				async ({ limit }) => {
					const [items, totalCount] = await Promise.all([
						db
							.select()
							.from(invites)
							.where(
								eq(
									invites.organization_id,
									parseInt(args.orgId.id)
								)
							)
							.limit(limit)
							.offset(args.offset),
						db.select({ value: count() }).from(invites),
					]);

					return {
						items,
						totalCount: totalCount[0].value,
					};
				}
			);
		},
	}),
}));

// invite team member mutation
builder.relayMutationField(
	"inviteTeamMember",
	{
		inputFields: (t) => ({
			orgId: t.globalID({ required: true }),
			email: t.string({ required: true }),
			role: t.globalID({ required: true }),
		}),
	},
	{
		resolve: async (_root, args, ctx) => {
			const email = args.input.email.toLowerCase();

			// Check if there is an invite that is pending or accepted for the email and org
			const [existingInvite] = await db
				.select()
				.from(invites)
				.where(
					and(
						eq(invites.email, email),
						eq(
							invites.organization_id,
							parseInt(args.input.orgId.id)
						),
						inArray(invites.status, ["pending", "accepted"])
					)
				);

			if (existingInvite) {
				throw new Error(
					"An invite for this email and organization already exists and is pending or accepted."
				);
			}

			const [result] = await db
				.select()
				.from(users)
				.rightJoin(memberships, eq(memberships.user_id, users.id))
				.where(
					and(
						eq(users.email, email),
						eq(
							memberships.organization_id,
							parseInt(args.input.orgId.id)
						)
					)
				);

			if (result?.memberships) {
				throw new Error("User already exists in the organization");
			}

			const org = await db.query.organizations.findFirst({
				where: eq(organizations.id, parseInt(args.input.orgId.id)),
			});

			if (!org) throw new Error("Organization not found");

			const name = `${ctx.user.first_name} ${ctx.user.last_name}`;

			const [invite] = await db
				.insert(invites)
				.values({
					email,
					organization_id: parseInt(args.input.orgId.id),
					role_id: parseInt(args.input.role.id),
				})
				.returning();

			const html = render(
				InviteEmail({
					email,
					invitedByEmail: ctx.user.email,
					invitedByName: `${ctx.user.first_name} ${ctx.user.last_name}`,
					teamName: org.name,
					inviteCode: encodeGlobalID("Invite", invite.id),
					location: getCityAddress({
						city: org.city,
						state: org.state,
						country: locationTimezone.findCountryByIso(
							org.country_code
						).name,
					}),
				})
			);

			const { error } = await resend.emails.send({
				from: `${name} on GuestHub <support@guesthub.ai>`,
				to: [email],
				subject: `You've been invited to join ${org.name} on GuestHub`,
				html,
			});

			if (error) {
				// Delete invite from db
				await db.delete(invites).where(eq(invites.id, invite.id));

				throw new Error(error.message);
			}

			return {
				success: true,
				invite,
			};
		},
	},
	{
		outputFields: (t) => ({
			success: t.boolean({
				resolve: (result) => result.success,
			}),
			invite: t.field({
				type: Invite,
				nullable: true,
				resolve: (result) => result.invite,
			}),
		}),
	}
);

// accept invitation mutation
builder.relayMutationField(
	"acceptInvitation",
	{
		inputFields: (t) => ({
			inviteId: t.globalID({ required: true }),
		}),
	},
	{
		authScopes: async (_, args, ctx) => {
			try {
				const [invitation] = await db
					.select()
					.from(invites)
					.where(eq(invites.id, args.input.inviteId.id));

				if (!invitation) {
					return false;
				}

				const invitationBelongsToUser =
					invitation.email === ctx.user.email;

				return !!invitationBelongsToUser;
			} catch (error) {
				console.error(error);
				return false;
			}
		},
		resolve: async (_root, args, ctx) => {
			await db.transaction(async (tx) => {
				const [invite] = await tx
					.update(invites)
					.set({ status: "accepted" })
					.where(eq(invites.id, args.input.inviteId.id))
					.returning();

				await tx.insert(memberships).values({
					user_id: ctx.user.id,
					organization_id: invite.organization_id,
					role_id: invite.role_id,
				});
			});

			Membership.getDataloader(ctx).clearAll();

			return {
				success: true,
			};
		},
	},
	{
		outputFields: (t) => ({
			success: t.boolean({
				resolve: (result) => result.success,
			}),
		}),
	}
);
