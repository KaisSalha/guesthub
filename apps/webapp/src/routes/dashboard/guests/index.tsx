import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Guests = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Guests"
        subtitle="Manage guest profiles, preferences, and event participation"
      />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/guests/")({
  component: Guests,
});
