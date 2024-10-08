import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "../db/index.js";
import { sessions } from "../db/schemas/sessions.js";
import { users, User } from "../db/schemas/users.js";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: true,
			sameSite: "strict",
		},
	},
	getUserAttributes: (attributes) => {
		return attributes;
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
		DatabaseUserAttributes: Omit<User, "id">;
	}
}
