import { verifyToken } from "@/services/auth";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const plugin = async function (app: FastifyInstance): Promise<void> {
	app.decorate("userToken", null);

	app.addHook("onRequest", async (request, reply) => {
		const authorizationHeader = request.headers.authorization;

		if (!authorizationHeader) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		const token = authorizationHeader.split(" ")[1];

		if (!token) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		let tokenPayload;

		try {
			tokenPayload = verifyToken(token);
		} catch (err) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		request.userToken = tokenPayload;
	});
};

export default fp(plugin);
