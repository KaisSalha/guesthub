import { FastifyInstance } from "fastify";
import { FastifyRequest } from "fastify/types/request";
import {
	generateFileUploadPresignedUrl,
	generateReadPresignedUrl,
} from "../lib/s3.js";
import { authenticate } from "../plugins/authenticate.js";
import { logout } from "../services/auth.js";

export const privateRoutes = async (app: FastifyInstance) => {
	app.register(authenticate);

	await app.register(import("@fastify/rate-limit"), {
		max: 100,
		timeWindow: 1000 * 60 * 1,
	});

	app.post(
		"/generate-file-upload-presigned-url",
		async (
			req: FastifyRequest<{
				Body: { filename: string; contentType: string; path: string };
			}>
		) => {
			return {
				url: await generateFileUploadPresignedUrl({
					file_name: req.body.filename,
					file_type: req.body.contentType,
					path: req.body.path,
				}),
				readUrl: await generateReadPresignedUrl({
					file_name: req.body.filename,
					path: req.body.path,
				}),
			};
		}
	);

	app.post("/logout", async (request, reply) => {
		try {
			const cookie = await logout(request.headers.cookie);

			reply.header("Set-Cookie", cookie.serialize());

			return;
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
	});
};
