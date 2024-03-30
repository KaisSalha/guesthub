import { createFileRoute } from "@tanstack/react-router";

const Dashboard = () => {
	return <div>Home</div>;
};

export const Route = createFileRoute("/dashboard/")({
	component: Dashboard,
});
