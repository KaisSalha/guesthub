import { graphql } from "gql.tada";

export const GetInvite = graphql(`
  query GetInvite($id: ID!) {
    invite(id: $id) {
      id
      email
      organization {
        id
        name
        logo_url
      }
      user {
        id
        email
        profile_completed
      }
    }
  }
`);
