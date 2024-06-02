import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/components/header";
import { useEffect } from "react";

const Dashboard = () => {
  const [_, setHeader] = useHeader();

  useEffect(() => {
    setHeader({
      title: "Home",
      subtitle: "Access your main dashboard for event and guest management",
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

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
