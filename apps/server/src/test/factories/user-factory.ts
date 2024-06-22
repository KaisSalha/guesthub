import { faker } from "@faker-js/faker";
import { db } from "../../db/index.js";
import { users, UserInsert } from "../../db/schemas/users.js";

export const UserFactory = async (props?: Partial<UserInsert>) => {
	const [user] = await db
		.insert(users)
		.values({
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...(props || {}),
		})
		.returning();

	return user;
};
