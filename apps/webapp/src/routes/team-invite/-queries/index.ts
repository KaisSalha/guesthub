import { graphql } from "gql.tada";

export const GetOrgInvite = graphql(`
  query GetOrgInvite($id: ID!) {
    orgInvite(id: $id) {
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
