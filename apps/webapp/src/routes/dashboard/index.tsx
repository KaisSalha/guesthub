import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";

const Dashboard = () => {
  useSetHeader({
    title: "Home",
    subtitle: "Access your main dashboard for event and guest management",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
