import { createFileRoute } from "@tanstack/react-router";
import { useSetHeader } from "@/components/header";
import { graphql } from "gql.tada";
import { useQuery } from "@apollo/client";
import { GetEventQuery, GetEventQueryVariables } from "@/gql/graphql";
import { client } from "@/lib/apollo-client";

const Event = () => {
  const { id } = Route.useParams();
  const { data } = useQuery<GetEventQuery, GetEventQueryVariables>(
    Event.query,
    {
      variables: { id },
    }
  );

  useSetHeader({
    title: data?.event?.name || "",
    subtitle: data?.event?.tagline || "",
  });

  return <div className="flex flex-col gap-10 mb-4"></div>;
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

export const Route = createFileRoute("/dashboard/events/$id/")({
  loader: async ({ params: { id } }) => {
    await client.query({
      query: Event.query,
      variables: { id },
    });
  },
  component: Event,
});
