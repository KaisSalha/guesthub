import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/events/$id/attendees/")({
  component: () => <div>Hello /dashboard/events/$id/attendees/!</div>,
});
