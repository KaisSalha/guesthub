import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/atoms/auth";
import { useEffect } from "react";

const Main = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate({
				to: "/dashboard",
			});
		} else {
			navigate({
				to: "/login",
			});
		}
	}, [isAuthenticated, navigate]);

	return <></>;
};

export const Route = createFileRoute("/")({
	component: Main,
});
