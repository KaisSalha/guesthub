import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/components/header";
import { useEffect } from "react";

const Requests = () => {
  const [_, setHeader] = useHeader();

  useEffect(() => {
    setHeader({
      title: "Requests",
      subtitle: "Manage and respond to guest and event requests",
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

export const Route = createFileRoute("/dashboard/requests/")({
  component: Requests,
});
