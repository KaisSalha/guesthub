import { orgRoles } from "./org-roles.js";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
	pgTable,
	serial,
	integer,
	index,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";
import { users } from "./users.js";
import { timeFields } from "./helpers/time.js";

export const orgMemberships = pgTable(
	"org_memberships",
	{
		id: serial("id").primaryKey(),
		user_id: integer("user_id")
			.notNull()
			.references(() => users.id),
		organization_id: integer("organization_id")
			.notNull()
			.references(() => organizations.id),
		org_role_id: integer("org_role_id")
			.notNull()
			.references(() => orgRoles.id),
		...timeFields,
	},
	(table) => {
		return {
			org_memberships_user_idx: index("org_memberships_user_idx").on(
				table.user_id
			),
			org_memberships_organization_idx: index(
				"org_memberships_organization_idx"
			).on(table.organization_id),
			org_memberships_role_idx: index("org_memberships_role_idx").on(
				table.org_role_id
			),
			org_memberships_user_organization_idx: uniqueIndex(
				"org_memberships_user_organization_idx"
			).on(table.user_id, table.organization_id),
		};
	}
);

export const orgMembershipsRelations = relations(orgMemberships, ({ one }) => ({
	organization: one(organizations, {
		fields: [orgMemberships.organization_id],
		references: [organizations.id],
	}),
	role: one(orgRoles, {
		fields: [orgMemberships.org_role_id],
		references: [orgRoles.id],
	}),
	user: one(users, {
		fields: [orgMemberships.user_id],
		references: [users.id],
	}),
}));

export type OrgMembership = InferSelectModel<typeof orgMemberships>;
export type OrgMembershipInsert = InferInsertModel<typeof orgMemberships>;
