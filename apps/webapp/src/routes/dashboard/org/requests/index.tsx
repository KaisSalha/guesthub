import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";

const Requests = () => {
  useSetHeader({
    title: "Requests",
    subtitle: "Manage and respond to guest and event requests",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/org/requests/")({
  component: Requests,
});
