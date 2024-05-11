import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import { Organization as OrganizationType } from "../../db/schemas/organizations.js";
import { User } from "./user.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

export const Organization = builder.loadableNodeRef("Organization", {
	id: {
		resolve: (organization) => organization.id,
	},
	load: async (ids: string[]) => {
		const organizations = await db.query.organizations.findMany({
			where: (organizations, { inArray }) =>
				inArray(
					organizations.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const user = organizations.find(
				(organization) => organization.id == parseInt(id)
			);

			if (!user) {
				return new Error(`User not found: ${id}`);
			}
			return user;
		});
	},
});

Organization.implement({
	isTypeOf: (organization) =>
		(organization as OrganizationType).id !== undefined,
	fields: (t) => ({
		name: t.exposeString("name"),
		owner_id: t.globalID({
			resolve: (organization) =>
				encodeGlobalID("User", organization.owner_id),
		}),
		owner: t.loadable({
			type: User,
			load: async (ids, { loadMany }) => loadMany(User, ids),
			resolve: (parent) => parent.owner_id,
		}),
		website: t.exposeString("website", { nullable: true }),
		logo_url: t.exposeString("logo_url", { nullable: true }),
		address: t.exposeString("address"),
		city: t.exposeString("city"),
		state: t.exposeString("state", { nullable: true }),
		country: t.exposeString("country"),
		postal_code: t.exposeString("postal_code", { nullable: true }),
		created_at: t.string({
			nullable: true,
			resolve: (parent) => parent.created_at.toISOString(),
		}),
	}),
});

builder.queryFields((t) => ({
	organization: t.field({
		type: Organization,
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
}));
