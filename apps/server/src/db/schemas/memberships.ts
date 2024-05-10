import { roles } from "./roles";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, timestamp, integer, json } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const memberships = pgTable("roles", {
	id: serial("id").primaryKey(),
	owner_id: integer("owner_id")
		.notNull()
		.references(() => users.id),
	organization_id: integer("organization_id")
		.notNull()
		.references(() => organizations.id),
	role_id: integer("role_id")
		.notNull()
		.references(() => roles.id),
	permissions: json("permissions").default({}).notNull(),
	created_at: timestamp("created_at").defaultNow().notNull(),
});

export type Membership = InferSelectModel<typeof memberships>;
export type MembershipInsert = InferInsertModel<typeof memberships>;
