import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { resetDbTables } from "../../../test/reset-db-tables.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

const client = createMercuriusTestClient(buildServer());

describe("user", async () => {
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

	it("return the current user", async () => {
		const result = await client.query(`
			query {
				me {
					id
					email
					first_name
					last_name
				}
			}
		`);

		expect(result.data.me.id).toBe(encodeGlobalID("User", user.id));
		expect(result.data.me.email).toBe(user.email);
		expect(result.data.me.first_name).toBe(user.first_name);
		expect(result.data.me.last_name).toBe(user.last_name);
	});

	it("updates the user", async () => {
		const result = await client.mutate<any, any>(
			`
				mutation UpdateUser($input: UpdateUserInput!) {
					updateUser(input: $input) {
						success
						user {
							first_name
							last_name
						}
					}
				}
			`,
			{
				variables: {
					input: {
						first_name: "New First Name",
						last_name: "New Last Name",
					},
				},
			}
		);

		expect(result.data.updateUser.success).toBe(true);
		expect(result.data.updateUser.user).toBeDefined();
		expect(result.data.updateUser.user.first_name).toBe("New First Name");
		expect(result.data.updateUser.user.last_name).toBe("New Last Name");
	});
});
