import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { pool } from "../db/index.js";

export const shutdown = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.addHook("onClose", async () => {
		await pool.end();
	});
});
