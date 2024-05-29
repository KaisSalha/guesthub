import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import { Invite as InviteType, invites } from "../../db/schemas/invites.js";
import { Organization } from "./organization.js";
import { Role } from "./role.js";
import { resolveWindowedConnection } from "../../utils/resolveWindowedConnection.js";
import { count, eq } from "drizzle-orm";

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
		organization: t.loadable({
			type: Organization,
			load: async (ids, { loadMany }) => loadMany(Organization, ids),
			resolve: (parent) => parent.organization_id,
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
		resolve: async (_root, args, _ctx) => {
			try {
				const [invite] = await db
					.insert(invites)
					.values({
						email: args.input.email,
						organization_id: parseInt(args.input.orgId.id),
						role_id: parseInt(args.input.role.id),
					})
					.returning();

				return {
					success: true,
					invite,
				};
			} catch (error) {
				console.log(error);
				return {
					success: false,
				};
			}
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
