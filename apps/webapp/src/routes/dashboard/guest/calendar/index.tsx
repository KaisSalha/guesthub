import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useSetHeader } from "@/components/header";

const Calendar = () => {
  useSetHeader({
    title: "Calendar",
    subtitle: "View your events in a unified calendar",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/guest/calendar/")({
  component: Calendar,
});
