import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import { Role as RoleType } from "../../db/schemas/roles.js";
import { Organization } from "./organization.js";
import { PERMISSIONS } from "@/permissions.js";

export const Role = builder.loadableNodeRef("Role", {
	id: {
		resolve: (role) => role.id,
	},
	load: async (ids: string[]) => {
		const roles = await db.query.roles.findMany({
			where: (roles, { inArray }) =>
				inArray(
					roles.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const role = roles.find((role) => role.id == parseInt(id));

			if (!role) {
				return new Error(`Role not found: ${id}`);
			}
			return role;
		});
	},
});

Role.implement({
	isTypeOf: (role) => (role as RoleType).id !== undefined,
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
				return {
					...PERMISSIONS,
					...parent.permissions,
				};
			},
		}),
		created_at: t.string({
			nullable: true,
			resolve: (parent) => parent.created_at.toISOString(),
		}),
	}),
});

builder.queryFields((t) => ({
	role: t.field({
		type: Role,
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
	roles: t.field({
		type: [Role],
		nullable: true,
		args: {
			ids: t.arg.globalIDList({ required: false }),
		},
		resolve: async (_parent, args) => {
			if (args.ids) {
				return [...args.ids.map(({ id }) => id)];
			}

			return await db.query.roles.findMany();
		},
	}),
}));
