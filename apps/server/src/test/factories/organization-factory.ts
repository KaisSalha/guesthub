import { faker } from "@faker-js/faker";
import { db } from "../../db/index.js";
import {
	organizations,
	OrganizationInsert,
} from "../../db/schemas/organizations.js";

interface OrganizationFactoryProps extends Partial<OrganizationInsert> {
	owner_id: number;
}

export const OrganizationFactory = async ({
	owner_id,
	...props
}: OrganizationFactoryProps) => {
	const [organization] = await db
		.insert(organizations)
		.values({
			name: faker.company.name(),
			address: faker.location.streetAddress(),
			city: faker.location.city(),
			country_code: faker.location.countryCode(),
			timezone: faker.location.timeZone(),
			website: faker.internet.url(),
			logo_url: faker.image.avatarGitHub(),
			owner_id,
			...props,
		})
		.returning();

	return organization;
};
