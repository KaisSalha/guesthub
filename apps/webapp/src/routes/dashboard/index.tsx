import { useMe } from "@/hooks/use-me";
import { useMode } from "@/hooks/use-mode";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const Dashboard = () => {
  const { isLoading } = useMe();
  const { mode } = useMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && mode === "guest") {
      navigate({
        to: "/dashboard/guest",
      });
    }

    if (!isLoading && mode === "org") {
      navigate({
        to: "/dashboard/org",
      });
    }
  }, [mode, isLoading, navigate]);

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
