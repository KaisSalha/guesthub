import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { lucia } from "../lib/auth.js";
import { config } from "../config/index.js";
import { db } from "../db/index.js";

export const injectUser = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.decorate("user", null);

	app.addHook("onRequest", async (request, reply) => {
		if (config.isDev && request.headers["x-debug-user"]) {
			const user = await db.query.users.findFirst({
				where: (users, { eq }) =>
					eq(users.email, request.headers["x-debug-user"] as string),
			});

			if (!user) {
				return;
			}

			request.user = user;
			return;
		}

		if (!request.headers.cookie) {
			return;
		}

		const sessionId = lucia.readSessionCookie(request.headers.cookie);

		if (!sessionId) {
			return;
		}

		const { session, user } = await lucia.validateSession(sessionId);

		if (!user) {
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
});
