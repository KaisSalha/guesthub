import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useSetHeader } from "@/components/header";

const Profile = () => {
  useSetHeader({
    title: "Account",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/account/")({
  component: Profile,
});
