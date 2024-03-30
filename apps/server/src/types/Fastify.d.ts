import { TokenPayload } from "../services/auth";

declare module "fastify" {
	export interface FastifyRequest {
		userToken?: TokenPayload | undefined;
	}
}
