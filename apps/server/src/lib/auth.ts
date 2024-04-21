import { db } from "@/db";
import { sessions } from "@/db/schemas/sessions";
import { users, User } from "@/db/schemas/users";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production",
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
