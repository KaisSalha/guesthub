import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, integer, varchar, json } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";
import { timeFields } from "./helpers/time.js";
import { PERMISSIONS } from "../../services/org-permissions.js";

export const orgRoles = pgTable("org_roles", {
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

export const orgRolesRelations = relations(orgRoles, ({ one }) => ({
	organization: one(organizations, {
		fields: [orgRoles.organization_id],
		references: [organizations.id],
	}),
}));

export type OrgRole = InferSelectModel<typeof orgRoles>;
export type OrgRoleInsert = InferInsertModel<typeof orgRoles>;
