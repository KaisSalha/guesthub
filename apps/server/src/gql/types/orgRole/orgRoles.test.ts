import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../../test/factories/organization-factory.js";
import { OrganizationRoleFactory } from "../../../test/factories/org-role-factory.js";
import { OrganizationMembershipFactory } from "../../../test/factories/org-membership-factory.js";
import { resetDbTables } from "../../../test/reset-db-tables.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

describe("orgRoles", async () => {
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

	await OrganizationRoleFactory({
		organization_id: organization.id,
		is_admin: false,
	});

	await OrganizationMembershipFactory({
		organization_id: organization.id,
		user_id: user.id,
		org_role_id: orgRole.id,
	});

	const user2 = await UserFactory({ type: "org" });

	const organization2 = await OrganizationFactory({ owner_id: user2.id });

	const orgRole3 = await OrganizationRoleFactory({
		organization_id: organization2.id,
		is_admin: false,
	});

	await OrganizationMembershipFactory({
		organization_id: organization2.id,
		user_id: user2.id,
		org_role_id: orgRole3.id,
	});

	it("queries all org roles", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<any, { orgId: string }>(
			`
				query GetAllOrgRoles($orgId: ID!) {
                    orgAllRoles(orgId: $orgId) {
                        id
                        name
                    }
                }
			`,
			{
				variables: {
					orgId: encodeGlobalID("Organization", organization.id),
				},
			}
		);

		expect(result.data.orgAllRoles.length).toBe(2);
	});

	it("queries paginated org roles", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ orgId: string; first: number; offset: number }
		>(
			`
				query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {
                    orgRoles(first: $first, offset: $offset, orgId: $orgId) {
                        totalCount
                        edges {
                            node {
                                id
                                name
                                permissions
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

		expect(result.data.orgRoles.totalCount).toBe(2);
	});

	it("gives an error if you query paginated org roles and you don't belong to the organization", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ first: number; offset: number; orgId: string }
		>(
			`
				query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {
                    orgRoles(first: $first, offset: $offset, orgId: $orgId) {
                        totalCount
                        edges {
                            node {
                                id
                                name
                                permissions
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

	it("gives an error if you query all org roles and you don't belong to the organization", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<any, { orgId: string }>(
			`
				query GetAllOrgRoles($orgId: ID!) {
                    orgAllRoles(orgId: $orgId) {
                        id
                        name
                    }
                }
			`,
			{
				variables: {
					orgId: encodeGlobalID("Organization", organization2.id),
				},
			}
		);

		expect(result.errors).toBeDefined();
	});
});
