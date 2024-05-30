import { graphql } from "gql.tada";

export const orgInvites = graphql(/* GraphQL */ `
  query GetOrgInvites($first: Int!, $offset: Int!, $orgId: ID!) {
    orgInvites(first: $first, offset: $offset, orgId: $orgId) {
      totalCount
      edges {
        node {
          ...GetOrgInvites_Invites
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

  fragment GetOrgInvites_Invites on Invite {
    id
    email
    status
    role {
      id
      name
      permissions
    }
    created_at
    updated_at
  }
`);
