import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../../test/factories/organization-factory.js";
import { OrganizationRoleFactory } from "../../../test/factories/org-role-factory.js";
import { OrganizationMembershipFactory } from "../../../test/factories/org-membership-factory.js";
import { resetDbTables } from "../../../test/reset-db-tables.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import {
	ActivitiesFactory,
	ActivityFactory,
} from "../../../test/factories/activity-factory.js";
import { EventFactory } from "../../../test/factories/event-factory.js";

describe("orgMemberships", async () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterAll(async () => {
		await resetDbTables();
	});

	const client = createMercuriusTestClient(buildServer());

	const user = await UserFactory();

	const organization = await OrganizationFactory({ owner_id: user.id });

	const orgRole = await OrganizationRoleFactory({
		organization_id: organization.id,
		is_admin: true,
	});

	const event = await EventFactory({
		organization_id: organization.id,
		created_by_id: user.id,
	});

	await ActivitiesFactory({
		organization_id: organization.id,
		user_id: user.id,
	});

	await ActivityFactory({
		organization_id: organization.id,
		user_id: user.id,
		event_id: event.id,
	});

	await OrganizationMembershipFactory({
		organization_id: organization.id,
		user_id: user.id,
		org_role_id: orgRole.id,
	});

	const user2 = await UserFactory();

	const organization2 = await OrganizationFactory({ owner_id: user2.id });

	const orgRole2 = await OrganizationRoleFactory({
		organization_id: organization2.id,
		is_admin: false,
	});

	const event2 = await EventFactory({
		organization_id: organization2.id,
		created_by_id: user2.id,
	});

	await OrganizationMembershipFactory({
		organization_id: organization2.id,
		user_id: user2.id,
		org_role_id: orgRole2.id,
	});

	await ActivitiesFactory({
		organization_id: organization2.id,
		user_id: user2.id,
	});

	await ActivityFactory({
		organization_id: organization2.id,
		user_id: user2.id,
		event_id: event2.id,
	});

	it("queries paginated activities of an organization", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ orgId: string; first: number; offset: number }
		>(
			`
				query GetOrgActivities($first: Int!, $offset: Int!, $orgId: ID!) {
                    orgActivities(first: $first, offset: $offset, orgId: $orgId) {
                        totalCount
                        edges {
                            node {
                                id
                                action
                                object_id
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

		expect(result.data.orgActivities.totalCount).toBe(3);
	});

	it("queries paginated activities of an event", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ first: number; offset: number; eventId: string }
		>(
			`
				query GetEventActivities($first: Int!, $offset: Int!, $eventId: ID!) {
					eventActivities(first: $first, offset: $offset, eventId: $eventId) {
						totalCount
					}
				}
			`,
			{
				variables: {
					first: 10,
					offset: 0,
					eventId: encodeGlobalID("Event", event.id),
				},
			}
		);

		expect(result.data.eventActivities.totalCount).toBe(1);
	});

	it("gives an error if you don't belong to the organization", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ first: number; offset: number; orgId: string }
		>(
			`
				query GetOrgActivities($first: Int!, $offset: Int!, $orgId: ID!) {
                    orgActivities(first: $first, offset: $offset, orgId: $orgId) {
                        totalCount
                        edges {
                            node {
                                id
                                action
                                object_id
                                created_at
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

	it("gives an error if you don't belong to the event", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ first: number; offset: number; eventId: string; orgId: string }
		>(
			`
				query GetEventActivities($first: Int!, $offset: Int!, $eventId: ID!, $orgId: ID!) {
					eventActivities(first: $first, offset: $offset, eventId: $eventId, orgId: $orgId) {
						totalCount
					}
				}
			`,
			{
				variables: {
					first: 10,
					offset: 0,
					orgId: encodeGlobalID("Organization", organization.id),
					eventId: encodeGlobalID("Event", event2.id),
				},
			}
		);

		expect(result.errors).toBeDefined();
	});
});
