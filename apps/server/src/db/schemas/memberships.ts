import { roles } from "./roles.js";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";
import { users } from "./users.js";
import { timeFields } from "./helpers/time.js";

export const memberships = pgTable("memberships", {
	id: serial("id").primaryKey(),
	user_id: integer("user_id")
		.notNull()
		.references(() => users.id),
	organization_id: integer("organization_id")
		.notNull()
		.references(() => organizations.id),
	role_id: integer("role_id")
		.notNull()
		.references(() => roles.id),
	...timeFields,
});

export type Membership = InferSelectModel<typeof memberships>;
export type MembershipInsert = InferInsertModel<typeof memberships>;
