import Fastify from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { config } from "./config/index.js";
import { publicRoutes } from "./routes/public.js";
import { privateRoutes } from "./routes/private.js";

export const buildServer = async (opts = {}) => {
	const app = Fastify(opts);

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

	if (config.isDev) {
		app.register(import("@fastify/swagger"), {
			transform: jsonSchemaTransform,
		});
		await app.register(import("@fastify/swagger-ui"), {
			routePrefix: "/docs",
			logLevel: "silent",
		});
	}

	return app;
};
