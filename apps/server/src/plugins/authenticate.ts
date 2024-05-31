import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export const authenticate = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.addHook("onRequest", async (request, reply) => {
		if (!request.user) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}
	});
});
