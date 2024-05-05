import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Calendar = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Calendar"
        subtitle="View your events in a unified calendar"
      />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/calendar/")({
  component: Calendar,
});
