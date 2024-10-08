import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";

const Help = () => {
  useSetHeader({
    title: "Help",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/org/help/")({
  component: Help,
});
