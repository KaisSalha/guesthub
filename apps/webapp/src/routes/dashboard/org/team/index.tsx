import { createFileRoute } from "@tanstack/react-router";
import { graphql } from "gql.tada";
import { client } from "@/lib/apollo-client";
import { useSetHeader } from "@/components/header";
import React from "react";
import { selectedMembershipIdAtom, useMe } from "@/hooks/use-me";
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
import { useQuery } from "@apollo/client";
import { Badge } from "@guesthub/ui/badge";
import { InviteTeamMemberForm } from "./-components/invite-team-member-form";
import { jotaiStore } from "@/lib/jotai-store";

const Team = () => {
  const { selectedMembership, permissions } = useMe();

  const { data } = useQuery(Team.queries.main, {
    variables: {
      orgId: selectedMembership?.organization.id,
    },
    skip: !selectedMembership?.organization.id,
  });

  useSetHeader({
    title: "Team",
  });

  if (!selectedMembership?.organization.id || !data) return null;

  return (
    <Dialog>
      <DialogOverlay />
      <div className="flex flex-col gap-20 md:gap-32">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <QueryTable<
            "orgMembers",
            GetOrgMembersQuery,
            GetOrgMembersQueryVariables,
            GetOrgMembers_MembersFragment
          >
            query={Team.queries.orgMembers}
            variables={{
              orgId: selectedMembership?.organization.id,
            }}
            resultKey="orgMembers"
            toolBarButtons={
              <>
                {permissions.CAN_INVITE_GUESTS && (
                  <DialogTrigger asChild>
                    <Button size="sm">Invite</Button>
                  </DialogTrigger>
                )}
              </>
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
                  />
                ),
                cell: ({ row }) => (
                  <div>
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                  </div>
                ),
                enableSorting: false,
                enableHiding: false,
                meta: {
                  headerClass: "xl:max-w-3",
                  cellClass: "xl:max-w-3",
                },
              },
              {
                id: "name",
                accessorFn: (node) => node.user.full_name,
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Name"
                  />
                ),
                cell: ({ row }) => {
                  return <div>{capitalize(row.getValue("name"))}</div>;
                },
              },
              {
                id: "email",
                accessorFn: (node) => node.user.email,
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Email"
                  />
                ),
                cell: ({ row }) => {
                  return <div>{row.getValue("email")}</div>;
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
                  // If the user is the owner, return the owner role
                  if (
                    row.original.user.id ===
                    selectedMembership?.organization.owner_id
                  ) {
                    return <div>Owner</div>;
                  }

                  return <div>{capitalize(row.getValue("role"))}</div>;
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
                    <div>
                      {toISODate(row.getValue("updated_at"), userTimezone)}
                    </div>
                  );
                },
              },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Invites</h2>
          <QueryTable<
            "orgTeamInvites",
            GetOrgInvitesQuery,
            GetOrgInvitesQueryVariables,
            GetOrgInvites_InvitesFragment
          >
            query={Team.queries.orgInvites}
            variables={{
              orgId: selectedMembership?.organization.id,
            }}
            resultKey="orgTeamInvites"
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
                  <div>
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                  </div>
                ),
                enableSorting: false,
                enableHiding: false,
                meta: {
                  headerClass: "xl:max-w-3",
                  cellClass: "xl:max-w-3",
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
                  return <div>{row.getValue("email")}</div>;
                },
              },
              {
                id: "status",
                accessorFn: (node) => node.status,
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Status"
                  />
                ),
                cell: ({ row }) => {
                  switch (row.getValue("status")) {
                    case "pending":
                      return <Badge variant="attention">Pending</Badge>;
                    case "accepted":
                      return <Badge variant="success">Accepted</Badge>;
                    default:
                      return <Badge variant="destructive">Declined</Badge>;
                  }
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
                  return <div>{capitalize(row.getValue("role"))}</div>;
                },
              },
              {
                id: "created_at",
                accessorFn: (node) => node.created_at,
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Invited At"
                  />
                ),
                cell: ({ row }) => {
                  return (
                    <div>
                      {toISODate(row.getValue("created_at"), userTimezone)}
                    </div>
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
                    <div>
                      {toISODate(row.getValue("updated_at"), userTimezone)}
                    </div>
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

Team.queries = {
  main: graphql(
    `
      query TeamTabQuery($orgId: ID!) {
        orgAllRoles(orgId: $orgId) {
          ...InviteTeamMemberForm_roles
        }
      }
    `,
    [InviteTeamMemberForm.fragments.roles]
  ),
  orgMembers: graphql(/* GraphQL */ `
    query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {
      orgMembers(first: $first, offset: $offset, orgId: $orgId) {
        totalCount
        edges {
          node {
            ...GetOrgMembers_Members
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }

    fragment GetOrgMembers_Members on OrgMembership {
      id
      user {
        id
        email
        full_name
        avatar_url
      }
      role {
        id
        name
        permissions
      }
      updated_at
    }
  `),
  orgInvites: graphql(/* GraphQL */ `
    query GetOrgInvites($first: Int!, $offset: Int!, $orgId: ID!) {
      orgTeamInvites(first: $first, offset: $offset, orgId: $orgId) {
        totalCount
        edges {
          node {
            ...GetOrgInvites_Invites
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }

    fragment GetOrgInvites_Invites on OrgInvite {
      id
      email
      status
      role {
        id
        name
        permissions
      }
      created_at
      updated_at
    }
  `),
};

export const Route = createFileRoute("/dashboard/org/team/")({
  loader: async () => {
    const selectedMembershipId = jotaiStore.get(selectedMembershipIdAtom);

    if (!selectedMembershipId) return;

    await client.query({
      query: Team.queries.orgMembers,
      variables: {
        orgId: selectedMembershipId,
        first: 10,
        offset: 0,
      },
    });

    await client.query({
      query: Team.queries.orgInvites,
      variables: {
        orgId: selectedMembershipId,
        first: 10,
        offset: 0,
      },
    });
  },
  component: Team,
});
