import { Card } from "@guesthub/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <Card>
        <Card.Header>
          <Card.Title>Dashboard</Card.Title>
          <Card.Description>View and manage your data</Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-3">
          <p>Card Content</p>
        </Card.Content>
        <Card.Footer>
          <p>Card Footer</p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
