import { createFileRoute } from "@tanstack/react-router";
import {
  SimpleTabs,
  SimpleTabsContent,
  SimpleTabsList,
  SimpleTabsTrigger,
} from "@guesthub/ui/simple-tabs";
import { RolesTab } from "./-components/roles-tab";
import { TeamTab } from "./-components/team-tab";
import { useSetHeader } from "@/components/header";

const Team = () => {
  useSetHeader({
    title: "Team",
    subtitle: "Organize your team members and assign event roles",
  });

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
