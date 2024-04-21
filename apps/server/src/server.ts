import Fastify from "fastify";
import { config } from "@/config/index.js";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { publicRoutes } from "@/routes/public.js";
import { privateRoutes } from "./routes/private";

export const buildServer = async (opts = {}) => {
	const app = Fastify(opts);

	if (!config.isDev) app.register(import("@fastify/helmet"));
	app.register(import("@fastify/cors"), {
		origin: (origin, cb) => {
			if (!origin) {
				// Request without origin will pass
				cb(null, true);
				return;
			}

			const hostname = new URL(origin).hostname;

			if (hostname === "localhost") {
				//  Request from localhost will pass
				cb(null, true);
				return;
			}

			// Generate an error on other origins, disabling access
			cb(new Error("Not allowed"), false);
		},
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
	});
	app.register(import("@fastify/compress"), { customTypes: /x-protobuf$/ });
	app.register(import("fastify-healthcheck"));

	if (config.isDev) {
		app.register(import("@fastify/swagger"), {
			transform: jsonSchemaTransform,
		});
		await app.register(import("@fastify/swagger-ui"), {
			routePrefix: "/docs",
			logLevel: "silent",
		});
	}

	app.register(publicRoutes);

	app.register(privateRoutes);

	return app;
};
