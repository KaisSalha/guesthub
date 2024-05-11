import { timeFields } from "./helpers/time";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", ["org", "guest"]);

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 256 }).notNull(),
	password: varchar("password", { length: 256 }).notNull(),
	first_name: varchar("first_name", { length: 256 }),
	last_name: varchar("last_name", { length: 256 }),
	type: userTypeEnum("user_type").notNull(),
	...timeFields,
});

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
