import { encodeGlobalID } from "@pothos/plugin-relay";
import locationTimezone from "node-location-timezone";
import { and, count, eq, inArray } from "drizzle-orm";
import { render } from "@react-email/render";
import { builder } from "../../builder.js";
import { db } from "../../../db/index.js";
import {
	OrgInvite as OrgInviteType,
	ORG_INVITE_STATUS_ENUM,
	orgInvites,
} from "../../../db/schemas/org-invites.js";
import { Organization } from "../organization/organization.js";
import { OrgRole } from "../org-role/org-role.js";
import { resolveWindowedConnection } from "../../../utils/resolveWindowedConnection.js";
import { resend } from "../../../lib/resend.js";
import { OrgInviteEmail } from "../../../emails/org/invite-team-member.js";
import { organizations } from "../../../db/schemas/organizations.js";
import { getCityAddress } from "../../../utils/address.js";
import { users } from "../../../db/schemas/users.js";
import { orgMemberships } from "../../../db/schemas/org-memberships.js";
import { User } from "../user/user.js";
import { OrgMembership } from "../org-membership/org-membership.js";
import { emailsUsersLoader } from "../../loaders/emails-users-loader.js";

const OrgInviteStatus = builder.enumType("OrgInviteStatus", {
	values: Object.values(ORG_INVITE_STATUS_ENUM),
});

export const OrgInvite = builder.loadableNodeRef("OrgInvite", {
	id: {
		resolve: (orgInvite) => orgInvite.id,
	},
	load: async (ids: string[]) => {
		const orgInvites = await db.query.orgInvites.findMany({
			where: (orgInvites, { inArray }) => inArray(orgInvites.id, ids),
		});

		return ids.map((id) => {
			const orgInvite = orgInvites.find(
				(orgInvite) => orgInvite.id == id
			);

			if (!orgInvite) {
				return new Error(`Organization invite not found: ${id}`);
			}
			return orgInvite;
		});
	},
});

OrgInvite.implement({
	isTypeOf: (orgInvite) => (orgInvite as OrgInviteType).id !== undefined,
	fields: (t) => ({
		email: t.field({
			type: "Email",
			resolve: (parent) => parent.email,
		}),
		role: t.loadable({
			type: OrgRole,
			load: async (ids, { loadMany }) => loadMany(OrgRole, ids),
			resolve: (parent) => parent.org_role_id,
		}),
		status: t.field({
			type: OrgInviteStatus,
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
	orgInvite: t.field({
		type: OrgInvite,
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
	userOrgInvites: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: OrgInvite,
			nullable: true,
			args: {
				offset: t.arg.int({ required: true }),
			},
			resolve: async (_parent, args, ctx) => {
				if (!ctx.user) {
					throw new Error("User required");
				}

				return await resolveWindowedConnection(
					{ args },
					async ({ limit }) => {
						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(orgInvites)
								.where(eq(orgInvites.email, ctx.user.email))
								.limit(limit)
								.offset(args.offset),
							db.select({ value: count() }).from(orgInvites),
						]);

						return {
							items,
							totalCount: totalCount[0].value,
						};
					}
				);
			},
		}),
	orgTeamInvites: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: OrgInvite,
			nullable: true,
			args: {
				offset: t.arg.int({ required: true }),
				orgId: t.arg.globalID({ required: true }),
			},
			authScopes: async (_, args, ctx) => {
				const userBelongsToOrg = ctx.user.orgMemberships?.some(
					(orgMembership) =>
						orgMembership.organization.id ===
						parseInt(args.orgId.id)
				);

				return !!userBelongsToOrg;
			},
			resolve: async (_parent, args, ctx) => {
				if (!ctx.user) {
					throw new Error("User required");
				}

				const filter = eq(
					orgInvites.organization_id,
					parseInt(args.orgId.id)
				);

				return await resolveWindowedConnection(
					{ args },
					async ({ limit }) => {
						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(orgInvites)
								.where(filter)
								.limit(limit)
								.offset(args.offset),
							db
								.select({ value: count() })
								.from(orgInvites)
								.where(filter),
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
			orgRoleId: t.globalID({ required: true }),
		}),
	},
	{
		authScopes: async (_, args, ctx) => {
			if (!ctx.user) {
				throw new Error("User required");
			}

			const membership = ctx.user.orgMemberships?.find(
				(orgMembership) =>
					orgMembership.organization.id ===
					parseInt(args.input.orgId.id)
			);

			if (!membership)
				throw new Error("User does not belong to organization");

			return membership.role.permissions.CAN_INVITE_GUESTS;
		},
		resolve: async (_root, args, ctx) => {
			if (!ctx.user) {
				throw new Error("User required");
			}

			const email = args.input.email.toLowerCase();

			// Check if there is an invite that is pending or accepted for the email and org
			const [existingInvite] = await db
				.select()
				.from(orgInvites)
				.where(
					and(
						eq(orgInvites.email, email),
						eq(
							orgInvites.organization_id,
							parseInt(args.input.orgId.id)
						),
						inArray(orgInvites.status, [
							ORG_INVITE_STATUS_ENUM.PENDING,
							ORG_INVITE_STATUS_ENUM.ACCEPTED,
						])
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
				.rightJoin(orgMemberships, eq(orgMemberships.user_id, users.id))
				.where(
					and(
						eq(users.email, email),
						eq(
							orgMemberships.organization_id,
							parseInt(args.input.orgId.id)
						)
					)
				);

			if (result?.org_memberships) {
				throw new Error("User already exists in the organization");
			}

			const org = await db.query.organizations.findFirst({
				where: eq(organizations.id, parseInt(args.input.orgId.id)),
			});

			if (!org) throw new Error("Organization not found");

			const name = `${ctx.user.first_name} ${ctx.user.last_name}`;

			const [invite] = await db
				.insert(orgInvites)
				.values({
					email,
					organization_id: parseInt(args.input.orgId.id),
					org_role_id: parseInt(args.input.orgRoleId.id),
				})
				.returning();

			const html = render(
				OrgInviteEmail({
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
				await db.delete(orgInvites).where(eq(orgInvites.id, invite.id));

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
				type: OrgInvite,
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
				if (!ctx.user) {
					throw new Error("User required");
				}

				const [invitation] = await db
					.select()
					.from(orgInvites)
					.where(eq(orgInvites.id, args.input.inviteId.id));

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
			if (!ctx.user) {
				throw new Error("User required");
			}

			await db.transaction(async (tx) => {
				const [invite] = await tx
					.update(orgInvites)
					.set({ status: ORG_INVITE_STATUS_ENUM.ACCEPTED })
					.where(eq(orgInvites.id, args.input.inviteId.id))
					.returning();

				await tx.insert(orgMemberships).values({
					user_id: ctx.user!.id,
					organization_id: invite.organization_id,
					org_role_id: invite.org_role_id,
				});
			});

			OrgMembership.getDataloader(ctx).clearAll();

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
