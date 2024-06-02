import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useHeader } from "@/components/header";
import { useEffect } from "react";

const Guests = () => {
  const [_, setHeader] = useHeader();

  useEffect(() => {
    setHeader({
      title: "Guests",
      subtitle: "Manage guest profiles, preferences, and event participation",
    });

    return () => {
      setHeader({
        title: "",
        subtitle: "",
      });
    };
  }, [setHeader]);

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/guests/")({
  component: Guests,
});
