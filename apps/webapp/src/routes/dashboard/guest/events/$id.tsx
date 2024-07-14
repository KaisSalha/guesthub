import { cn } from "@guesthub/ui/lib";
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { graphql } from "gql.tada";
import { useQuery } from "@apollo/client";
import { GetEventQuery, GetEventQueryVariables } from "@/gql/graphql";
import { client } from "@/lib/apollo-client";
import { useSetHeader } from "@/components/header";
import { ScrollArea, ScrollBar } from "@guesthub/ui/scroll-area";

const Event = () => {
  const router = useRouter();
  const routerState = useRouterState();

  const params = useParams({ strict: false });

  const id = params.id || "";

  const { data } = useQuery<GetEventQuery, GetEventQueryVariables>(
    Event.query,
    {
      variables: { id },
    }
  );

  useSetHeader({
    title: data?.event?.name || "",
    subtitle: data?.event?.tagline || "",
    showOnMobile: true,
    showSubtitleOnMobile: true,
  });

  const tabs = useMemo(
    () => [
      {
        title: "Overview",
        selected:
          routerState.location.pathname ===
            `/dashboard/org/events/${encodeURIComponent(id)}` ||
          routerState.location.pathname === `/dashboard/org/events/${id}`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/events/$id",
            params: {
              id,
            },
          }),
      },
      {
        title: "Details",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/org/events/${encodeURIComponent(id)}/details`
          ) ||
          routerState.location.pathname ===
            `/dashboard/org/events/${id}/details`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/events/$id/details",
            params: {
              id,
            },
          }),
      },
      {
        title: "Attendees",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/org/events/${encodeURIComponent(id)}/attendees`
          ) ||
          routerState.location.pathname ===
            `/dashboard/org/events/${id}/attendees`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/events/$id/attendees",
            params: {
              id,
            },
          }),
      },
      {
        title: "Agenda",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/org/events/${encodeURIComponent(id)}/agenda`
          ) ||
          routerState.location.pathname ===
            `/dashboard/org/events/${id}/agenda`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/events/$id/agenda",
            params: {
              id,
            },
          }),
      },
      {
        title: "Content",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/org/events/${encodeURIComponent(id)}/content`
          ) ||
          routerState.location.pathname ===
            `/dashboard/org/events/${id}/content`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/events/$id/content",
            params: {
              id,
            },
          }),
      },
      {
        title: "Requests",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/org/events/${encodeURIComponent(id)}/requests`
          ) ||
          routerState.location.pathname ===
            `/dashboard/org/events/${id}/requests`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/org/events/$id/requests",
            params: {
              id,
            },
          }),
      },
    ],
    [id, router, routerState.location.pathname]
  );

  return (
    <>
      <div className="border-b border-border-subtle mb-5 md:mb-6">
        <ScrollArea>
          <div className="flex flex-row gap-8 *:pb-3 *:cursor-pointer *:text-sm">
            {tabs.map((tab) => (
              <nav
                key={tab.title}
                className={cn(
                  "font-medium",
                  tab.selected
                    ? "border-b border-brand"
                    : "text-foreground-muted hover:text-foreground"
                )}
                onClick={tab.onClick}
              >
                {tab.title}
              </nav>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Outlet />
    </>
  );
};

Event.query = graphql(/* GraphQL */ `
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      tagline
      banner_url
      logo_url
      updated_at
    }
  }
`);

export const Route = createFileRoute("/dashboard/guest/events/$id")({
  loader: async ({ params: { id } }) => {
    if (!id) {
      throw new Error("No ID");
    }

    await client.query({
      query: Event.query,
      variables: { id },
    });
  },
  component: Event,
});
