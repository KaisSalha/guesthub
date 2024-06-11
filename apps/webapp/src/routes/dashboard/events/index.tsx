import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";
import { ScrollArea, ScrollBar } from "@guesthub/ui/scroll-area";
import { Plus } from "lucide-react";
import { Button } from "@guesthub/ui/button";

const Events = () => {
  useSetHeader({
    title: "Events",
    subtitle: "Create and manage event details and schedules",
  });

  return (
    <div className="flex flex-col gap-10 mb-4">
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Button
            size="sm"
            onClick={() => {
              console.log("create event");
            }}
            className="cursor-pointer"
          >
            Create Event
          </Button>
        </div>
        <ScrollArea>
          <div className="flex flex-col gap-2 justify-center items-center border border-border border-dashed rounded-lg p-4 w-72 h-80 hover:cursor-pointer">
            <div className="p-1.5 rounded-full bg-background-inverted">
              <Plus className="w-10 h-10 text-foreground-inverted" />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h3 className="text-lg font-semibold">Create Event</h3>
              <p className="text-sm text-foreground-muted text-center">
                Create a new upcoming event
              </p>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg font-semibold">Past Events</h2>
        </div>
        <ScrollArea>
          <div className="flex flex-col gap-2 justify-center items-center border border-border border-dashed rounded-lg p-4 w-72 h-80 hover:cursor-pointer">
            <div className="p-1.5 rounded-full bg-background-inverted">
              <Plus className="w-10 h-10 text-foreground-inverted" />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h3 className="text-lg font-semibold">Create Event</h3>
              <p className="text-sm text-foreground-muted text-center">
                Create a new upcoming event
              </p>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/events/")({
  component: Events,
});
