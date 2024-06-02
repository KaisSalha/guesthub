import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/components/header";
import { useEffect } from "react";

const Help = () => {
  const [_, setHeader] = useHeader();

  useEffect(() => {
    setHeader({
      title: "Help",
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

export const Route = createFileRoute("/dashboard/help/")({
  component: Help,
});
