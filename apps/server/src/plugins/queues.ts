import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { boss } from "../lib/pgboss.js";
import { Worker, parentPort } from "worker_threads";
import { config } from "../config/index.js";

export const queues = fp(async function (app: FastifyInstance): Promise<void> {
	await boss.start();

	boss.on("error", (error: Error) => {
		console.error("PgBoss error:", error);
		parentPort?.postMessage({ type: "error", error });
	});

	const worker = config.isDev
		? new Worker(new URL(import.meta.resolve("tsx/cli")), {
				argv: ["./src/services/queue.ts"],
			})
		: new Worker(new URL("./services/queue.js", import.meta.url));

	app.addHook("onClose", async () => {
		await boss.stop();
		await worker.terminate();
	});
});
