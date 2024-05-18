import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, integer, varchar, json } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { timeFields } from "./helpers/time";
import { PERMISSIONS } from "../../services/permissions";

export const roles = pgTable("roles", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	organization_id: integer("organization_id")
		.notNull()
		.references(() => organizations.id),
	permissions: json("permissions")
		.$type<Partial<PERMISSIONS>>()
		.default({})
		.notNull(),
	...timeFields,
});

export type Role = InferSelectModel<typeof roles>;
export type RoleInsert = InferInsertModel<typeof roles>;
