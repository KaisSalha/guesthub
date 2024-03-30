import { FastifyInstance } from "fastify";
import { FastifyRequest } from "fastify/types/request";
import mercurius from "mercurius";
import { schema } from "@/gql/index.js";
import { createContext } from "@/gql/context.js";
import { generateFileUploadPresignedUrl } from "@/lib/s3.js";
import { config } from "@/config/index.js";
import authenticate from "@/plugins/authenticate";

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
			};
		}
	);

	app.register(mercurius, {
		schema,
		context: createContext,
		graphiql: config.isDev,
	});
};
