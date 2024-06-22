import { db } from "../../db/index.js";
import {
	activities,
	ACTIVITIES_ACTION_ENUM,
	ActivityInsert,
} from "../../db/schemas/activities.js";

interface ActivityFactoryProps extends Partial<ActivityInsert> {
	organization_id: number;
	user_id: number;
}

export const ActivityFactory = async ({
	organization_id,
	user_id,
	...props
}: ActivityFactoryProps) => {
	const [activity] = await db
		.insert(activities)
		.values({
			organization_id,
			user_id,
			action: ACTIVITIES_ACTION_ENUM.CREATED_EVENT,
			object_id: "1",
			...props,
		})
		.returning();

	return activity;
};

export const ActivitiesFactory = async ({
	organization_id,
	user_id,
	...props
}: ActivityFactoryProps) => {
	const result = await db
		.insert(activities)
		.values([
			{
				organization_id,
				user_id,
				action: ACTIVITIES_ACTION_ENUM.CREATED_EVENT,
				object_id: "1",
				...props,
			},
			{
				organization_id,
				user_id,
				action: ACTIVITIES_ACTION_ENUM.INVITED_TO_EVENT,
				object_id: "2",
				...props,
			},
		])
		.returning();

	return result;
};
