import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@guesthub/ui/breadcrumb";
import { Card } from "@guesthub/ui/card";
import { DataTable } from "@guesthub/ui/data-table";
import { Button } from "@guesthub/ui/button";
import { Checkbox } from "@guesthub/ui/checkbox";
import { SortAscIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@guesthub/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@guesthub/ui/badge";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "pending",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-5">
        <Card variant="info">
          <Card.Header>
            <Card.Title>Dashboard</Card.Title>
          </Card.Header>
          <Card.Content className="text-foreground-info px-6 pb-3">
            Welcome to the dashboard. This is a great place to start.
          </Card.Content>
        </Card>
        <Card variant="success">
          <Card.Header>
            <Card.Title>Dashboard</Card.Title>
          </Card.Header>
          <Card.Content className="text-foreground-success px-6 pb-3">
            Welcome to the dashboard. This is a great place to start.
          </Card.Content>
        </Card>
        <Card variant="attention">
          <Card.Header>
            <Card.Title>Dashboard</Card.Title>
          </Card.Header>
          <Card.Content className="text-foreground-error px-6 pb-3">
            Welcome to the dashboard. This is a great place to start.
          </Card.Content>
        </Card>
        <Card variant="error">
          <Card.Header>
            <Card.Title>Dashboard</Card.Title>
          </Card.Header>
          <Card.Content className="text-foreground-error px-6 pb-3">
            Welcome to the dashboard. This is a great place to start.
          </Card.Content>
        </Card>
      </div>

      <div className="flex gap-5 flex-col md:flex-row">
        <div className="basis-0 grow-[2]">
          <DataTable
            loading={false}
            data={data}
            totalCount={data.length}
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
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                  />
                ),
                enableSorting: false,
                enableHiding: false,
              },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                  switch (row.getValue("status")) {
                    case "success":
                      return <Badge variant="success">Success</Badge>;
                    case "processing":
                      return <Badge variant="info">Processing</Badge>;
                    case "failed":
                      return <Badge variant="destructive">Failed</Badge>;
                    case "pending":
                      return <Badge variant="attention">Pending</Badge>;
                    default:
                      return null;
                  }
                },
              },
              {
                accessorKey: "email",
                header: ({ column }) => {
                  return (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                      }
                    >
                      Email
                      <SortAscIcon className="ml-2 h-4 w-4" />
                    </Button>
                  );
                },
                cell: ({ row }) => (
                  <div className="lowercase">{row.getValue("email")}</div>
                ),
              },
              {
                accessorKey: "amount",
                header: () => <div className="text-right">Amount</div>,
                cell: ({ row }) => {
                  const amount = parseFloat(row.getValue("amount"));

                  // Format the amount as a dollar amount
                  const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(amount);

                  return (
                    <div className="text-right font-medium">{formatted}</div>
                  );
                },
              },
              {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                  const payment = row.original;

                  return (
                    <div className="flex flex-row justify-end pr-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-8 w-fit p-2 self-end">
                            Open menu
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(payment.id);
                              toast.success("Payment ID copied to clipboard");
                            }}
                          >
                            Copy payment ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View customer</DropdownMenuItem>
                          <DropdownMenuItem>
                            View payment details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                },
              },
            ]}
          />
        </div>

        <Card className="bg-background-surface basis-0 grow flex flex-col h-fit">
          <Card.Header>
            <Card.Title>Dashboard</Card.Title>
            <Card.Description>
              Welcome to the dashboard. This is a great place to start.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-1 grow items-center px-6 pb-4">
            Welcome to the dashboard. This is a great place to start.
          </Card.Content>
          <Card.Footer className="flex justify-end">
            <Button
              variant="destructive"
              className="self-end"
              onClick={() => toast.success("Deleted successfully")}
            >
              Delete
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
