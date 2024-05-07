import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";

const Main = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({
        to: "/dashboard",
      });
    } else {
      navigate({
        to: "/login",
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return <></>;
};

export const Route = createFileRoute("/")({
  component: Main,
});
