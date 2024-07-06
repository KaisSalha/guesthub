import { createFileRoute, useParams } from "@tanstack/react-router";
import React, { useRef, useState } from "react";
import { graphql } from "gql.tada";
import { QueryTable } from "@/components/query-table";
import {
  GetEventAttendanceListQuery,
  GetEventAttendanceListQueryVariables,
  GetEventAttendanceList_AttendeesFragment,
} from "@/gql/graphql";
import { DataTable } from "@guesthub/ui/data-table";
import { capitalize } from "@/utils/string-utils";
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
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@guesthub/ui/dialog";
import { InviteGuestForm } from "./-components/invite-guest-form";
import { useMe } from "@/hooks/use-me";
import { Button } from "@guesthub/ui/button";

const Attendees = () => {
  const { permissions } = useMe();
  const tableRef = useRef<HTMLDivElement>(null);
  const params = useParams({ strict: false });

  const [selectedRow, setSelectedRow] = useState<
    GetEventAttendanceList_AttendeesFragment | undefined
  >();

  if (!params.id || !permissions) return null;

  return (
    <>
      <Dialog>
        <DialogOverlay />
        <Sheet open={!!selectedRow} modal={false}>
          <SheetContent
            onPointerDownOutside={(e) => {
              if (tableRef.current?.contains(e.target as Node)) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }

              setSelectedRow(undefined);
            }}
            close={() => setSelectedRow(undefined)}
          >
            <SheetHeader>
              <SheetTitle>{capitalize(selectedRow?.email)}</SheetTitle>
              <SheetDescription className="flex flex-col" asChild>
                <div className="flex flex-col gap-6">
                  {selectedRow && (
                    <div>
                      <Label>Attendance Type</Label>
                      <div>{selectedRow.attendance_type}</div>
                    </div>
                  )}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div ref={tableRef}>
          <div className="flex flex-col gap-2 md:px-4">
            <QueryTable<
              "eventAttendanceList",
              GetEventAttendanceListQuery,
              GetEventAttendanceListQueryVariables,
              GetEventAttendanceList_AttendeesFragment
            >
              query={Attendees.query}
              variables={{
                eventId: params.id,
              }}
              resultKey="eventAttendanceList"
              toolBarButtons={
                <>
                  {permissions.CAN_INVITE_GUESTS && (
                    <DialogTrigger asChild>
                      <Button size="sm">Invite</Button>
                    </DialogTrigger>
                  )}
                </>
              }
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
          <InviteGuestForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

Attendees.query = graphql(/* GraphQL */ `
  query GetEventAttendanceList($first: Int!, $offset: Int!, $eventId: ID!) {
    eventAttendanceList(first: $first, offset: $offset, eventId: $eventId) {
      totalCount
      edges {
        node {
          ...GetEventAttendanceList_Attendees
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

  fragment GetEventAttendanceList_Attendees on EventAttendance {
    id
    email
    attendance_type
    status
    travel_required
    accommodation_required
    created_at
    updated_at
  }
`);

export const Route = createFileRoute("/dashboard/events/$id/attendees/")({
  component: Attendees,
});
