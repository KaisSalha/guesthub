import {
	pgTable,
	uuid,
	varchar,
	integer,
	pgEnum,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";
import { orgRoles } from "./org-roles.js";
import { timeFields } from "./helpers/time.js";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { users } from "./users.js";

export enum ORG_INVITE_STATUS_ENUM {
	PENDING = "pending",
	ACCEPTED = "accepted",
	DECLINED = "declined",
}

export const orgInviteStatusEnum = pgEnum(
	"org_invite_status",
	Object.values(ORG_INVITE_STATUS_ENUM) as [string, ...string[]]
);

export const orgInvites = pgTable(
	"org_invites",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: varchar("email", { length: 256 }).notNull(),
		organization_id: integer("organization_id")
			.notNull()
			.references(() => organizations.id),
		org_role_id: integer("org_role_id")
			.notNull()
			.references(() => orgRoles.id),
		status: orgInviteStatusEnum("status")
			.notNull()
			.default("pending")
			.$type<ORG_INVITE_STATUS_ENUM>(),
		...timeFields,
	},
	(table) => {
		return {
			org_invites_email_org_idx: uniqueIndex(
				"org_invites_email_org_idx"
			).on(table.email, table.organization_id),
		};
	}
);

export const orgInvitesRelations = relations(orgInvites, ({ one }) => ({
	organization: one(organizations, {
		fields: [orgInvites.organization_id],
		references: [organizations.id],
	}),
	role: one(orgRoles, {
		fields: [orgInvites.org_role_id],
		references: [orgRoles.id],
	}),
	user: one(users, {
		fields: [orgInvites.email],
		references: [users.email],
	}),
}));

export type OrgInvite = InferSelectModel<typeof orgInvites>;
export type OrgInviteInsert = InferInsertModel<typeof orgInvites>;
