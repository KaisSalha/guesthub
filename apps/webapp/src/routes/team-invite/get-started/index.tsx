import { useAuth } from "@/hooks/use-auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

const GetStarted = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;

  if (isAuthenticated) navigate({ to: "/team-invite/accept" });

  if (!isAuthenticated) navigate({ to: "/team-invite/signup" });

  return <div>Hello /team-invite/get-started/!</div>;
};

export const Route = createFileRoute("/team-invite/get-started/")({
  component: GetStarted,
});
