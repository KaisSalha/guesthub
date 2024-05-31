import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const Main = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({
        to: "/dashboard",
      });
    } else {
      if (!routerState.location.pathname.startsWith("/team-invite")) {
        navigate({
          to: "/login",
        });
      }
    }
  }, [isAuthenticated, isLoading, navigate, routerState.location.pathname]);

  return <></>;
};

export const Route = createFileRoute("/")({
  component: Main,
});
