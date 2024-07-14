/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetMe {\n    me {\n      id\n      email\n      first_name\n      last_name\n      avatar_url\n      created_at\n      orgMemberships {\n        id\n        role {\n          id\n          name\n          permissions\n        }\n        organization {\n          id\n          name\n          owner_id\n          website\n          logo_url\n          address\n          city\n          state\n          country_code\n          postal_code\n          timezone\n          lat\n          lng\n        }\n      }\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      id\n      name\n      tagline\n      banner_url\n      logo_url\n      updated_at\n    }\n  }\n": types.GetEventDocument,
    "\n    query OrgMembersSelectQuery($orgId: ID!) {\n      allOrgMembers(orgId: $orgId) {\n        id\n        user {\n          id\n          full_name\n          email\n        }\n      }\n    }\n  ": types.OrgMembersSelectQueryDocument,
    "\n  mutation inviteEventAttendance($input: InviteEventAttendanceInput!) {\n    inviteEventAttendance(input: $input) {\n      eventAttendance {\n        id\n      }\n    }\n  }\n": types.InviteEventAttendanceDocument,
    "\n  query GetEventAttendanceList($first: Int!, $offset: Int!, $eventId: ID!) {\n    eventAttendanceList(first: $first, offset: $offset, eventId: $eventId) {\n      totalCount\n      edges {\n        node {\n          ...GetEventAttendanceList_Attendees\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetEventAttendanceList_Attendees on EventAttendance {\n    id\n    email\n    attendance_type\n    status\n    travel_required\n    accommodation_required\n    created_at\n    updated_at\n  }\n": types.GetEventAttendanceListDocument,
    "\n  query GetEventDetails($id: ID!) {\n    event(id: $id) {\n      id\n      name\n      tagline\n      description\n      banner_url\n      logo_url\n      updated_at\n      start_date\n      end_date\n      timezone\n      address\n      city\n      created_by {\n        id\n        full_name\n        avatar_url\n      }\n      created_at\n    }\n  }\n": types.GetEventDetailsDocument,
    "\n  query GetOrgEvents($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgEvents(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetEvents_Events\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetEvents_Events on Event {\n    id\n    name\n    tagline\n    banner_url\n    logo_url\n    start_date\n    end_date\n    address\n    city\n    timezone\n  }\n": types.GetOrgEventsDocument,
    "\n    mutation CreateEvent($input: CreateEventInput!) {\n      createEvent(input: $input) {\n        success\n        event {\n          id\n        }\n      }\n    }\n  ": types.CreateEventDocument,
    "\n  query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgRoles(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgRoles_Roles\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgRoles_Roles on OrgRole {\n    id\n    name\n    permissions\n    updated_at\n  }\n": types.GetOrgRolesDocument,
    "\n    fragment InviteTeamMemberForm_roles on OrgRole {\n      id\n      name\n    }\n  ": types.InviteTeamMemberForm_RolesFragmentDoc,
    "\n  mutation InviteTeamMemberForm_inviteTeamMember(\n    $input: InviteTeamMemberInput!\n  ) {\n    inviteTeamMember(input: $input) {\n      invite {\n        id\n      }\n    }\n  }\n": types.InviteTeamMemberForm_InviteTeamMemberDocument,
    "\n  query GetOrgInvites($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgTeamInvites(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgInvites_Invites\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgInvites_Invites on OrgInvite {\n    id\n    email\n    status\n    role {\n      id\n      name\n      permissions\n    }\n    created_at\n    updated_at\n  }\n": types.GetOrgInvitesDocument,
    "\n  query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgMembers(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgMembers_Members\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgMembers_Members on OrgMembership {\n    id\n    user {\n      id\n      email\n      full_name\n      avatar_url\n    }\n    role {\n      id\n      name\n      permissions\n    }\n    updated_at\n  }\n": types.GetOrgMembersDocument,
    "\n    query TeamTabQuery($orgId: ID!) {\n      orgAllRoles(orgId: $orgId) {\n        ...InviteTeamMemberForm_roles\n      }\n    }\n  ": types.TeamTabQueryDocument,
    "\n    mutation CreateOrganization($input: CreateOrganizationInput!) {\n      createOrganization(input: $input) {\n        success\n      }\n    }\n  ": types.CreateOrganizationDocument,
    "\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        success\n      }\n    }\n  ": types.UpdateUserDocument,
    "\n  query GetOrgInvite($id: ID!) {\n    orgInvite(id: $id) {\n      id\n      email\n      organization {\n        id\n        name\n        logo_url\n      }\n      user {\n        id\n        email\n        profile_completed\n      }\n    }\n  }\n": types.GetOrgInviteDocument,
    "\n  mutation AcceptInvitation($input: AcceptInvitationInput!) {\n    acceptInvitation(input: $input) {\n      success\n    }\n  }\n": types.AcceptInvitationDocument,
    "\n    mutation UpdateInviteUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        success\n      }\n    }\n  ": types.UpdateInviteUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      email\n      first_name\n      last_name\n      avatar_url\n      created_at\n      orgMemberships {\n        id\n        role {\n          id\n          name\n          permissions\n        }\n        organization {\n          id\n          name\n          owner_id\n          website\n          logo_url\n          address\n          city\n          state\n          country_code\n          postal_code\n          timezone\n          lat\n          lng\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      email\n      first_name\n      last_name\n      avatar_url\n      created_at\n      orgMemberships {\n        id\n        role {\n          id\n          name\n          permissions\n        }\n        organization {\n          id\n          name\n          owner_id\n          website\n          logo_url\n          address\n          city\n          state\n          country_code\n          postal_code\n          timezone\n          lat\n          lng\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      id\n      name\n      tagline\n      banner_url\n      logo_url\n      updated_at\n    }\n  }\n"): (typeof documents)["\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      id\n      name\n      tagline\n      banner_url\n      logo_url\n      updated_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query OrgMembersSelectQuery($orgId: ID!) {\n      allOrgMembers(orgId: $orgId) {\n        id\n        user {\n          id\n          full_name\n          email\n        }\n      }\n    }\n  "): (typeof documents)["\n    query OrgMembersSelectQuery($orgId: ID!) {\n      allOrgMembers(orgId: $orgId) {\n        id\n        user {\n          id\n          full_name\n          email\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation inviteEventAttendance($input: InviteEventAttendanceInput!) {\n    inviteEventAttendance(input: $input) {\n      eventAttendance {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation inviteEventAttendance($input: InviteEventAttendanceInput!) {\n    inviteEventAttendance(input: $input) {\n      eventAttendance {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEventAttendanceList($first: Int!, $offset: Int!, $eventId: ID!) {\n    eventAttendanceList(first: $first, offset: $offset, eventId: $eventId) {\n      totalCount\n      edges {\n        node {\n          ...GetEventAttendanceList_Attendees\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetEventAttendanceList_Attendees on EventAttendance {\n    id\n    email\n    attendance_type\n    status\n    travel_required\n    accommodation_required\n    created_at\n    updated_at\n  }\n"): (typeof documents)["\n  query GetEventAttendanceList($first: Int!, $offset: Int!, $eventId: ID!) {\n    eventAttendanceList(first: $first, offset: $offset, eventId: $eventId) {\n      totalCount\n      edges {\n        node {\n          ...GetEventAttendanceList_Attendees\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetEventAttendanceList_Attendees on EventAttendance {\n    id\n    email\n    attendance_type\n    status\n    travel_required\n    accommodation_required\n    created_at\n    updated_at\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEventDetails($id: ID!) {\n    event(id: $id) {\n      id\n      name\n      tagline\n      description\n      banner_url\n      logo_url\n      updated_at\n      start_date\n      end_date\n      timezone\n      address\n      city\n      created_by {\n        id\n        full_name\n        avatar_url\n      }\n      created_at\n    }\n  }\n"): (typeof documents)["\n  query GetEventDetails($id: ID!) {\n    event(id: $id) {\n      id\n      name\n      tagline\n      description\n      banner_url\n      logo_url\n      updated_at\n      start_date\n      end_date\n      timezone\n      address\n      city\n      created_by {\n        id\n        full_name\n        avatar_url\n      }\n      created_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrgEvents($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgEvents(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetEvents_Events\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetEvents_Events on Event {\n    id\n    name\n    tagline\n    banner_url\n    logo_url\n    start_date\n    end_date\n    address\n    city\n    timezone\n  }\n"): (typeof documents)["\n  query GetOrgEvents($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgEvents(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetEvents_Events\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetEvents_Events on Event {\n    id\n    name\n    tagline\n    banner_url\n    logo_url\n    start_date\n    end_date\n    address\n    city\n    timezone\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateEvent($input: CreateEventInput!) {\n      createEvent(input: $input) {\n        success\n        event {\n          id\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation CreateEvent($input: CreateEventInput!) {\n      createEvent(input: $input) {\n        success\n        event {\n          id\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgRoles(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgRoles_Roles\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgRoles_Roles on OrgRole {\n    id\n    name\n    permissions\n    updated_at\n  }\n"): (typeof documents)["\n  query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgRoles(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgRoles_Roles\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgRoles_Roles on OrgRole {\n    id\n    name\n    permissions\n    updated_at\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment InviteTeamMemberForm_roles on OrgRole {\n      id\n      name\n    }\n  "): (typeof documents)["\n    fragment InviteTeamMemberForm_roles on OrgRole {\n      id\n      name\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InviteTeamMemberForm_inviteTeamMember(\n    $input: InviteTeamMemberInput!\n  ) {\n    inviteTeamMember(input: $input) {\n      invite {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation InviteTeamMemberForm_inviteTeamMember(\n    $input: InviteTeamMemberInput!\n  ) {\n    inviteTeamMember(input: $input) {\n      invite {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrgInvites($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgTeamInvites(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgInvites_Invites\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgInvites_Invites on OrgInvite {\n    id\n    email\n    status\n    role {\n      id\n      name\n      permissions\n    }\n    created_at\n    updated_at\n  }\n"): (typeof documents)["\n  query GetOrgInvites($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgTeamInvites(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgInvites_Invites\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgInvites_Invites on OrgInvite {\n    id\n    email\n    status\n    role {\n      id\n      name\n      permissions\n    }\n    created_at\n    updated_at\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgMembers(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgMembers_Members\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgMembers_Members on OrgMembership {\n    id\n    user {\n      id\n      email\n      full_name\n      avatar_url\n    }\n    role {\n      id\n      name\n      permissions\n    }\n    updated_at\n  }\n"): (typeof documents)["\n  query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgMembers(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgMembers_Members\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgMembers_Members on OrgMembership {\n    id\n    user {\n      id\n      email\n      full_name\n      avatar_url\n    }\n    role {\n      id\n      name\n      permissions\n    }\n    updated_at\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TeamTabQuery($orgId: ID!) {\n      orgAllRoles(orgId: $orgId) {\n        ...InviteTeamMemberForm_roles\n      }\n    }\n  "): (typeof documents)["\n    query TeamTabQuery($orgId: ID!) {\n      orgAllRoles(orgId: $orgId) {\n        ...InviteTeamMemberForm_roles\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateOrganization($input: CreateOrganizationInput!) {\n      createOrganization(input: $input) {\n        success\n      }\n    }\n  "): (typeof documents)["\n    mutation CreateOrganization($input: CreateOrganizationInput!) {\n      createOrganization(input: $input) {\n        success\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        success\n      }\n    }\n  "): (typeof documents)["\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        success\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrgInvite($id: ID!) {\n    orgInvite(id: $id) {\n      id\n      email\n      organization {\n        id\n        name\n        logo_url\n      }\n      user {\n        id\n        email\n        profile_completed\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOrgInvite($id: ID!) {\n    orgInvite(id: $id) {\n      id\n      email\n      organization {\n        id\n        name\n        logo_url\n      }\n      user {\n        id\n        email\n        profile_completed\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptInvitation($input: AcceptInvitationInput!) {\n    acceptInvitation(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation AcceptInvitation($input: AcceptInvitationInput!) {\n    acceptInvitation(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateInviteUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        success\n      }\n    }\n  "): (typeof documents)["\n    mutation UpdateInviteUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        success\n      }\n    }\n  "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;