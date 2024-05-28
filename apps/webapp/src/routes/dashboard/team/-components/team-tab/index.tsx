import React from "react";
import { useMe } from "@/hooks/use-me";
import { QueryTable } from "@/components/query-table";
import {
  GetOrgMembersQuery,
  GetOrgMembersQueryVariables,
  GetOrgMembers_MembersFragment,
} from "@/gql/graphql";
import { DataTable } from "@guesthub/ui/data-table";
import { capitalize } from "@/utils/string-utils";
import { Checkbox } from "@guesthub/ui/checkbox";
import { toISODate, userTimezone } from "@/utils/datetime";
import { Button } from "@guesthub/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@guesthub/ui/dialog";
import { InviteTeamMemberForm } from "./invite-team-member-form";
import { useQuery } from "@apollo/client";
import { main } from "./queries/team-tab-query";
import { orgMembers } from "./queries/org-members-query";

export const TeamTab = () => {
  const { selectedMembership } = useMe();

  const { data } = useQuery(TeamTab.queries.main, {
    variables: {
      orgId: selectedMembership?.organization.id,
    },
    skip: !selectedMembership?.organization.id,
  });

  if (!selectedMembership?.organization.id || !data) return null;

  return (
    <Dialog>
      <DialogOverlay />
      <QueryTable<
        "orgMembers",
        GetOrgMembersQuery,
        GetOrgMembersQueryVariables,
        GetOrgMembers_MembersFragment
      >
        query={TeamTab.queries.orgMembers}
        variables={{
          orgId: selectedMembership?.organization.id,
        }}
        resultKey="orgMembers"
        toolBarButtons={
          <DialogTrigger asChild>
            <Button>Invite</Button>
          </DialogTrigger>
        }
        columns={[
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
                className="translate-y-[2px]"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
              />
            ),
            enableSorting: false,
            enableHiding: false,
            meta: {
              headerClass: "w-fit min-w-10",
              cellClass: "w-fit min-w-10",
            },
          },
          {
            id: "name",
            accessorFn: (node) => node.user.full_name,
            header: ({ column }) => (
              <DataTable.DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
              return <>{capitalize(row.getValue("name"))}</>;
            },
            meta: {
              headerClass: "flex-1",
              cellClass: "flex-1",
            },
          },
          {
            id: "role",
            accessorFn: (node) => node.role.name,
            header: ({ column }) => (
              <DataTable.DataTableColumnHeader column={column} title="Role" />
            ),
            cell: ({ row }) => {
              return <>{capitalize(row.getValue("role"))}</>;
            },
            meta: {
              headerClass: "flex-1",
              cellClass: "flex-1",
            },
          },
          {
            id: "updated_at",
            accessorFn: (node) => node.updated_at,
            header: ({ column }) => (
              <DataTable.DataTableColumnHeader
                column={column}
                title="Updated At"
              />
            ),
            cell: ({ row }) => {
              return <>{toISODate(row.getValue("updated_at"), userTimezone)}</>;
            },
            meta: {
              headerClass: "flex-2",
              cellClass: "flex-2",
            },
          },
        ]}
      />
      <DialogContent className="sm:max-w-[450px]">
        <InviteTeamMemberForm roles={data.orgAllRoles} />
      </DialogContent>
    </Dialog>
  );
};

TeamTab.queries = {
  main,
  orgMembers,
};
