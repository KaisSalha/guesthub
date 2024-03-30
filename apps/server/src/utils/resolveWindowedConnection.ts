import { MaybePromise } from "@pothos/core";
import {
	DefaultConnectionArguments,
	resolveOffsetConnection,
} from "@pothos/plugin-relay";

interface ResolveWindowedConnectionOptionsArgs
	extends DefaultConnectionArguments {
	offset: number;
}

export async function resolveWindowedConnection<T>(
	options: {
		args: ResolveWindowedConnectionOptionsArgs;
	},
	resolve: (params: {
		offset: number;
		limit: number;
	}) => MaybePromise<{ items: T[]; totalCount: number }>
) {
	let totalCount!: number;

	const { edges, pageInfo } = await resolveOffsetConnection(
		options,
		async ({ limit, offset }) => {
			const { totalCount: totalCountInternal, items } = await resolve({
				limit,
				offset,
			});
			totalCount = totalCountInternal;
			return items;
		}
	);

	return {
		edges,
		totalCount,
		pageInfo: {
			...pageInfo,
			hasPreviousPage: options.args.offset > 0,
		},
	};
}
