import { useAuth } from "@/hooks/use-auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { Layout } from "./-components/layout";
import { Button } from "@guesthub/ui/button";

const GetStarted = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const onGetStarted = useCallback(
    () => navigate({ to: "/team-invite/signup" }),
    [navigate]
  );

  if (isLoading) return null;

  if (!!isLoading && isAuthenticated) navigate({ to: "/team-invite/accept" });

  return (
    <Layout>
      <div className="flex flex-col items-center gap-6 md:gap-12">
        <h1 className="text-3xl font-bold">Team Invite</h1>
        <p className="text-lg">Invite your team to join your account.</p>
        <Button onClick={onGetStarted}>Get Started</Button>
      </div>
    </Layout>
  );
};

export const Route = createFileRoute("/team-invite/")({
  component: GetStarted,
});
