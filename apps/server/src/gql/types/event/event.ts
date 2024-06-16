import { builder } from "../../builder.js";
import { db } from "../../../db/index.js";
import { Event as EventType, events } from "../../../db/schemas/events.js";
import { User } from "../user/user.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { Organization } from "../organization/organization.js";
import { count, eq } from "drizzle-orm";
import { resolveWindowedConnection } from "../../../utils/resolveWindowedConnection.js";

export const Event = builder.loadableNodeRef("Event", {
	id: {
		resolve: (event) => event.id,
	},
	load: async (ids: string[]) => {
		const events = await db.query.events.findMany({
			where: (events, { inArray }) =>
				inArray(
					events.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const event = events.find((event) => event.id == parseInt(id));

			if (!event) {
				return new Error(`Event not found: ${id}`);
			}
			return event;
		});
	},
});

Event.implement({
	isTypeOf: (event) => (event as EventType).id !== undefined,
	fields: (t) => ({
		name: t.exposeString("name"),
		organization_id: t.globalID({
			resolve: (event) =>
				encodeGlobalID("Organization", event.organization_id),
		}),
		organization: t.loadable({
			type: Organization,
			load: async (ids, { loadMany }) => loadMany(Organization, ids),
			resolve: (parent) => parent.organization_id,
		}),
		created_by_id: t.globalID({
			resolve: (event) => encodeGlobalID("User", event.created_by_id),
		}),
		created_by: t.loadable({
			type: User,
			load: async (ids, { loadMany }) => loadMany(User, ids),
			resolve: (parent) => parent.created_by_id,
		}),
		tagline: t.exposeString("tagline", { nullable: true }),
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
		banner_url: t.field({
			type: "S3File",
			nullable: true,
			resolve: (parent) =>
				parent.banner_url
					? {
							url: parent.banner_url,
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
		plus_code: t.exposeString("plus_code", { nullable: true }),
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
		start_time: t.field({
			type: "Timestamp",
			resolve: (parent) => parent.start_time,
		}),
		end_time: t.field({
			type: "Timestamp",
			resolve: (parent) => parent.end_time,
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
	event: t
		.withAuth({
			isAuthenticated: true,
		})
		.field({
			type: Event,
			nullable: true,
			args: {
				id: t.arg.globalID({ required: true }),
			},
			authScopes: async (_, args, ctx) => {
				const event = await db.query.events.findFirst({
					where: eq(events.id, parseInt(args.id.id)),
				});

				const userBelongsToOrgOfEvent = ctx.user.orgMemberships?.some(
					(orgMembership) =>
						orgMembership.organization.id === event?.organization_id
				);

				return !!userBelongsToOrgOfEvent;
			},
			resolve: (_root, args) => args.id.id,
		}),
	orgEvents: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: Event,
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
							events.organization_id,
							parseInt(args.orgId.id)
						);

						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(events)
								.where(filter)
								.limit(limit)
								.offset(args.offset),
							db
								.select({ value: count() })
								.from(events)
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

builder.relayMutationField(
	"createEvent",
	{
		inputFields: (t) => ({
			orgId: t.globalID({ required: true }),
			name: t.field({
				type: "NonEmptyString",
				required: true,
			}),
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
			start_time: t.field({
				type: "Timestamp",
				required: true,
			}),
			end_time: t.field({
				type: "Timestamp",
				required: true,
			}),
			tagline: t.string({ required: false }),
			website: t.string({ required: false }),
			logo_url: t.string({ required: false }),
			banner_url: t.string({ required: false }),
			plus_code: t.string({ required: false }),
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
		authScopes: async (_, args, ctx) => {
			if (!ctx.user) {
				throw new Error("User required");
			}

			const membership = ctx.user.orgMemberships?.find(
				(orgMembership) =>
					orgMembership.organization.id ===
					parseInt(args.input.orgId.id)
			);

			if (!membership) return false;

			return membership.role.permissions.CAN_UPDATE_EVENT;
		},
		resolve: async (_root, args, ctx) => {
			if (!ctx.user) {
				throw new Error("User required");
			}

			if (args.input.end_time <= args.input.start_time) {
				throw new Error("End time must be greater than start time");
			}

			// Create org
			const [event] = await db
				.insert(events)
				.values({
					name: args.input.name,
					tagline: args.input.tagline,
					organization_id: parseInt(args.input.orgId.id),
					created_by_id: ctx.user.id,
					website: args.input.website,
					logo_url: args.input.logo_url,
					banner_url: args.input.banner_url,
					address: args.input.address,
					city: args.input.city,
					state: args.input.state,
					country_code: args.input.country_code,
					postal_code: args.input.postal_code,
					timezone: args.input.timezone,
					lat: args.input.lat,
					lng: args.input.lng,
					start_time: args.input.start_time,
					end_time: args.input.end_time,
				})
				.returning()
				.execute();

			return {
				success: true,
				event,
			};
		},
	},
	{
		outputFields: (t) => ({
			success: t.boolean({
				resolve: (result) => result.success,
			}),
			event: t.field({
				type: Event,
				nullable: true,
				resolve: (result) => result?.event,
			}),
		}),
	}
);
