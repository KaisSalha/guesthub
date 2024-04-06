import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/layout/layout";
import { useAuth } from "@/atoms/auth";
import { useEffect } from "react";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        to: "/login",
      });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});
