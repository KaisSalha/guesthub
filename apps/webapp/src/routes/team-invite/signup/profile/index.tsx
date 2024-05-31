import { createFileRoute } from "@tanstack/react-router";

const Profile = () => {
  return <div>Hello /team-invite/signup/profile!</div>;
};

export const Route = createFileRoute("/team-invite/signup/profile/")({
  component: Profile,
});
