import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import {
	OrgMembership as OrgMembershipType,
	orgMemberships,
} from "../../db/schemas/orgMemberships.js";
import { Organization } from "./organization.js";
import { OrgRole } from "./orgRole.js";
import { User } from "./user.js";
import { resolveWindowedConnection } from "../../utils/resolveWindowedConnection.js";
import { count, eq } from "drizzle-orm";

export const OrgMembership = builder.loadableNodeRef("OrgMembership", {
	id: {
		resolve: (orgMembership) => orgMembership.id,
	},
	load: async (ids: string[]) => {
		const orgMemberships = await db.query.orgMemberships.findMany({
			where: (orgMemberships, { inArray }) =>
				inArray(
					orgMemberships.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const orgMembership = orgMemberships.find(
				(orgMembership) => orgMembership.id == parseInt(id)
			);

			if (!orgMembership) {
				return new Error(`Organization membership not found: ${id}`);
			}
			return orgMembership;
		});
	},
});

OrgMembership.implement({
	isTypeOf: (orgMembership) =>
		(orgMembership as OrgMembershipType).id !== undefined,
	authScopes: {
		isAuthenticated: true,
	},
	fields: (t) => ({
		user: t.loadable({
			type: User,
			load: async (ids, { loadMany }) => loadMany(User, ids),
			resolve: (parent) => parent.user_id,
		}),
		role: t.loadable({
			type: OrgRole,
			load: async (ids, { loadMany }) => loadMany(OrgRole, ids),
			resolve: (parent) => parent.org_role_id,
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
	orgMembers: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: OrgMembership,
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
			resolve: async (_parent, args) => {
				return await resolveWindowedConnection(
					{ args },
					async ({ limit }) => {
						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(orgMemberships)
								.where(
									eq(
										orgMemberships.organization_id,
										parseInt(args.orgId.id)
									)
								)
								.limit(limit)
								.offset(args.offset),
							db.select({ value: count() }).from(orgMemberships),
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
