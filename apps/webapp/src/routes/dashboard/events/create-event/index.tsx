import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";

const CreateEvent = () => {
  useSetHeader({
    title: "Create Event",
    subtitle: "Create a new upcoming event",
    showOnMobile: true,
    showSubtitleOnMobile: true,
  });

  return <div className="flex flex-col gap-10 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/events/create-event/")({
  component: CreateEvent,
});
