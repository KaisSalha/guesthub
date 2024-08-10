import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";

const Dashboard = () => {
  useSetHeader({
    title: "Home",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/guest/")({
  component: Dashboard,
});
