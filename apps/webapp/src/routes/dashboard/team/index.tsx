import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect } from "react";
import {
  SimpleTabs,
  SimpleTabsContent,
  SimpleTabsList,
  SimpleTabsTrigger,
} from "@guesthub/ui/simple-tabs";
import { RolesTab } from "./-components/roles-tab";
import { TeamTab } from "./-components/team-tab";
import { useHeader } from "@/components/header";

const Team = () => {
  const [_, setHeader] = useHeader();

  useEffect(() => {
    setHeader({
      title: "Team",
      subtitle: "Organize your team members and assign event roles",
    });

    return () => {
      setHeader({
        title: "",
        subtitle: "",
      });
    };
  }, [setHeader]);
  return (
    <div className="flex flex-col gap-8 mb-4">
      <SimpleTabs defaultValue="roles">
        <SimpleTabsList>
          <SimpleTabsTrigger value="roles">
            Roles & Permissions
          </SimpleTabsTrigger>
          <SimpleTabsTrigger value="team">Team</SimpleTabsTrigger>
        </SimpleTabsList>
        <SimpleTabsContent value="roles">
          <RolesTab />
        </SimpleTabsContent>
        <SimpleTabsContent value="team">
          <TeamTab />
        </SimpleTabsContent>
      </SimpleTabs>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/team/")({
  component: Team,
});
