import { createFileRoute } from "@tanstack/react-router";
import { graphql } from "gql.tada";
import { client } from "@/lib/apollo-client";

const Event = () => {
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
