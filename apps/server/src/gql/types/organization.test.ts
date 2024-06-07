import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../server.js";
import { expect, test } from "vitest";

const app = buildServer();
const client = createMercuriusTestClient(app);

test("works", async () => {
	const result = await client.query(`
    query {
      hello
    }
  `);

	expect(result.data.hello).toBe("hello, world!");
});
