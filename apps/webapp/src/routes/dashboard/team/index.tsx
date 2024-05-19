import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";
import {
  SimpleTabs,
  SimpleTabsContent,
  SimpleTabsList,
  SimpleTabsTrigger,
} from "@guesthub/ui/simple-tabs";

const Team = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header
        title="Team"
        subtitle="Organize your team members and assign event roles"
      />
      <SimpleTabs defaultValue="roles">
        <SimpleTabsList>
          <SimpleTabsTrigger value="roles">
            Roles & Permissions
          </SimpleTabsTrigger>
          <SimpleTabsTrigger value="team">Team</SimpleTabsTrigger>
        </SimpleTabsList>
        <SimpleTabsContent value="roles">Roles & Permissions</SimpleTabsContent>
        <SimpleTabsContent value="team">team</SimpleTabsContent>
      </SimpleTabs>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/team/")({
  component: Team,
});
