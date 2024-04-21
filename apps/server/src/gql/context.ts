import { initContextCache } from "@pothos/core";
import { LoadableRef } from "@pothos/plugin-dataloader";
import DataLoader from "dataloader";
import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "lucia";

export interface ContextType {
	user: User;
	getLoader: <K, V>(ref: LoadableRef<K, V, ContextType>) => DataLoader<K, V>;
	load: <K, V>(ref: LoadableRef<K, V, ContextType>, id: K) => Promise<V>;
	loadMany: <K, V>(
		ref: LoadableRef<K, V, ContextType>,
		ids: K[]
	) => Promise<(Error | V)[]>;
}

export const createContext = (
	req: FastifyRequest,
	_res: FastifyReply
): ContextType => ({
	user: req.user,
	...initContextCache(),
	get getLoader() {
		return <K, V>(ref: LoadableRef<K, V, ContextType>) =>
			ref.getDataloader(this);
	},
	get load() {
		return <K, V>(ref: LoadableRef<K, V, ContextType>, id: K) =>
			ref.getDataloader(this).load(id);
	},
	get loadMany() {
		return <K, V>(ref: LoadableRef<K, V, ContextType>, ids: K[]) =>
			ref.getDataloader(this).loadMany(ids);
	},
});
