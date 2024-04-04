import { createFileRoute } from "@tanstack/react-router";
import React from "react";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="w-fit flex flex-col gap-5"></div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
