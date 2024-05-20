import React from "react";
import { useMe } from "@/hooks/use-me";
import { graphql } from "gql.tada";
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

export const TeamTab = () => {
  const { selectedMembership } = useMe();

  if (!selectedMembership?.organization.id) return null;

  return (
    <QueryTable<
      "orgMembers",
      GetOrgMembersQuery,
      GetOrgMembersQueryVariables,
      GetOrgMembers_MembersFragment
    >
      query={TeamTab.query}
      variables={{
        orgId: selectedMembership?.organization.id,
      }}
      resultKey="orgMembers"
      // onCreateButtonClick={() => {
      //   router.navigate({ to: "/dashboard/challenges/new" });
      // }}
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
  );
};

TeamTab.query = graphql(/* GraphQL */ `
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

  fragment GetOrgMembers_Members on Membership {
    id
    user {
      id
      full_name
      avatar_url
      type
    }
    role {
      id
      name
      permissions
    }
    updated_at
  }
`);
