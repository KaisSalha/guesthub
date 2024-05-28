import { graphql } from "gql.tada";

export const orgMembers = graphql(/* GraphQL */ `
  query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {
    orgMembers(first: $first, offset: $offset, orgId: $orgId) {
      totalCount
      edges {
        node {
          ...GetOrgMembers_Members
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

  fragment GetOrgMembers_Members on Membership {
    id
    user {
      id
      full_name
      avatar_url
      type
    }
    role {
      id
      name
      permissions
    }
    updated_at
  }
`);
