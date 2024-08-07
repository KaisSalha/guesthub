import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";
import { ScrollArea, ScrollBar } from "@guesthub/ui/scroll-area";
import { Calendar, MapPin, Plus, UsersRound } from "lucide-react";
import { Button } from "@guesthub/ui/button";
import { graphql } from "gql.tada";
import { useQuery } from "@apollo/client";
import {
  GetOrgEventsDocument,
  GetOrgEventsQuery,
  GetOrgEventsQueryVariables,
  GetEvents_EventsFragment,
} from "@/gql/graphql";
import { getMe, useMe } from "@/hooks/use-me";
import { client } from "@/lib/apollo-client";
import { Card } from "@guesthub/ui/card";
import { Unmasked } from "@/types/gql-helpers";
import { useCallback } from "react";
import { formatDateWindow } from "@/utils/datetime";

const Events = () => {
  const { selectedMembership } = useMe();
  const navigate = useNavigate();
  const { data } = useQuery<GetOrgEventsQuery, GetOrgEventsQueryVariables>(
    Events.query,
    {
      variables: {
        first: 10,
        offset: 0,
        orgId: selectedMembership?.organization.id || "",
      },
      skip: !selectedMembership?.organization.id,
    }
  );

  const onEventClick = useCallback(
    (eventId: string) => {
      navigate({
        to: "/dashboard/org/events/$id",
        params: {
          id: eventId,
        },
      });
    },
    [navigate]
  );

  const nodes = data?.orgEvents.edges.map(
    (edge) => edge!.node!
  ) as Unmasked<GetEvents_EventsFragment>[];

  useSetHeader({
    title: "Events",
    subtitle: "Create and manage event details and schedules",
  });

  return (
    <div className="flex flex-col gap-10 mb-4">
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Button
            size="sm"
            onClick={() => {
              navigate({
                to: "/dashboard/org/events/create-event",
              });
            }}
            className="cursor-pointer"
          >
            Create Event
          </Button>
        </div>
        <ScrollArea>
          <div className="flex w-max space-x-4">
            {nodes?.map((node) => (
              <Card
                className="w-72 cursor-pointer"
                key={node.id}
                onClick={() => onEventClick(node.id)}
              >
                <img src={node.banner_url!} alt={node.name} />
                <Card.Header className="px-3 py-4">
                  <Card.Title>{node.name}</Card.Title>
                </Card.Header>
                <Card.Content className="px-3 flex flex-col gap-2.5">
                  <div className="text-sm flex flex-row gap-2 items-center text-foreground-subtle">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDateWindow({
                        ts1: node.start_date,
                        ts2: node.end_date,
                        options: {
                          timeZone: node.timezone,
                        },
                      })}
                    </span>
                  </div>
                  <div className="text-sm flex flex-row gap-2 items-center text-foreground-subtle">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {node.address}, {node.city}
                    </span>
                  </div>
                  <div className="text-sm flex flex-row gap-2 items-center text-foreground-subtle">
                    <UsersRound className="w-4 h-4" />
                    <span>0 Guests</span>
                  </div>
                </Card.Content>
              </Card>
            ))}
            <div
              className="flex flex-col gap-2 justify-center items-center border border-border border-dashed rounded-lg p-4 min-w-72 h-80 hover:cursor-pointer hover:opacity-85"
              onClick={() => {
                navigate({
                  to: "/dashboard/org/events/create-event",
                });
              }}
            >
              <div className="p-1.5 rounded-full bg-background-inverted">
                <Plus className="w-10 h-10 text-foreground-inverted" />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <h3 className="text-lg font-semibold">Create Event</h3>
                <p className="text-sm text-foreground-muted text-center">
                  Create a new upcoming event
                </p>
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg font-semibold">Past Events</h2>
        </div>
        <ScrollArea>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

Events.query = graphql(/* GraphQL */ `
  query GetOrgEvents($first: Int!, $offset: Int!, $orgId: ID!) {
    orgEvents(first: $first, offset: $offset, orgId: $orgId) {
      totalCount
      edges {
        node {
          ...GetEvents_Events
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }

  fragment GetEvents_Events on Event {
    id
    name
    tagline
    banner_url
    logo_url
    start_date
    end_date
    address
    city
    timezone
  }
`);

export const Route = createFileRoute("/dashboard/org/events/")({
  loader: async () => {
    const { selectedMembership } = await getMe();

    if (!selectedMembership) {
      return;
    }

    await client.query<GetOrgEventsQuery, GetOrgEventsQueryVariables>({
      query: GetOrgEventsDocument,
      variables: {
        first: 10,
        offset: 0,
        orgId: selectedMembership.organization.id,
      },
    });

    return;
  },
  component: Events,
});
