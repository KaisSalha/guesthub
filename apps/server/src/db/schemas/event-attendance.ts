import {
	pgTable,
	uuid,
	integer,
	pgEnum,
	uniqueIndex,
	varchar,
	boolean,
	index,
} from "drizzle-orm/pg-core";
import { timeFields } from "./helpers/time.js";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { users } from "./users.js";
import { events } from "./events.js";

export enum EVENT_ATTENDANCE_STATUS_ENUM {
	PENDING = "pending",
	ACCEPTED = "accepted",
	DECLINED = "declined",
}

export const eventAttendanceStatusEnum = pgEnum(
	"event_attendance_status",
	Object.values(EVENT_ATTENDANCE_STATUS_ENUM) as [string, ...string[]]
);

export enum EVENT_USER_ATTENDANCE_TYPE_ENUM {
	TEAM = "team",
	ORG_GUEST = "org_guest",
	SPECIAL_GUEST = "special_guest",
}

export const eventUserAttendanceTypeEnum = pgEnum(
	"event_user_attendance_type",
	Object.values(EVENT_USER_ATTENDANCE_TYPE_ENUM) as [string, ...string[]]
);

export const eventAttendance = pgTable(
	"event_attendance",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: varchar("email", { length: 256 }).notNull(),
		event_id: integer("event_id")
			.notNull()
			.references(() => events.id),
		attendance_type: eventUserAttendanceTypeEnum("attendance_type")
			.notNull()
			.$type<EVENT_USER_ATTENDANCE_TYPE_ENUM>(),
		status: eventAttendanceStatusEnum("status")
			.notNull()
			.default("pending")
			.$type<EVENT_ATTENDANCE_STATUS_ENUM>(),
		travel_required: boolean("travel_required").notNull(),
		accommodation_required: boolean("accommodation_required").notNull(),
		...timeFields,
	},
	(table) => {
		return {
			event_attendance_user_event_idx: uniqueIndex(
				"event_attendance_email_event_idx"
			).on(table.email, table.event_id),
			event_attendance_email_idx: index("event_attendance_email_idx").on(
				table.email
			),
		};
	}
);

export const eventAttendanceRelations = relations(
	eventAttendance,
	({ one }) => ({
		event: one(events, {
			fields: [eventAttendance.event_id],
			references: [events.id],
		}),
		user: one(users, {
			fields: [eventAttendance.email],
			references: [users.email],
		}),
	})
);

export type EventAttendance = InferSelectModel<typeof eventAttendance>;
export type EventAttendanceInsert = InferInsertModel<typeof eventAttendance>;
