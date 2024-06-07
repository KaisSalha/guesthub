import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { config } from "../config/index.js";

export const security = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.register(import("@fastify/helmet"));
	app.register(import("@fastify/cors"), {
		origin: config.isDevOrTest
			? /https?:\/\/(\w+\.)*guesthub\.(internal)(:\d+)?(\/.*)?$/
			: /https?:\/\/(\w+\.)*guesthub\.(ai)(:\d+)?(\/.*)?$/,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
	});

	app.register(import("@fastify/compress"), { customTypes: /x-protobuf$/ });

	app.register(import("fastify-healthcheck"));
});
