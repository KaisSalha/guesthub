import { createFileRoute, useParams } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { AspectRatio } from "@guesthub/ui/aspect-ratio";
import { Building2, Calendar, Image, MapPin, User } from "lucide-react";
import { useQuery } from "@apollo/client";
import { graphql } from "gql.tada";
import {
  GetEventDetailsQuery,
  GetEventDetailsQueryVariables,
} from "@/gql/graphql";
import { Card } from "@guesthub/ui/card";
import { formatDateWindow, formatTimestamp } from "@/utils/datetime";
import { useMe } from "@/hooks/use-me";
import { client } from "@/lib/apollo-client";
import { Separator } from "@guesthub/ui/separator";

const Overview = () => {
  const { selectedMembership } = useMe();
  const params = useParams({ strict: false });

  const id = params.id || "";

  const { data } = useQuery<
    GetEventDetailsQuery,
    GetEventDetailsQueryVariables
  >(Overview.query, {
    variables: { id },
  });

  if (!data || !data.event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-5 lg:gap-10 xl:gap-20 mb-10">
      <Card
        variant="desktopOnly"
        className="flex flex-col md:w-4/6 max-w-screen-lg"
      >
        <div className="relative">
          <AspectRatio ratio={1.91 / 1}>
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage
                src={data.event.banner_url || undefined}
                className="h-full w-full"
              />
              <AvatarFallback className="flex items-center justify-center h-full w-full border border-dashed text-foreground-subtle rounded-md bg-transparent">
                <div className="p-1.5 text-foreground-subtle">
                  <Image
                    strokeWidth={1}
                    className="w-8 h-8 text-foreground-subtle"
                  />
                </div>
                <span>Add an event banner</span>
              </AvatarFallback>
            </Avatar>
          </AspectRatio>
          <Avatar className="absolute -bottom-[4.5rem] left-1/2 transform -translate-x-1/2 md:left-4 md:translate-x-0 w-28 h-28 rounded-md border border-border-subtle">
            <AvatarImage
              src={data.event.logo_url || undefined}
              className="h-28 w-28"
            />
            <AvatarFallback className="bg-transparent border p-2 rounded-md">
              <Building2 strokeWidth={0.5} className="h-24 w-24" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-5 md:pb-10 pt-20 md:pt-0">
          <div className="flex flex-row gap-2 items-start justify-center md:justify-normal mt-3">
            <div className="w-28 hidden md:flex" />
            <div className="flex flex-col">
              <p className="text-xl font-bold">{data.event.name}</p>
              <p className="text-sm text-foreground-subtle">
                {data.event.tagline}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 md:gap-10">
          <div className="flex flex-col lg:flex-row px-4 md:px-6 gap-4 lg:gap-0">
            <p className="flex flex-row gap-2 items-center text-foreground-subtle flex-1 text-sm">
              <Calendar className="w-6 h-6" strokeWidth={1.25} />
              <div>
                {formatDateWindow({
                  ts1: data.event.start_date,
                  ts2: data.event.end_date,
                  options: {
                    timeZone: data.event.timezone,
                  },
                })}
              </div>
            </p>
            <p className="flex flex-row gap-2 items-center text-foreground-subtle flex-1 text-sm">
              <MapPin className="w-6 h-6" strokeWidth={1.25} />
              <span>
                {data.event.address}, {data.event.city}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 px-4 pb-10">
            <p className="leading-7">{data.event.description}</p>
          </div>
        </div>
      </Card>
      <Separator className="md:hidden" />
      <div className="flex flex-col gap-5 md:gap-4 min-w-full md:min-w-0 md:w-2/6 max-w-96">
        <Card variant="desktopOnly">
          <div className="flex flex-row w-full gap-4 items-center p-2 md:p-4">
            <Avatar className="w-fit h-fit">
              <AvatarImage
                src={data.event.created_by?.avatar_url ?? undefined}
                className="h-14 w-14"
              />
              <AvatarFallback className="bg-transparent border p-2 rounded-full">
                <User strokeWidth={1.25} className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-medium">{`${data.event.created_by?.full_name}`}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {`Created on ${formatTimestamp(data.event.created_at, "DATE", { timeZone: selectedMembership?.organization.timezone })}`}
              </span>
            </div>
          </div>
        </Card>
        <Separator className="md:hidden" />
        <Card variant="desktopOnly">
          <Card.Content className="px-3 flex flex-col gap-2.5 w-full p-2 pb-4 md:p-4">
            <p className="text-sm flex flex-row gap-2 items-center text-foreground-subtle">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDateWindow({
                  ts1: data.event.start_date,
                  ts2: data.event.end_date,
                  options: {
                    timeZone: data.event.timezone,
                  },
                })}
              </span>
            </p>
            <p className="text-sm flex flex-row gap-2 items-center text-foreground-subtle">
              <MapPin className="w-4 h-4" />
              <span>
                {data.event.address}, {data.event.city}
              </span>
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

Overview.query = graphql(/* GraphQL */ `
  query GetEventDetails($id: ID!) {
    event(id: $id) {
      id
      name
      tagline
      description
      banner_url
      logo_url
      updated_at
      start_date
      end_date
      timezone
      address
      city
      created_by {
        id
        full_name
        avatar_url
      }
      created_at
    }
  }
`);

export const Route = createFileRoute("/dashboard/events/$id/")({
  loader: async ({ params: { id } }) => {
    await client.query({
      query: Overview.query,
      variables: { id },
    });
  },
  component: Overview,
});
