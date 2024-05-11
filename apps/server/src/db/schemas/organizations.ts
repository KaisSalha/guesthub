import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { locationFields } from "./helpers/location";
import { timeFields } from "./helpers/time";

export const organizations = pgTable("organizations", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	owner_id: integer("owner_id")
		.notNull()
		.references(() => users.id),
	website: varchar("website", { length: 255 }),
	logo_url: varchar("logo_url", { length: 255 }),
	...locationFields,
	...timeFields,
});

export const organizationsRelations = relations(organizations, ({ one }) => ({
	owner: one(users, {
		fields: [organizations.owner_id],
		references: [users.id],
	}),
}));

export type Organization = InferSelectModel<typeof organizations>;
export type OrganizationInsert = InferInsertModel<typeof organizations>;
