import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@guesthub/ui/breadcrumb";
import { Header } from "@/components/header";

const Events = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Events</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/events/")({
  component: Events,
});
