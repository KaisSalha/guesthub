import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../../test/factories/organization-factory.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { resetDbTables } from "../../../test/reset-db-tables.js";

const client = createMercuriusTestClient(buildServer());

describe("organization", async () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterAll(async () => {
		await resetDbTables();
	});

	const user = await UserFactory({ type: "org" });

	client.setHeaders({
		"x-debug-user": user.email,
	});

	const organization = await OrganizationFactory({ owner_id: user.id });
	const organizationId = encodeGlobalID("Organization", organization.id);

	it("queries an existing organization", async () => {
		const result = await client.query<any, { id: string }>(
			`
				query GetOrganization($id: ID!) {
					organization(id: $id) {
						id
						name
						website
						logo_url
						address
						city
						state
						country_code
						postal_code
						timezone
						lat
						lng
						created_at
						updated_at
					}
				}
			`,
			{
				variables: {
					id: organizationId,
				},
			}
		);

		expect(result.data.organization.id).toBe(organizationId);
		expect(result.data.organization.name).toBe(organization.name);
	});

	it("creates a new organization", async () => {
		const result = await client.mutate<any, any>(
			`
				mutation CreateOrganization($input: CreateOrganizationInput!) {
					createOrganization(input: $input) {
						success
						organization {
							id
							name
						}
					}
				}
			`,
			{
				variables: {
					input: {
						name: "New Organization",
						website: "https://new-org.com",
						logo_url: "https://new-org.com/logo.png",
						address: "123 New St",
						city: "New City",
						state: "NC",
						country_code: "US",
						postal_code: "12345",
						timezone: "America/New_York",
						lat: 40.7128,
						lng: -74.006,
					},
				},
			}
		);

		expect(result.data.createOrganization.success).toBe(true);
		expect(result.data.createOrganization.organization).toBeDefined();
		expect(result.data.createOrganization.organization.name).toBe(
			"New Organization"
		);
	});

	it("gives an error if user is not authenticated for querying an organization", async () => {
		client.setHeaders({ "x-debug-user": undefined });

		const result = await client.query<any, { id: string }>(
			`
				query GetOrganization($id: ID!) {
					organization(id: $id) {
						id
					}
				}
			`,
			{
				variables: {
					id: organizationId,
				},
			}
		);

		expect(result.errors).toBeDefined();
	});

	it("gives an error if user is not authenticated for creating an organization", async () => {
		client.setHeaders({ "x-debug-user": undefined });

		const result = await client.mutate<any, any>(
			`
				mutation CreateOrganization($input: CreateOrganizationInput!) {
					createOrganization(input: $input) {
						success
					}
				}
			`,
			{
				variables: {
					input: {
						name: "New Organization",
						website: "https://new-org.com",
						logo_url: "https://new-org.com/logo.png",
						address: "123 New St",
						city: "New City",
						state: "NC",
						country_code: "US",
						postal_code: "12345",
						timezone: "America/New_York",
						lat: 40.7128,
						lng: -74.006,
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
	});
});
