import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		mode: "date",
	}).notNull(),
});
