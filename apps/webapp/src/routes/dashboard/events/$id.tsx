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
            `/dashboard/events/${encodeURIComponent(id)}` ||
          routerState.location.pathname === `/dashboard/events/${id}`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/events/$id",
            params: {
              id,
            },
          }),
      },
      {
        title: "Details",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/events/${encodeURIComponent(id)}/details`
          ) ||
          routerState.location.pathname === `/dashboard/events/${id}/details`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/events/$id/details",
            params: {
              id,
            },
          }),
      },
      {
        title: "Guests",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/events/${encodeURIComponent(id)}/guests`
          ) ||
          routerState.location.pathname === `/dashboard/events/${id}/guests`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/events/$id/guests",
            params: {
              id,
            },
          }),
      },
      {
        title: "Content",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/events/${encodeURIComponent(id)}/content`
          ) ||
          routerState.location.pathname === `/dashboard/events/${id}/content`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/events/$id/content",
            params: {
              id,
            },
          }),
      },
      {
        title: "Requests",
        selected:
          routerState.location.pathname.startsWith(
            `/dashboard/events/${encodeURIComponent(id)}/requests`
          ) ||
          routerState.location.pathname === `/dashboard/events/${id}/requests`,
        onClick: () =>
          router.navigate({
            to: "/dashboard/events/$id/requests",
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
      <div className="border-t border-border-subtle mb-5 md:mb-10">
        <ScrollArea>
          <div className="flex flex-row gap-9 *:py-3 *:cursor-pointer *:text-sm">
            {tabs.map((tab) => (
              <nav
                key={tab.title}
                className={cn(
                  tab.selected
                    ? "border-t border-brand"
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

export const Route = createFileRoute("/dashboard/events/$id")({
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
