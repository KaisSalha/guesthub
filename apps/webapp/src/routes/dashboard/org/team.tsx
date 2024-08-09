import { useMemo } from "react";
import {
  createFileRoute,
  Outlet,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { NavBar } from "@/components/nav-bar";

export const TeamDashboard = () => {
  const router = useRouter();
  const routerState = useRouterState();

  const tabs = useMemo(
    () => [
      {
        title: "Team",
        selected:
          routerState.location.pathname === `/dashboard/org/team` ||
          routerState.location.pathname === `/dashboard/org/team`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/team",
          }),
      },
      {
        title: "Roles & Permissions",
        selected:
          routerState.location.pathname === `/dashboard/org/team/roles` ||
          routerState.location.pathname === `/dashboard/org/team/roles`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/team/roles",
          }),
      },
    ],
    [router, routerState.location.pathname]
  );

  return (
    <>
      <NavBar tabs={tabs} />
      <Outlet />
    </>
  );
};

export const Route = createFileRoute("/dashboard/org/team")({
  component: TeamDashboard,
});
