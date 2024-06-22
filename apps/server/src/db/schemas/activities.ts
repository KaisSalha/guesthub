import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	serial,
	varchar,
	jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { timeFields } from "./helpers/time.js";
import { organizations } from "./organizations.js";
import { events } from "./events.js";

export enum ACTIVITIES_ACTION_ENUM {
	UPDATED_ORGANIZATION = "UPDATED_ORGANIZATION",
	INVITED_TO_ORGANIZATION = "INVITED_TO_ORGANIZATION",
	JOINED_ORGANIZATION = "JOINED_ORGANIZATION",
	LEFT_ORGANIZATION = "LEFT_ORGANIZATION",

	CREATED_EVENT = "CREATED_EVENT",
	UPDATED_EVENT = "UPDATED_EVENT",
	CANCELED_EVENT = "CANCELED_EVENT",
	DELETED_EVENT = "DELETED_EVENT",
	INVITED_TO_EVENT = "INVITED_TO_EVENT",
	JOINED_EVENT = "JOINED_EVENT",
}

export const activitiesActionEnum = pgEnum(
	"activities_action",
	Object.values(ACTIVITIES_ACTION_ENUM) as [string, ...string[]]
);

export const activities = pgTable("activities", {
	id: serial("id").primaryKey(),
	organization_id: integer("organization_id")
		.notNull()
		.references(() => organizations.id),
	event_id: integer("event_id").references(() => events.id),
	user_id: integer("user_id")
		.notNull()
		.references(() => users.id),
	action: activitiesActionEnum("action")
		.notNull()
		.$type<ACTIVITIES_ACTION_ENUM>(),
	object_id: varchar("object_id", { length: 255 }).notNull(),
	meta: jsonb("meta"),
	...timeFields,
});

export const activitiesRelations = relations(activities, ({ one }) => ({
	organization: one(organizations, {
		fields: [activities.organization_id],
		references: [organizations.id],
	}),
	event: one(events, {
		fields: [activities.event_id],
		references: [events.id],
	}),
	user: one(users, {
		fields: [activities.user_id],
		references: [users.id],
	}),
}));

export type Activity = InferSelectModel<typeof activities>;
export type ActivityInsert = InferInsertModel<typeof activities>;
