import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@guesthub/ui/breadcrumb";
import { Card } from "@guesthub/ui/card";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/components">Components</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="bg-background-surface">
        <Card.Header>
          <Card.Title>Dashboard</Card.Title>
          <Card.Description>
            Welcome to the dashboard. This is a great place to start.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-3"></Card.Content>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
