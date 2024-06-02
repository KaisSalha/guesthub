import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/components/header";
import { useEffect } from "react";

const Events = () => {
  const [_, setHeader] = useHeader();

  useEffect(() => {
    setHeader({
      title: "Events",
      subtitle: "Create and manage event details and schedules",
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

export const Route = createFileRoute("/dashboard/events/")({
  component: Events,
});
