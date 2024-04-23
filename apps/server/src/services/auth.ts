import { Argon2id } from "oslo/password";
import { users, UserInsert } from "../db/schemas/users.js";
import { db } from "../db/index.js";
import { lucia } from "../lib/auth.js";

export const signup = async ({ email, password, type }: UserInsert) => {
	const hashedPassword = await new Argon2id().hash(password);

	const [user] = await db
		.insert(users)
		.values({
			email,
			password: hashedPassword,
			type,
		})
		.returning()
		.execute();

	if (!user) {
		throw new Error("SOMETHING_WENT_WRONG");
	}

	const session = await lucia.createSession(user.id, {
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
		type: user.type,
	});

	return lucia.createSessionCookie(session.id);
};

export const login = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email),
	});

	if (!user) {
		throw new Error("INVALID_EMAIL_OR_PASSWORD");
	}

	const validPassword = await new Argon2id().verify(user.password, password);

	if (!validPassword) {
		throw new Error("INVALID_EMAIL_OR_PASSWORD");
	}

	const session = await lucia.createSession(user.id, {
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
		type: user.type,
	});

	return lucia.createSessionCookie(session.id);
};

export const logout = async (cookie: string | undefined) => {
	if (cookie) {
		const sessionId = lucia.readSessionCookie(cookie);

		if (sessionId) await lucia.invalidateSession(sessionId);
	}

	return lucia.createBlankSessionCookie();
};
