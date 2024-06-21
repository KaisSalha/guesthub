import { timeFields } from "./helpers/time.js";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { orgRoles } from "./org-roles.js";
import { organizations } from "./organizations.js";
import { orgInvites } from "./org-invites.js";
import { orgMemberships } from "./org-memberships.js";

export const userTypeEnum = pgEnum("user_type", ["org", "guest"]);

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 256 }).notNull().unique(),
	password: varchar("password", { length: 256 }).notNull(),
	first_name: varchar("first_name", { length: 256 }),
	last_name: varchar("last_name", { length: 256 }),
	avatar_url: varchar("avatar_url", { length: 256 }),
	type: userTypeEnum("user_type").notNull(),
	...timeFields,
});

export const usersRelations = relations(users, ({ many }) => ({
	organization: many(organizations),
	orgMemberships: many(orgMemberships),
	orgRoles: many(orgRoles),
	orgInvites: many(orgInvites),
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
