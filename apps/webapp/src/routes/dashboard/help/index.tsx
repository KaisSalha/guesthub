import { createFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@guesthub/ui/breadcrumb";
import { Header } from "@/components/header";

const Help = () => {
  return (
    <div className="flex flex-col gap-8 mb-4">
      <Header>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/help/")({
  component: Help,
});
