import { createFileRoute } from "@tanstack/react-router";
import React, { useRef, useState } from "react";
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
import { Switch } from "@guesthub/ui/switch";
import { toISODate, userTimezone } from "@/utils/datetime";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@guesthub/ui/sheet";
import { Label } from "@guesthub/ui/label";
import { Checkbox } from "@guesthub/ui/checkbox";
import { useSetHeader } from "@/components/header";

export const Roles = () => {
  const { selectedMembership } = useMe();
  const tableRef = useRef<HTMLDivElement>(null);

  useSetHeader({
    title: "Roles & Permissions",
  });

  const [selectedRow, setSelectedRow] = useState<
    GetOrgRoles_RolesFragment | undefined
  >();

  if (!selectedMembership?.organization.id) return null;

  return (
    <>
      <Sheet open={!!selectedRow}>
        <SheetContent
          onPointerDownOutside={(e) => {
            if (tableRef.current?.contains(e.target as Node)) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }

            setSelectedRow(undefined);
          }}
        >
          <SheetHeader>
            <SheetTitle>{capitalize(selectedRow?.name)}</SheetTitle>
            <SheetDescription className="flex flex-col" asChild>
              <div className="flex flex-col gap-6">
                {selectedRow &&
                  Object.keys(selectedRow.permissions)?.map(
                    (permission: string, index: number) => (
                      <div
                        className="flex flex-row justify-between items-center"
                        key={index}
                      >
                        <Label className="text-foreground">
                          {capitalize(
                            permission.replaceAll("_", " ").toLowerCase()
                          )}
                        </Label>
                        <Switch
                          key={index}
                          checked={selectedRow.permissions[permission]}
                        />
                      </div>
                    )
                  )}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div ref={tableRef}>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Roles</h2>
          <QueryTable<
            "orgRoles",
            GetOrgRolesQuery,
            GetOrgRolesQueryVariables,
            GetOrgRoles_RolesFragment
          >
            query={Roles.query}
            variables={{
              orgId: selectedMembership?.organization.id,
            }}
            resultKey="orgRoles"
            // onCreateButtonClick={() => {
            //   router.navigate({ to: "/dashboard/challenges/new" });
            // }}
            onRowClick={(row) => setSelectedRow(row)}
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
                      className="translate-y-[2px]"
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
                accessorFn: (node) => node.name,
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
                    <div>
                      {
                        Object.values(
                          row.getValue("permissions") as object
                        ).filter((value) => value === true).length
                      }
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
    </>
  );
};

Roles.query = graphql(/* GraphQL */ `
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

  fragment GetOrgRoles_Roles on OrgRole {
    id
    name
    permissions
    updated_at
  }
`);

export const Route = createFileRoute("/dashboard/org/team/roles")({
  component: Roles,
});
