import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@guesthub/ui/tooltip";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

const Dashboard = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p>Hover</p>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
