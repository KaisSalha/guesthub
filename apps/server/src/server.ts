import Fastify from "fastify";
import mercurius from "mercurius";
import { NoSchemaIntrospectionCustomRule } from "graphql";
import { publicRoutes } from "./routes/public.js";
import { privateRoutes } from "./routes/private.js";
import { queues } from "./plugins/queues.js";
import { security } from "./plugins/security.js";
import { shutdown } from "./plugins/shutdown.js";
import { injectUser } from "./plugins/injectUser.js";
import { injectMemberships } from "./plugins/injectMemberships.js";
import { schema } from "./gql/index.js";
import { createContext } from "./gql/context.js";
import { config } from "./config/index.js";

export const buildServer = (opts = {}) => {
	const app = Fastify(opts);

	app.register(queues);
	app.register(security);

	app.register(injectUser);
	app.register(injectMemberships);

	app.register(publicRoutes);
	app.register(privateRoutes);

	app.register(shutdown);

	app.register(mercurius, {
		schema,
		context: createContext,
		validationRules: !config.isDevOrTest
			? [NoSchemaIntrospectionCustomRule]
			: undefined,
	});

	return app;
};
