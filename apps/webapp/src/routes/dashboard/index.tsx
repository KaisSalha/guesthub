import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Card } from "@guesthub/ui/card";
import { Button } from "@guesthub/ui/button";
import { toast } from "sonner";
import { Input } from "@guesthub/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@guesthub/ui/breadcrumb";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Content className="flex w-fit flex-col gap-8">
          <Button variant="destructive">Test</Button>

          <Input type="email" placeholder="Email" />
        </Card.Content>
      </Card>

      <div className="w-fit flex flex-col gap-5">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Show Toast
        </Button>

        <Input type="email" placeholder="Email" />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
