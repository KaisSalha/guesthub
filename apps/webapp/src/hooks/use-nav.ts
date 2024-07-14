import {
  Home,
  Calendar,
  Ticket,
  Users,
  UsersRound,
  ConciergeBell,
  LineChart,
  LucideIcon,
} from "lucide-react";
import { Mode, useMode } from "./use-mode";
import { useMemo } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

export interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    icon: LucideIcon;
    selected: boolean;
    onClick: () => void;
  }[];
}

export const useNav = () => {
  const { mode } = useMode();
  const router = useRouter();
  const routerState = useRouterState();

  const sidebarSections: NavProps["links"][] = useMemo(
    () =>
      mode === Mode.Org
        ? [
            [
              {
                title: "Home",
                icon: Home,
                selected: routerState.location.pathname === "/dashboard",
                onClick: () =>
                  router.navigate({
                    to: "/dashboard",
                  }),
              },
              {
                title: "Events",
                icon: Ticket,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/org/events"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/org/events",
                  }),
              },
              {
                title: "Calendar",
                icon: Calendar,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/org/calendar"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/org/calendar",
                  }),
              },
              {
                title: "Requests",
                icon: ConciergeBell,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/org/requests"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/org/requests",
                  }),
              },
              {
                title: "Guests",
                icon: UsersRound,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/org/guests"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/org/guests",
                  }),
              },
              {
                title: "Reports",
                icon: LineChart,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/org/reports"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/org/reports",
                  }),
              },
              {
                title: "Team",
                icon: Users,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/org/team"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/org/team",
                  }),
              },
            ],
          ]
        : [
            [
              {
                title: "Home",
                icon: Home,
                selected: routerState.location.pathname === "/dashboard",
                onClick: () =>
                  router.navigate({
                    to: "/dashboard",
                  }),
              },
              {
                title: "Events",
                icon: Ticket,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/guest/events"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/guest/events",
                  }),
              },
              {
                title: "Calendar",
                icon: Calendar,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/guest/calendar"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/guest/calendar",
                  }),
              },
              {
                title: "Requests",
                icon: ConciergeBell,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/guest/requests"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/guest/requests",
                  }),
              },
              {
                title: "Reports",
                icon: LineChart,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/guest/reports"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/guest/reports",
                  }),
              },
            ],
          ],
    [router, routerState.location.pathname, mode]
  );

  return { sidebarSections };
};
