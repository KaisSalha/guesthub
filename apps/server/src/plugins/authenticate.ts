import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { lucia } from "../lib/auth.js";
import { config } from "../config/index.js";
import { db } from "../db/index.js";

const plugin = async function (app: FastifyInstance): Promise<void> {
	app.decorate("user", null);

	app.addHook("onRequest", async (request, reply) => {
		if (config.isDev && request.headers["x-debug-user"]) {
			const user = await db.query.users.findFirst({
				where: (users, { eq }) =>
					eq(users.email, request.headers["x-debug-user"] as string),
			});

			if (!user) {
				reply.code(401).send({ error: "Unauthorized" });
				return;
			}

			request.user = user;
			return;
		}

		if (!request.headers.cookie) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		const sessionId = lucia.readSessionCookie(request.headers.cookie);

		if (!sessionId) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		const { session, user } = await lucia.validateSession(sessionId);

		if (!user) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		if (session && session.fresh)
			reply.header(
				"Set-Cookie",
				lucia.createSessionCookie(session.id).serialize()
			);

		if (!session)
			reply.header(
				"Set-Cookie",
				lucia.createBlankSessionCookie().serialize()
			);

		request.user = user;
	});
};

export default fp(plugin);
