import {
	pgTable,
	uuid,
	varchar,
	integer,
	pgEnum,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";
import { roles } from "./roles.js";
import { timeFields } from "./helpers/time.js";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { users } from "./users.js";

export const inviteStatusEnum = pgEnum("invite_status", [
	"pending",
	"accepted",
	"declined",
]);

export const invites = pgTable(
	"invites",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: varchar("email", { length: 256 }).notNull(),
		organization_id: integer("organization_id")
			.notNull()
			.references(() => organizations.id),
		role_id: integer("role_id")
			.notNull()
			.references(() => roles.id),
		status: inviteStatusEnum("status").notNull().default("pending"),
		...timeFields,
	},
	(table) => {
		return {
			invites_email_org_idx: uniqueIndex("invites_email_org_idx").on(
				table.email,
				table.organization_id
			),
		};
	}
);

export const invitesRelations = relations(invites, ({ one }) => ({
	organization: one(organizations, {
		fields: [invites.organization_id],
		references: [organizations.id],
	}),
	role: one(roles, {
		fields: [invites.role_id],
		references: [roles.id],
	}),
	user: one(users, {
		fields: [invites.email],
		references: [users.email],
	}),
}));

export type Invite = InferSelectModel<typeof invites>;
export type InviteInsert = InferInsertModel<typeof invites>;
