import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";

const Events = () => {
  useSetHeader({
    title: "Events",
    subtitle: "Create and manage event details and schedules",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/events/")({
  component: Events,
});
