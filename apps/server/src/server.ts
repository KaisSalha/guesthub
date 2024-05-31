import Fastify from "fastify";
import { publicRoutes } from "./routes/public.js";
import { privateRoutes } from "./routes/private.js";
import { queues } from "./plugins/queues.js";
import { security } from "./plugins/security.js";
import { shutdown } from "./plugins/shutdown.js";
import { injectUser } from "./plugins/injectUser.js";

export const buildServer = async (opts = {}) => {
	const app = Fastify(opts);

	app.register(queues);
	app.register(security);

	app.register(injectUser);

	app.register(publicRoutes);
	app.register(privateRoutes);

	app.register(shutdown);

	return app;
};
