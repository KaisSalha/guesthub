import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";

const Help = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header title="Help" subtitle="" />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/help/")({
  component: Help,
});
