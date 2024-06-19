import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../../test/factories/organization-factory.js";
import { OrganizationRoleFactory } from "../../../test/factories/org-role-factory.js";
import { OrganizationMembershipFactory } from "../../../test/factories/org-membership-factory.js";
import { resetDbTables } from "../../../test/reset-db-tables.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { EventFactory } from "../../../test/factories/event-factory.js";

describe("events", async () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterAll(async () => {
		await resetDbTables();
	});

	const client = createMercuriusTestClient(buildServer());

	const user = await UserFactory({ type: "org" });

	const organization = await OrganizationFactory({ owner_id: user.id });

	const orgRole = await OrganizationRoleFactory({
		organization_id: organization.id,
		is_admin: true,
	});

	await OrganizationMembershipFactory({
		organization_id: organization.id,
		user_id: user.id,
		org_role_id: orgRole.id,
	});

	const event = await EventFactory({
		organization_id: organization.id,
		created_by_id: user.id,
	});

	const user2 = await UserFactory({ type: "org" });

	const organization2 = await OrganizationFactory({ owner_id: user2.id });

	const orgRole2 = await OrganizationRoleFactory({
		organization_id: organization2.id,
		is_admin: false,
	});

	await OrganizationMembershipFactory({
		organization_id: organization2.id,
		user_id: user2.id,
		org_role_id: orgRole2.id,
	});

	const event2 = await EventFactory({
		organization_id: organization2.id,
		created_by_id: user2.id,
	});

	it("queries an event", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<any, { id: string }>(
			`
                query GetEvent($id: ID!) {
                    event(id: $id) {
                        id
                        name
                    }
                }
            `,
			{
				variables: {
					id: encodeGlobalID("Event", event.id),
				},
			}
		);

		expect(result.data.event.id).toBe(encodeGlobalID("Event", event.id));
		expect(result.data.event.name).toBe(event.name);
	});

	it("queries paginated events of an organization", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ orgId: string; first: number; offset: number }
		>(
			`
				query GetOrgEvents($first: Int!, $offset: Int!, $orgId: ID!) {
                    orgEvents(first: $first, offset: $offset, orgId: $orgId) {
                        totalCount
                        edges {
                            node {
                                id
                                name
                                start_date
                                end_date
                                created_by {
                                    id
                                }
                                updated_at
                            }
                        }
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                            startCursor
                            endCursor
                        }
                    }
                }
			`,
			{
				variables: {
					first: 10,
					offset: 0,
					orgId: encodeGlobalID("Organization", organization.id),
				},
			}
		);

		expect(result.data.orgEvents.totalCount).toBe(1);
		expect(result.data.orgEvents.edges[0].node.id).toBe(
			encodeGlobalID("Event", event.id)
		);
		expect(result.data.orgEvents.edges[0].node.name).toBe(event.name);
		expect(result.data.orgEvents.edges[0].node.created_by.id).toBe(
			encodeGlobalID("User", event.created_by_id)
		);
		expect(result.data.orgEvents.edges[0].node.start_date).toBe(
			event.start_date.toISOString().split("T")[0]
		);
		expect(result.data.orgEvents.edges[0].node.end_date).toBe(
			event.end_date.toISOString().split("T")[0]
		);
		expect(result.data.orgEvents.edges[0].node.updated_at).toBe(
			event.updated_at.getTime()
		);
	});

	it("gives an error if you don't belong to the organization of the event", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<any, { id: string }>(
			`
                query GetEvent($id: ID!) {
                    orgEvent(id: $id) {
                        id
                        name
                    }
                }
            `,
			{
				variables: {
					id: encodeGlobalID("Event", event2.id),
				},
			}
		);

		expect(result.errors).toBeDefined();
	});

	it("gives an error if you don't belong to the organization of the event, paginated", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ first: number; offset: number; orgId: string }
		>(
			`
				query GetOrgEvents($first: Int!, $offset: Int!, $orgId: ID!) {
                    orgEvents(first: $first, offset: $offset, orgId: $orgId) {
                        totalCount
                        edges {
                            node {
                                id
                                name
                                start_date
                                end_date
                                created_by {
                                    id
                                }
                                updated_at
                            }
                        }
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                            startCursor
                            endCursor
                        }
                    }
                }
			`,
			{
				variables: {
					first: 10,
					offset: 0,
					orgId: encodeGlobalID("Organization", organization2.id),
				},
			}
		);

		expect(result.errors).toBeDefined();
	});

	it("creates an event", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{
				input: {
					orgId: string;
					name: string;
					start_date: string;
					end_date: string;
					tagline: string;
					description: string;
					website: string;
					logo_url: string;
					banner_url: string;
					plus_code: string;
					lat: number;
					lng: number;
					address: string;
					city: string;
					state: string;
					country_code: string;
					postal_code: string;
					timezone: string;
				};
			}
		>(
			`
                mutation CreateEvent($input: CreateEventInput!) {
                    createEvent(input: $input) {
                        event {
                            id
                            name
                        }
                    }
                }
            `,
			{
				variables: {
					input: {
						orgId: encodeGlobalID("Organization", organization.id),
						name: "Test Event",
						start_date: "2022-01-01T00:00:00",
						end_date: "2022-01-02T10:00:00",
						tagline: "Test Event Tagline",
						description: "Test Event Description",
						website: "https://test.com",
						logo_url: "https://test.com/logo.png",
						banner_url: "https://test.com/banner.png",
						address: "123 Main St",
						city: "San Francisco",
						state: "CA",
						country_code: "US",
						postal_code: "94101",
						plus_code: "1234567890",
						lat: 37.774929,
						lng: -122.398468,
						timezone: "America/Los_Angeles",
					},
				},
			}
		);

		expect(result.data.createEvent.event.id).toBeDefined();
		expect(result.data.createEvent.event.name).toBe("Test Event");
	});

	it("throws an error creating an event if end time is less than start time", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{
				input: {
					orgId: string;
					name: string;
					start_date: string;
					end_date: string;
					tagline: string;
					description: string;
					website: string;
					logo_url: string;
					banner_url: string;
					plus_code: string;
					lat: number;
					lng: number;
					address: string;
					city: string;
					state: string;
					country_code: string;
					postal_code: string;
					timezone: string;
				};
			}
		>(
			`
                mutation CreateEvent($input: CreateEventInput!) {
                    createEvent(input: $input) {
                        event {
                            id
                            name
                        }
                    }
                }
            `,
			{
				variables: {
					input: {
						orgId: encodeGlobalID("Organization", organization.id),
						name: "Test Event",
						start_date: "2022-01-02",
						end_date: "2022-01-01",
						tagline: "Test Event Tagline",
						description: "Test Event Description",
						website: "https://test.com",
						logo_url: "https://test.com/logo.png",
						banner_url: "https://test.com/banner.png",
						address: "123 Main St",
						city: "San Francisco",
						state: "CA",
						country_code: "US",
						postal_code: "94101",
						plus_code: "1234567890",
						lat: 37.774929,
						lng: -122.398468,
						timezone: "America/Los_Angeles",
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
	});

	it("gives an error if the user doesn't belong to the organization", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{
				input: {
					orgId: string;
					name: string;
					start_date: string;
					end_date: string;
					tagline: string;
					description: string;
					website: string;
					logo_url: string;
					banner_url: string;
					plus_code: string;
					lat: number;
					lng: number;
					address: string;
					city: string;
					state: string;
					country_code: string;
					postal_code: string;
					timezone: string;
				};
			}
		>(
			`
                mutation CreateEvent($input: CreateEventInput!) {
                    createEvent(input: $input) {
                        event {
                            id
                            name
                        }
                    }
                }
            `,
			{
				variables: {
					input: {
						orgId: encodeGlobalID("Organization", organization2.id),
						name: "Test Event",
						start_date: "2022-01-01",
						end_date: "2022-01-01",
						tagline: "Test Event Tagline",
						description: "Test Event Description",
						website: "https://test.com",
						logo_url: "https://test.com/logo.png",
						banner_url: "https://test.com/banner.png",
						address: "123 Main St",
						city: "San Francisco",
						state: "CA",
						country_code: "US",
						postal_code: "94101",
						plus_code: "1234567890",
						lat: 37.774929,
						lng: -122.398468,
						timezone: "America/Los_Angeles",
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
	});
});
