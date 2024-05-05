import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";

const Profile = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header title="Profile" subtitle="" />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/profile/")({
  component: Profile,
});
