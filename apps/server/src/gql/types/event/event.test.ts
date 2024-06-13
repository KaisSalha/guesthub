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
                    orgEvent(id: $id) {
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

		expect(result.data.orgEvent.id).toBe(encodeGlobalID("Event", event.id));
		expect(result.data.orgEvent.name).toBe(event.name);
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
                                start_time
                                end_time
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
		expect(result.data.orgEvents.edges[0].node.start_time).toBe(
			event.start_time.getTime()
		);
		expect(result.data.orgEvents.edges[0].node.end_time).toBe(
			event.end_time.getTime()
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
                                start_time
                                end_time
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
});
