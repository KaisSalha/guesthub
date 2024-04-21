import { User, UserInsert } from "@/db/schemas/users";
import { login, signup } from "@/services/auth";
import { FastifyInstance } from "fastify";
import { FastifyRequest } from "fastify/types/request";

export const publicRoutes = async (app: FastifyInstance) => {
	// await app.register(import("@fastify/rate-limit"), {
	// 	max: 10,
	// 	timeWindow: 1000 * 60 * 5,
	// });

	app.post(
		"/signup",
		async (
			req: FastifyRequest<{
				Body: Pick<UserInsert, "email" | "password" | "type">;
			}>,
			reply
		) => {
			try {
				const cookie = await signup({
					email: req.body.email,
					password: req.body.password,
					type: req.body.type,
				});

				reply.header("Set-Cookie", cookie.serialize());

				return {
					message: "User created successfully",
				};
			} catch (error) {
				reply.status(400);

				if (error instanceof Error)
					return {
						error: error.message,
					};

				return {
					error: "SOMETHING_WENT_WRONG",
				};
			}
		}
	);

	app.post(
		"/login",
		async (
			req: FastifyRequest<{
				Body: Pick<User, "email" | "password">;
			}>,
			reply
		) => {
			try {
				const cookie = await login({
					email: req.body.email,
					password: req.body.password,
				});

				reply.header("Set-Cookie", cookie.serialize());

				return {
					message: "Logged in successfully",
				};
			} catch (error) {
				reply.status(400);

				if (error instanceof Error)
					return {
						error: error.message,
					};

				return {
					error: "SOMETHING_WENT_WRONG",
				};
			}
		}
	);
};
