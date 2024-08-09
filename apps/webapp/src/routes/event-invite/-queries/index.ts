import { graphql } from "gql.tada";

export const GetEventAttendance = graphql(`
  query GetEventAttendance($id: ID!) {
    eventAttendance(id: $id) {
      id
      email
      event {
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
