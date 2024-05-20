import React from "react";
import { useMe } from "@/hooks/use-me";
import { graphql } from "gql.tada";
import { QueryTable } from "@/components/query-table";
import {
  GetOrgRolesQuery,
  GetOrgRolesQueryVariables,
  GetOrgRoles_RolesFragment,
} from "@/gql/graphql";
import { DataTable } from "@guesthub/ui/data-table";
import { capitalize } from "@/utils/string-utils";
import { Checkbox } from "@guesthub/ui/checkbox";
import { toISODate, userTimezone } from "@/utils/datetime";

export const RolesTab = () => {
  const { selectedMembership } = useMe();

  if (!selectedMembership?.organization.id) return null;

  return (
    <QueryTable<
      "orgRoles",
      GetOrgRolesQuery,
      GetOrgRolesQueryVariables,
      GetOrgRoles_RolesFragment
    >
      query={RolesTab.query}
      variables={{
        orgId: selectedMembership?.organization.id,
      }}
      resultKey="orgRoles"
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
          accessorFn: (node) => node.name,
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
          id: "permissions",
          accessorFn: (node) => node.permissions,
          header: ({ column }) => (
            <DataTable.DataTableColumnHeader
              column={column}
              title="Permissions"
            />
          ),
          cell: ({ row }) => {
            return (
              <>
                {
                  Object.values(row.getValue("permissions") as object).filter(
                    (value) => value === true
                  ).length
                }
              </>
            );
          },
          meta: {
            headerClass: "flex-2",
            cellClass: "flex-2",
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

RolesTab.query = graphql(/* GraphQL */ `
  query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {
    orgRoles(first: $first, offset: $offset, orgId: $orgId) {
      totalCount
      edges {
        node {
          ...GetOrgRoles_Roles
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

  fragment GetOrgRoles_Roles on Role {
    id
    name
    permissions
    updated_at
  }
`);
