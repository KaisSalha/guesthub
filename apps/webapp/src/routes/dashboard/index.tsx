import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Home"
        subtitle="Access your main dashboard for event and guest management"
      />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
