import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Header } from "@/components/header";
import {
  SimpleTabs,
  SimpleTabsContent,
  SimpleTabsList,
  SimpleTabsTrigger,
} from "@guesthub/ui/simple-tabs";
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

const Team = () => {
  const { selectedMembership } = useMe();

  if (!selectedMembership?.organization.id) return null;

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
        <SimpleTabsContent value="roles">
          <QueryTable<
            "orgRoles",
            GetOrgRolesQuery,
            GetOrgRolesQueryVariables,
            GetOrgRoles_RolesFragment
          >
            query={Team.query}
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
                accessorKey: "name",
                header: ({ column }) => (
                  <DataTable.DataTableColumnHeader
                    column={column}
                    title="Name"
                  />
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
                accessorKey: "permissions",
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
                        Object.values(
                          row.getValue("permissions") as object
                        ).filter((value) => value === true).length
                      }
                    </>
                  );
                },
                meta: {
                  headerClass: "flex-1",
                  cellClass: "flex-1",
                },
              },
            ]}
          />
        </SimpleTabsContent>
        <SimpleTabsContent value="team">team</SimpleTabsContent>
      </SimpleTabs>
    </div>
  );
};

Team.query = graphql(/* GraphQL */ `
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
  }
`);

export const Route = createFileRoute("/dashboard/team/")({
  component: Team,
});
