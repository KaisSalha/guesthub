import { login, signup } from "@/services/auth";
import { FastifyInstance } from "fastify";
import { FastifyRequest } from "fastify/types/request";

export const publicRoutes = async (app: FastifyInstance) => {
	await app.register(import("@fastify/rate-limit"), {
		max: 15,
		timeWindow: 1000 * 60 * 5,
	});

	app.post(
		"/signup",
		async (
			req: FastifyRequest<{
				Body: { email: string; password: string };
			}>
		) => {
			return await signup({
				email: req.body.email,
				password: req.body.password,
			});
		}
	);

	app.post(
		"/login",
		async (
			req: FastifyRequest<{
				Body: { email: string; password: string };
			}>
		) => {
			return await login({
				email: req.body.email,
				password: req.body.password,
			});
		}
	);
};
