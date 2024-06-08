import { builder } from "../../builder.js";
import { db } from "../../../db/index.js";
import {
	Organization as OrganizationType,
	organizations,
} from "../../../db/schemas/organizations.js";
import { User } from "../user/user.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { orgRoles } from "../../../db/schemas/orgRoles.js";
import {
	ADMIN_PERMISSIONS,
	PERMISSIONS,
} from "../../../services/permissions.js";
import { orgMemberships } from "../../../db/schemas/orgMemberships.js";

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
			authScopes: {
				isAuthenticated: true,
			},
		}),
		owner: t.loadable({
			type: User,
			load: async (ids, { loadMany }) => loadMany(User, ids),
			resolve: (parent) => parent.owner_id,
			authScopes: {
				isAuthenticated: true,
			},
		}),
		website: t.exposeString("website", { nullable: true }),
		logo_url: t.field({
			type: "S3File",
			nullable: true,
			resolve: (parent) =>
				parent.logo_url
					? {
							url: parent.logo_url,
						}
					: null,
		}),
		address: t.exposeString("address"),
		city: t.exposeString("city"),
		state: t.exposeString("state", { nullable: true }),
		country_code: t.field({
			type: "CountryCode",
			resolve: (parent) => parent.country_code,
		}),
		postal_code: t.exposeString("postal_code", { nullable: true }),
		timezone: t.field({
			type: "TimeZone",
			resolve: (parent) => parent.timezone,
		}),
		lat: t.field({
			type: "Latitude",
			nullable: true,
			resolve: (parent) => parent.lat,
			authScopes: {
				isAuthenticated: true,
			},
		}),
		lng: t.field({
			type: "Longitude",
			nullable: true,
			resolve: (parent) => parent.lng,
			authScopes: {
				isAuthenticated: true,
			},
		}),
		created_at: t.field({
			type: "Timestamp",
			nullable: true,
			resolve: (parent) => parent.created_at,
			authScopes: {
				isAuthenticated: true,
			},
		}),
		updated_at: t.field({
			type: "Timestamp",
			nullable: true,
			resolve: (parent) => parent.updated_at,
			authScopes: {
				isAuthenticated: true,
			},
		}),
	}),
});

builder.queryFields((t) => ({
	organization: t
		.withAuth({
			isAuthenticated: true,
		})
		.field({
			type: Organization,
			nullable: true,
			args: {
				id: t.arg.globalID({ required: true }),
			},
			authScopes: async (_, args, ctx) => {
				const userBelongsToOrg = ctx.user.orgMemberships?.some(
					(orgMembership) =>
						orgMembership.organization.id === parseInt(args.id.id)
				);

				return !!userBelongsToOrg;
			},
			resolve: (_root, args) => args.id.id,
		}),
}));

builder.relayMutationField(
	"createOrganization",
	{
		inputFields: (t) => ({
			name: t.field({
				type: "NonEmptyString",
				required: true,
			}),
			website: t.string({ required: false }),
			logo_url: t.string({ required: false }),
			address: t.field({
				type: "NonEmptyString",
				required: true,
			}),
			city: t.field({
				type: "NonEmptyString",
				required: true,
			}),
			state: t.string({ required: false }),
			country_code: t.field({
				type: "CountryCode",
				required: true,
			}),
			postal_code: t.string({ required: false }),
			timezone: t.field({
				type: "TimeZone",
				required: true,
			}),
			lat: t.field({
				type: "Latitude",
				required: false,
			}),
			lng: t.field({
				type: "Longitude",
				required: false,
			}),
		}),
	},
	{
		authScopes: {
			isAuthenticated: true,
		},
		resolve: async (_root, args, ctx) => {
			try {
				if (!ctx.user) {
					throw new Error("User required");
				}

				// Create org
				const [organization] = await db
					.insert(organizations)
					.values({
						name: args.input.name,
						owner_id: ctx.user.id,
						website: args.input.website,
						logo_url: args.input.logo_url,
						address: args.input.address,
						city: args.input.city,
						state: args.input.state,
						country_code: args.input.country_code,
						postal_code: args.input.postal_code,
						timezone: args.input.timezone,
						lat: args.input.lat,
						lng: args.input.lng,
					})
					.returning()
					.execute();

				// Add org roles
				const [role] = await db
					.insert(orgRoles)
					.values({
						name: "admin",
						organization_id: organization.id,
						permissions: ADMIN_PERMISSIONS,
					})
					.returning()
					.execute();

				await db
					.insert(orgRoles)
					.values({
						name: "user",
						organization_id: organization.id,
						permissions: PERMISSIONS,
					})
					.execute();

				// Create membership
				await db
					.insert(orgMemberships)
					.values({
						user_id: ctx.user.id,
						org_role_id: role.id,
						organization_id: organization.id,
					})
					.execute();

				return {
					success: true,
					organization,
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
			organization: t.field({
				type: Organization,
				nullable: true,
				resolve: (result) => result?.organization,
			}),
		}),
	}
);
