import { createFileRoute } from "@tanstack/react-router";

const SignUp = () => {
  return <div>Hello /team-invite/signup/!</div>;
};

export const Route = createFileRoute("/team-invite/signup/")({
  component: SignUp,
});
