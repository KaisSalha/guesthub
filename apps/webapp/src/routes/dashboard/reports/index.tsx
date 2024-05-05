import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Reports = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Reports"
        subtitle=" View reports on events, guests, and team performance"
      />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/reports/")({
  component: Reports,
});
