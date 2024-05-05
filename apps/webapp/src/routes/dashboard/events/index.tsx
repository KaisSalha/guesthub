import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Events = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Events"
        subtitle="Create and manage event details and schedules"
      />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/events/")({
  component: Events,
});
