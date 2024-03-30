import { config } from "@/config";
import { db } from "@/db";
import { User, users } from "@/db/schemas/users";
import argon2 from "argon2";
import { createSigner, createVerifier } from "fast-jwt";

export interface TokenPayload {
	id: string;
	first_name: string | null;
	last_name: string | null;
	email: string;
	role: string;
	exp: number;
}

const signSync = createSigner({ key: config.JWT_SECRET });
const verifySync = createVerifier({ key: config.JWT_SECRET });

const generateToken = (user: User) => {
	const today = new Date();
	const exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	const payload: TokenPayload = {
		id: user.id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		role: user.role,
		exp: exp.getTime(),
	};

	return signSync(payload);
};

export const verifyToken = (token: string) => {
	try {
		const payload: TokenPayload = verifySync(token);

		// Check expiry
		if (payload.exp < Date.now()) {
			throw new Error("TOKEN_EXPIRED");
		}

		return payload;
	} catch (err) {
		throw new Error("TOKEN_INVALID");
	}
};

export const signup = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const hashedPassword = await argon2.hash(password);

	const [user] = await db
		.insert(users)
		.values({
			email,
			password: hashedPassword,
		})
		.returning()
		.execute();

	if (!user) {
		throw new Error("Something went wrong");
	}

	const token = generateToken(user);

	const returnUser: Partial<User> = {
		id: user.id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		role: user.role,
	};

	return {
		user: returnUser,
		token,
	};
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

	const validPassword = await argon2.verify(user.password, password);

	if (!validPassword) {
		throw new Error("INVALID_EMAIL_OR_PASSWORD");
	}

	const token = generateToken(user);

	const returnUser: Partial<User> = {
		id: user.id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		role: user.role,
	};

	return {
		user: returnUser,
		token,
	};
};
