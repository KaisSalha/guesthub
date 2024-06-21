import { builder } from "../../builder.js";
import { db } from "../../../db/index.js";
import {
	OrgRole as OrgRoleType,
	orgRoles,
} from "../../../db/schemas/org-roles.js";
import { Organization } from "../organization/organization.js";
import {
	getAdminPermissions,
	getUserPermissions,
} from "../../../services/permissions.js";
import { resolveWindowedConnection } from "../../../utils/resolveWindowedConnection.js";
import { count, eq } from "drizzle-orm";

export const OrgRole = builder.loadableNodeRef("OrgRole", {
	id: {
		resolve: (orgRole) => orgRole.id,
	},
	load: async (ids: string[]) => {
		const orgRoles = await db.query.orgRoles.findMany({
			where: (orgRoles, { inArray }) =>
				inArray(
					orgRoles.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const orgRole = orgRoles.find(
				(orgRole) => orgRole.id == parseInt(id)
			);

			if (!orgRole) {
				return new Error(`Organization role not found: ${id}`);
			}

			return orgRole;
		});
	},
});

OrgRole.implement({
	isTypeOf: (orgRole) => (orgRole as OrgRoleType).id !== undefined,
	authScopes: {
		isAuthenticated: true,
	},
	fields: (t) => ({
		name: t.exposeString("name"),
		organization: t.loadable({
			type: Organization,
			load: async (ids, { loadMany }) => loadMany(Organization, ids),
			resolve: (parent) => parent.organization_id,
		}),
		permissions: t.field({
			type: "JSON",
			resolve: (parent) => {
				if (parent.name === "admin")
					return getAdminPermissions({
						permissions: parent.permissions,
					});

				return getUserPermissions({
					permissions: parent.permissions,
				});
			},
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
	orgRoles: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: OrgRole,
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
						const filter = eq(
							orgRoles.organization_id,
							parseInt(args.orgId.id)
						);

						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(orgRoles)
								.where(filter)
								.limit(limit)
								.offset(args.offset),
							db
								.select({ value: count() })
								.from(orgRoles)
								.where(filter),
						]);

						return {
							items: items.map((item) => ({
								...item,
								permissions:
									item.name === "admin"
										? getAdminPermissions({
												permissions: item.permissions,
											})
										: getUserPermissions({
												permissions: item.permissions,
											}),
							})),
							totalCount: totalCount[0].value,
						};
					}
				);
			},
		}),
	orgAllRoles: t
		.withAuth({
			isAuthenticated: true,
		})
		.field({
			type: [OrgRole],
			args: {
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
				const items = await db
					.select()
					.from(orgRoles)
					.where(
						eq(orgRoles.organization_id, parseInt(args.orgId.id))
					);

				return items;
			},
		}),
}));
