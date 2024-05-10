import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
	pgTable,
	serial,
	timestamp,
	integer,
	varchar,
	json,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const roles = pgTable("roles", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	organization_id: integer("organization_id")
		.notNull()
		.references(() => organizations.id),
	permissions: json("permissions").default({}).notNull(),
	created_at: timestamp("created_at").defaultNow().notNull(),
});

export type Role = InferSelectModel<typeof roles>;
export type RoleInsert = InferInsertModel<typeof roles>;
