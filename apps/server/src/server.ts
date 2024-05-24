import Fastify from "fastify";
import { publicRoutes } from "./routes/public.js";
import { privateRoutes } from "./routes/private.js";
import { queues } from "./plugins/queues.js";
import { security } from "./plugins/security.js";
import { shutdown } from "./plugins/shutdown.js";

export const buildServer = async (opts = {}) => {
	const app = Fastify(opts);

	app.register(queues);
	app.register(security);

	app.register(publicRoutes);
	app.register(privateRoutes);

	app.register(shutdown);

	return app;
};
