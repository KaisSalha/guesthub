import { createFileRoute, useParams } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { AspectRatio } from "@guesthub/ui/aspect-ratio";
import { Calendar, Image, MapPin, User, UsersRound } from "lucide-react";
import { useQuery } from "@apollo/client";
import { graphql } from "gql.tada";
import {
  GetEventDetailsQuery,
  GetEventDetailsQueryVariables,
} from "@/gql/graphql";
import { Card } from "@guesthub/ui/card";
import { formatDateWindow, formatTimestamp } from "@/utils/datetime";
import { useMe } from "@/hooks/use-me";

const Details = () => {
  const { selectedMembership } = useMe();
  const params = useParams({ strict: false });

  const id = params.id || "";

  const { data } = useQuery<
    GetEventDetailsQuery,
    GetEventDetailsQueryVariables
  >(Details.query, {
    variables: { id },
  });

  if (!data || !data.event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-5 md:gap-10 xl:gap-20">
      <div className="flex flex-col gap-2 md:gap-6 md:w-4/6 max-w-screen-md">
        <AspectRatio
          ratio={1.91 / 1}
          className="border-b border-border-subtle pb-4 md:p-0"
        >
          <Avatar className="cursor-pointer w-full h-full rounded-none">
            <AvatarImage
              src={data.event.banner_url || undefined}
              className="h-full w-full rounded-md"
            />
            <AvatarFallback className="flex items-center justify-center h-full w-full border border-dashed cursor-pointer text-foreground-subtle rounded-md bg-transparent">
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
        <div className="flex flex-col gap-4 px-2 border-b border-border-subtle">
          <h2 className="text-lg font-bold">Details:</h2>
          <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-2 md:col-span-2">
              <span className="font-semibold">ID:</span>
              <span>{data.event.id}</span>
            </div>
            <div className="flex flex-row gap-2 col-start-1 md:col-span-2">
              <span className="font-semibold">Name:</span>
              <span>{data.event.name}</span>
            </div>
            <div className="flex flex-row gap-2 col-start-1 md:col-span-2">
              <span className="font-semibold">Tagline:</span>
              <span>{data.event.tagline}</span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="font-semibold">Start Time:</span>
              <span>
                {formatTimestamp(data.event.start_time, "DATE_TIME", {
                  timeZone: selectedMembership?.organization.timezone,
                })}
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="font-semibold">End Time:</span>
              <span>
                {formatTimestamp(data.event.end_time, "DATE_TIME", {
                  timeZone: selectedMembership?.organization.timezone,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-2">
          <h2 className="text-lg font-bold">Agenda:</h2>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-4 md:w-2/6 max-w-96">
        <div className="border-b border-border-subtle md:border-none">
          <Card variant="desktopOnly">
            <div className="flex flex-row w-full gap-4 items-center p-2 md:p-4">
              <Avatar className="cursor-pointer w-fit h-fit">
                <AvatarImage
                  src={data.event.created_by?.avatar_url ?? undefined}
                  className="h-14 w-14"
                />
                <AvatarFallback className="bg-transparent border p-2 rounded-full">
                  <User strokeWidth={1.25} className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="font-medium">{`${data.event.created_by?.first_name} ${data.event.created_by?.last_name}`}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {`Created on ${formatTimestamp(data.event.created_at, "DATE", { timeZone: selectedMembership?.organization.timezone })}`}
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div className="border-b border-border-subtle md:border-none">
          <Card variant="desktopOnly">
            <div className="flex flex-row w-full gap-4 items-center p-2 pb-4 md:p-4">
              <Card.Content className="px-3 flex flex-col gap-2.5">
                <p className="text-sm flex flex-row gap-2 items-center text-foreground-subtle">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDateWindow({
                      ts1: data.event.start_time,
                      ts2: data.event.end_time,
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
                <p className="text-sm flex flex-row gap-2 items-center text-foreground-subtle">
                  <UsersRound className="w-4 h-4" />
                  <span>0 Guests</span>
                </p>
              </Card.Content>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

Details.query = graphql(/* GraphQL */ `
  query GetEventDetails($id: ID!) {
    event(id: $id) {
      id
      name
      tagline
      banner_url
      logo_url
      updated_at
      start_time
      end_time
      timezone
      address
      city
      created_by {
        id
        first_name
        last_name
        avatar_url
      }
      created_at
    }
  }
`);

export const Route = createFileRoute("/dashboard/events/$id/details/")({
  component: Details,
});
