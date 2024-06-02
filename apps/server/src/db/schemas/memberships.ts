import { roles } from "./roles.js";
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

export const memberships = pgTable(
	"memberships",
	{
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
	},
	(table) => {
		return {
			memberships_user_idx: index("memberships_user_idx").on(
				table.user_id
			),
			memberships_organization_idx: index(
				"memberships_organization_idx"
			).on(table.organization_id),
			memberships_role_idx: index("memberships_role_idx").on(
				table.role_id
			),
			memberships_user_organization_idx: uniqueIndex(
				"memberships_user_organization_idx"
			).on(table.user_id, table.organization_id),
		};
	}
);

export const membershipsRelations = relations(memberships, ({ one }) => ({
	organization: one(organizations, {
		fields: [memberships.organization_id],
		references: [organizations.id],
	}),
	role: one(roles, {
		fields: [memberships.role_id],
		references: [roles.id],
	}),
	user: one(users, {
		fields: [memberships.user_id],
		references: [users.id],
	}),
}));

export type Membership = InferSelectModel<typeof memberships>;
export type MembershipInsert = InferInsertModel<typeof memberships>;
