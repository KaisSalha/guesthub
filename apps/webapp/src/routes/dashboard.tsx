import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Layout } from "@/layout/layout";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate({
        to: "/login",
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});
