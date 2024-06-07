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

	if (config.isTest) return;

	const worker = config.isDev
		? new Worker(new URL(import.meta.resolve("tsx/cli")), {
				argv: ["./src/queues/index.ts"],
			})
		: new Worker(new URL("../queues/index.js", import.meta.url));

	// Listen for messages from the worker
	worker.on("message", (message) => {
		console.log("Worker message:", message);
	});

	worker.on("error", (error) => {
		console.error("Worker thread error:", error);
	});

	worker.on("exit", (code) => {
		console.error(`Worker stopped with exit code ${code}`);
	});

	app.addHook("onClose", async () => {
		worker.postMessage({ type: "shutdown" });
		setTimeout(async () => {
			await worker.terminate();
		}, 100);
	});
});
