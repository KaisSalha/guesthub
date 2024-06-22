import { builder } from "../../builder.js";
import { db } from "../../../db/index.js";
import { User } from "../user/user.js";
import {
	ACTIVITIES_ACTION_ENUM,
	Activity as ActivityType,
	activities,
} from "../../../db/schemas/activities.js";
import { resolveWindowedConnection } from "../../../utils/resolveWindowedConnection.js";
import { count, eq } from "drizzle-orm";
import { Organization } from "../organization/organization.js";

const ActivityAction = builder.enumType("ActivityAction", {
	values: Object.values(ACTIVITIES_ACTION_ENUM),
});

export const Activity = builder.loadableNodeRef("Activity", {
	id: {
		resolve: (activity) => activity.id,
	},
	load: async (ids: string[]) => {
		const activities = await db.query.activities.findMany({
			where: (activities, { inArray }) =>
				inArray(
					activities.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const activity = activities.find(
				(activity) => activity.id == parseInt(id)
			);

			if (!activity) {
				return new Error(`Activity not found: ${id}`);
			}
			return activity;
		});
	},
});

Activity.implement({
	isTypeOf: (activity) => (activity as ActivityType).id !== undefined,
	authScopes: {
		isAuthenticated: true,
	},
	fields: (t) => ({
		user: t.loadable({
			type: User,
			load: async (ids, { loadMany }) => loadMany(User, ids),
			resolve: (parent) => parent.user_id,
		}),
		organization: t.loadable({
			type: Organization,
			load: async (ids, { loadMany }) => loadMany(Organization, ids),
			resolve: (parent) => parent.organization_id,
		}),
		action: t.field({
			type: ActivityAction,
			resolve: (parent) => parent.action,
		}),
		object_id: t.exposeString("object_id"),
		meta: t.field({
			type: "JSON",
			resolve: (parent) => parent.meta,
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
	orgActivities: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: Activity,
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
							activities.organization_id,
							parseInt(args.orgId.id)
						);

						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(activities)
								.where(filter)
								.limit(limit)
								.offset(args.offset),
							db
								.select({ value: count() })
								.from(activities)
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
