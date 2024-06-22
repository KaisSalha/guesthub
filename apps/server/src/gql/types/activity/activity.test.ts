import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../../test/factories/organization-factory.js";
import { OrganizationRoleFactory } from "../../../test/factories/org-role-factory.js";
import { OrganizationMembershipFactory } from "../../../test/factories/org-membership-factory.js";
import { resetDbTables } from "../../../test/reset-db-tables.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { ActivitiesFactory } from "../../../test/factories/activity-factory.js";

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

	await ActivitiesFactory({
		organization_id: organization.id,
		user_id: user.id,
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

	await OrganizationMembershipFactory({
		organization_id: organization2.id,
		user_id: user2.id,
		org_role_id: orgRole2.id,
	});

	await ActivitiesFactory({
		organization_id: organization2.id,
		user_id: user2.id,
	});

	it("queries paginated activites of an organization", async () => {
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

		expect(result.data.orgActivities.totalCount).toBe(2);
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
});
