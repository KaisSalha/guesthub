import { lucia } from "@/lib/auth";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const plugin = async function (app: FastifyInstance): Promise<void> {
	app.decorate("user", null);

	app.addHook("onRequest", async (request, reply) => {
		if (!request.headers.cookie) return;

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
