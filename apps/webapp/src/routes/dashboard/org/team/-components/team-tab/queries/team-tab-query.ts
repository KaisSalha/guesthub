import { graphql } from "gql.tada";
import { InviteTeamMemberForm } from "../invite-team-member-form";

export const main = graphql(
  `
    query TeamTabQuery($orgId: ID!) {
      orgAllRoles(orgId: $orgId) {
        ...InviteTeamMemberForm_roles
      }
    }
  `,
  [InviteTeamMemberForm.fragments.roles]
);
