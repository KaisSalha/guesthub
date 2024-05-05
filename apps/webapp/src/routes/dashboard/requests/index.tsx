import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Requests = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Requests"
        subtitle="Manage and respond to guest and event requests"
      />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/requests/")({
  component: Requests,
});
