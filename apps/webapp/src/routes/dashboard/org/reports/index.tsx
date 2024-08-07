import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";

const Reports = () => {
  useSetHeader({
    title: "Reports",
  });

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/org/reports/")({
  component: Reports,
});
