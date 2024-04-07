import React, { useMemo } from "react";
import { NavItem, NavItemProp } from "./nav-item";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Calendar, Home, LayoutGrid, Ticket, Users } from "lucide-react";

export const BottomBar = () => {
  const router = useRouter();
  const routerState = useRouterState();

  const sections: NavItemProp[] = useMemo(
    () => [
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
        title: "Calendar",
        icon: Calendar,
        selected: routerState.location.pathname === "/calendar",
        onClick: () =>
          router.navigate({
            to: "/dashboard",
          }),
      },
      {
        title: "Events",
        icon: Ticket,
        selected: routerState.location.pathname === "/events",
        onClick: () =>
          router.navigate({
            to: "/dashboard",
          }),
      },
      {
        title: "Guests",
        icon: Users,
        selected: routerState.location.pathname === "/guests",
        onClick: () =>
          router.navigate({
            to: "/dashboard",
          }),
      },
      {
        title: "More",
        icon: LayoutGrid,
        selected: routerState.location.pathname === "/more",
        onClick: () =>
          router.navigate({
            to: "/dashboard",
          }),
      },
    ],
    [router, routerState.location.pathname]
  );

  return (
    <div className="border-subtle fixed bottom-0 left-0 z-30 flex w-full border-t bg-background-surface md:hidden px-3">
      <div className="flex justify-between w-full">
        {sections.map((section, index) => (
          <NavItem key={index} {...section} />
        ))}
      </div>
    </div>
  );
};
