import { createFileRoute } from "@tanstack/react-router";

const Overview = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-5 lg:gap-10 xl:gap-20 mb-10"></div>
  );
};

export const Route = createFileRoute("/dashboard/org/events/$id/")({
  component: Overview,
});
