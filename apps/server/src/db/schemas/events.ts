import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
	date,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { locationFields } from "./helpers/location.js";
import { timeFields } from "./helpers/time.js";
import { organizations } from "./organizations.js";

export const events = pgTable("events", {
	id: serial("id").primaryKey(),
	organization_id: integer("organization_id")
		.notNull()
		.references(() => organizations.id),
	name: varchar("name", { length: 255 }).notNull(),
	tagline: varchar("tagline", { length: 255 }),
	description: text("description"),
	website: varchar("website", { length: 255 }),
	banner_url: varchar("banner_url", { length: 255 }),
	logo_url: varchar("logo_url", { length: 255 }),
	start_date: date("start_date", { mode: "date" }).notNull(),
	end_date: date("end_date", { mode: "date" }).notNull(),
	created_by_id: integer("created_by_id")
		.notNull()
		.references(() => users.id),
	canceled_at: timestamp("canceled_at"),
	...locationFields,
	...timeFields,
});

export const eventsRelations = relations(events, ({ one }) => ({
	organization: one(organizations, {
		fields: [events.organization_id],
		references: [organizations.id],
	}),
	created_by: one(users, {
		fields: [events.created_by_id],
		references: [users.id],
	}),
}));

export type Event = InferSelectModel<typeof events>;
export type EventInsert = InferInsertModel<typeof events>;
