import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Team = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Team"
        subtitle="Organize your team members and assign event roles"
      />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/team/")({
  component: Team,
});
