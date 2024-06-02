import { User } from "./user.js";

declare module "fastify" {
	export interface FastifyRequest {
		user?: User;
	}
}
