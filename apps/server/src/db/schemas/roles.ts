import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, integer, varchar, json } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";
import { timeFields } from "./helpers/time.js";
import { PERMISSIONS } from "../../services/permissions.js";

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

export const rolesRelations = relations(roles, ({ one }) => ({
	organization: one(organizations, {
		fields: [roles.organization_id],
		references: [organizations.id],
	}),
}));

export type Role = InferSelectModel<typeof roles>;
export type RoleInsert = InferInsertModel<typeof roles>;
