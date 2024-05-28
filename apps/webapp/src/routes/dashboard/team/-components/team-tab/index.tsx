import React from "react";
import { useMe } from "@/hooks/use-me";
import { QueryTable } from "@/components/query-table";
import {
  GetOrgInvitesQuery,
  GetOrgInvitesQueryVariables,
  GetOrgInvites_InvitesFragment,
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
import { orgInvites } from "./queries/org-invites-query";

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
      <div className="flex flex-col gap-36">
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
              <Button size="sm">Invite</Button>
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
                headerClass: "w-fit min-w-2 md:max-w-2",
                cellClass: "w-fit min-w-2 md:max-w-2",
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
                return (
                  <>{toISODate(row.getValue("updated_at"), userTimezone)}</>
                );
              },
            },
          ]}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Invites</h2>
          <QueryTable<
            "orgInvites",
            GetOrgInvitesQuery,
            GetOrgInvitesQueryVariables,
            GetOrgInvites_InvitesFragment
          >
            query={TeamTab.queries.orgInvites}
            variables={{
              orgId: selectedMembership?.organization.id,
            }}
            resultKey="orgInvites"
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
                  headerClass: "w-fit min-w-2 md:max-w-2",
                  cellClass: "w-fit min-w-2 md:max-w-2",
                },
              },
              {
                id: "email",
                accessorFn: (node) => node.email,
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Email"
                  />
                ),
                cell: ({ row }) => {
                  return <>{capitalize(row.getValue("email"))}</>;
                },
              },
              {
                id: "role",
                accessorFn: (node) => node.role.name,
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Role"
                  />
                ),
                cell: ({ row }) => {
                  return <>{capitalize(row.getValue("role"))}</>;
                },
              },
              {
                id: "created_at",
                accessorFn: (node) => node.created_at,
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Created At"
                  />
                ),
                cell: ({ row }) => {
                  return (
                    <>{toISODate(row.getValue("created_at"), userTimezone)}</>
                  );
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
                  return (
                    <>{toISODate(row.getValue("updated_at"), userTimezone)}</>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
      <DialogContent className="sm:max-w-[450px]">
        <InviteTeamMemberForm roles={data.orgAllRoles} />
      </DialogContent>
    </Dialog>
  );
};

TeamTab.queries = {
  main,
  orgMembers,
  orgInvites,
};
