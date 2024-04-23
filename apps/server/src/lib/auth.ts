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
		return {
			email: attributes.email,
			firstName: attributes.first_name,
			lastName: attributes.last_name,
			type: attributes.type,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<User, "id">;
	}
}
