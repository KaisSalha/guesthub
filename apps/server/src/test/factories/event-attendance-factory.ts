import { db } from "../../db/index.js";
import {
	EVENT_USER_ATTENDANCE_TYPE_ENUM,
	eventAttendance,
	EventAttendanceInsert,
} from "../../db/schemas/event-attendance.js";

interface EventAttendanceFactoryProps extends Partial<EventAttendanceInsert> {
	email: string;
	event_id: number;
	attendance_type: EVENT_USER_ATTENDANCE_TYPE_ENUM;
}

export const EventAttendanceFactory = async ({
	...props
}: EventAttendanceFactoryProps) => {
	const [membership] = await db
		.insert(eventAttendance)
		.values({
			travel_required: false,
			accommodation_required: false,
			...props,
		})
		.returning();

	return membership;
};
