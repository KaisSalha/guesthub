import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@guesthub/ui/breadcrumb";

const Requests = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Requests</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/requests/")({
  component: Requests,
});
