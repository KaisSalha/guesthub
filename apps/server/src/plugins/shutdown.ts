import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { pool } from "../db/index.js";
import { boss } from "../lib/pgboss.js";

export const shutdown = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.addHook("onClose", async () => {
		await boss.stop();
		await pool.end();
	});
});
