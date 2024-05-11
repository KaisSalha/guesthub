import { roles } from "./roles";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";
import { timeFields } from "./helpers/time";

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
