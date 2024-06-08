import { faker } from "@faker-js/faker";
import { db } from "../../db/index.js";
import { users, UserInsert } from "../../db/schemas/users.js";

interface UserFactoryProps extends Partial<UserInsert> {
	type: UserInsert["type"];
}

export const UserFactory = async ({ type, ...props }: UserFactoryProps) => {
	const [user] = await db
		.insert(users)
		.values({
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			type,
			...props,
		})
		.returning();

	return user;
};
