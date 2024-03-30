import DataLoader from "dataloader";
import { ContextType } from "./context";

export const loaderWithContext = (batchFunc: any, opts = {}) => {
	const store = new WeakMap();

	return function getLoader(ctx: ContextType) {
		let loader = store.get(ctx);
		if (!loader) {
			loader = new DataLoader((keys) => batchFunc(keys, ctx), opts);
			store.set(ctx, loader);
		}
		return loader;
	};
};
