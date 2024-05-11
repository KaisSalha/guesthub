import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import { Membership as MembershipType } from "../../db/schemas/memberships.js";
import { Organization } from "./organization.js";
import { Role } from "./role.js";
import { User } from "./user.js";

export const Membership = builder.loadableNodeRef("Membership", {
	id: {
		resolve: (membership) => membership.id,
	},
	load: async (ids: string[]) => {
		const memberships = await db.query.memberships.findMany({
			where: (memberships, { inArray }) =>
				inArray(
					memberships.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const membership = memberships.find(
				(membership) => membership.id == parseInt(id)
			);

			if (!membership) {
				return new Error(`Membership not found: ${id}`);
			}
			return membership;
		});
	},
});

Membership.implement({
	isTypeOf: (membership) => (membership as MembershipType).id !== undefined,
	fields: (t) => ({
		user: t.loadable({
			type: User,
			load: async (ids, { loadMany }) => loadMany(User, ids),
			resolve: (parent) => parent.user_id,
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
		created_at: t.string({
			nullable: true,
			resolve: (parent) => parent.created_at.toISOString(),
		}),
	}),
});
