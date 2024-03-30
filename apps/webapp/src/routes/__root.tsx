import React from "react";
import { Outlet, RootRoute } from "@tanstack/react-router";

const TanStackRouterDevtools = import.meta.env.VITE_ROUTER_DEVTOOLS
	? () => null
	: React.lazy(() =>
			import("@tanstack/router-devtools").then((res) => ({
				default: res.TanStackRouterDevtools,
			}))
		);

export const Root = () => {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = new RootRoute({
	component: Root,
});
