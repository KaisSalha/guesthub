import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const organizations = pgTable("organizations", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	owner_id: integer("owner_id")
		.notNull()
		.references(() => users.id),
	website: varchar("website", { length: 255 }),
	logo_url: varchar("logo_url", { length: 255 }),
	address: varchar("address", { length: 255 }).notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	state: varchar("state", { length: 100 }),
	country: varchar("country", { length: 100 }).notNull(),
	postal_code: varchar("postal_code", { length: 20 }),
	created_at: timestamp("created_at").defaultNow().notNull(),
});

export const organizationsRelations = relations(organizations, ({ one }) => ({
	owner: one(users, {
		fields: [organizations.owner_id],
		references: [users.id],
	}),
}));

export type Organization = InferSelectModel<typeof organizations>;
export type OrganizationInsert = InferInsertModel<typeof organizations>;
