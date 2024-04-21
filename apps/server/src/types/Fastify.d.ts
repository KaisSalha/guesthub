import { User } from "lucia";

declare module "fastify" {
	export interface FastifyRequest {
		user: User;
	}
}
