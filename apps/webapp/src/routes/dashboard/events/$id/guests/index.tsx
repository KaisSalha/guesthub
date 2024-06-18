import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/events/$id/guests/")({
  component: () => <div>Hello /dashboard/events/$id/guests/!</div>,
});
