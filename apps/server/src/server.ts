import { Worker, parentPort } from "worker_threads";
import Fastify from "fastify";
import { config } from "./config/index.js";
import { publicRoutes } from "./routes/public.js";
import { privateRoutes } from "./routes/private.js";
import { boss } from "./lib/pgboss.js";

export const buildServer = async (opts = {}) => {
	const app = Fastify(opts);

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

	if (!config.isDev) app.register(import("@fastify/helmet"));

	app.register(import("@fastify/cors"), {
		origin: config.isDev
			? /https?:\/\/(\w+\.)*guesthub\.(internal)(:\d+)?(\/.*)?$/
			: /https?:\/\/(\w+\.)*guesthub\.(ai)(:\d+)?(\/.*)?$/,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
	});
	app.register(import("@fastify/compress"), { customTypes: /x-protobuf$/ });
	app.register(import("fastify-healthcheck"));

	app.register(publicRoutes);
	app.register(privateRoutes);

	// Graceful shutdown
	app.addHook("onClose", async () => {
		await boss.stop();
		await worker.terminate();
	});

	return app;
};
