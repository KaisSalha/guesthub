import { faker } from "@faker-js/faker";
import { db } from "../../db/index.js";
import { events, EventInsert } from "../../db/schemas/events.js";

interface EventFactoryProps extends Partial<EventInsert> {
	organization_id: number;
	created_by_id: number;
}

export const EventFactory = async ({
	organization_id,
	created_by_id,
	...props
}: EventFactoryProps) => {
	const [event] = await db
		.insert(events)
		.values({
			name: faker.company.name(),
			organization_id,
			created_by_id,
			address: faker.location.streetAddress(),
			city: faker.location.city(),
			country_code: faker.location.countryCode(),
			timezone: faker.location.timeZone(),
			website: faker.internet.url(),
			logo_url: faker.image.avatarGitHub(),
			start_time: faker.date.recent(),
			end_time: faker.date.future(),
			...props,
		})
		.returning();

	return event;
};
