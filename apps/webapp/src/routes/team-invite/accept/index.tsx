import { createFileRoute } from "@tanstack/react-router";

const Accept = () => {
  return <div>Hello /team-invite/accept/!</div>;
};

export const Route = createFileRoute("/team-invite/accept/")({
  component: Accept,
});
