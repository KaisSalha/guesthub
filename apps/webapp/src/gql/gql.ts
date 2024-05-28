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
    "\n  query GetMe {\n    me {\n      id\n      email\n      first_name\n      last_name\n      avatar_url\n      type\n      created_at\n      memberships {\n        id\n        role {\n          id\n          name\n          permissions\n        }\n        organization {\n          id\n          name\n          owner_id\n          owner {\n            id\n            email\n            first_name\n            last_name\n            avatar_url\n          }\n          website\n          logo_url\n          address\n          city\n          state\n          country_code\n          postal_code\n          timezone\n          lat\n          lng\n        }\n      }\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgRoles(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgRoles_Roles\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgRoles_Roles on Role {\n    id\n    name\n    permissions\n    updated_at\n  }\n": types.GetOrgRolesDocument,
    "\n    fragment InviteTeamMemberForm_roles on Role {\n      id\n      name\n    }\n  ": types.InviteTeamMemberForm_RolesFragmentDoc,
    "\n  query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgMembers(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgMembers_Members\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgMembers_Members on Membership {\n    id\n    user {\n      id\n      full_name\n      avatar_url\n      type\n    }\n    role {\n      id\n      name\n      permissions\n    }\n    updated_at\n  }\n": types.GetOrgMembersDocument,
    "\n    query TeamTabQuery($orgId: ID!) {\n      orgAllRoles(orgId: $orgId) {\n        ...InviteTeamMemberForm_roles\n      }\n    }\n  ": types.TeamTabQueryDocument,
    "\n    mutation CreateOrganization($input: CreateOrganizationInput!) {\n      createOrganization(input: $input) {\n        success\n      }\n    }\n  ": types.CreateOrganizationDocument,
    "\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        success\n      }\n    }\n  ": types.UpdateUserDocument,
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
export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      email\n      first_name\n      last_name\n      avatar_url\n      type\n      created_at\n      memberships {\n        id\n        role {\n          id\n          name\n          permissions\n        }\n        organization {\n          id\n          name\n          owner_id\n          owner {\n            id\n            email\n            first_name\n            last_name\n            avatar_url\n          }\n          website\n          logo_url\n          address\n          city\n          state\n          country_code\n          postal_code\n          timezone\n          lat\n          lng\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      email\n      first_name\n      last_name\n      avatar_url\n      type\n      created_at\n      memberships {\n        id\n        role {\n          id\n          name\n          permissions\n        }\n        organization {\n          id\n          name\n          owner_id\n          owner {\n            id\n            email\n            first_name\n            last_name\n            avatar_url\n          }\n          website\n          logo_url\n          address\n          city\n          state\n          country_code\n          postal_code\n          timezone\n          lat\n          lng\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgRoles(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgRoles_Roles\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgRoles_Roles on Role {\n    id\n    name\n    permissions\n    updated_at\n  }\n"): (typeof documents)["\n  query GetOrgRoles($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgRoles(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgRoles_Roles\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgRoles_Roles on Role {\n    id\n    name\n    permissions\n    updated_at\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment InviteTeamMemberForm_roles on Role {\n      id\n      name\n    }\n  "): (typeof documents)["\n    fragment InviteTeamMemberForm_roles on Role {\n      id\n      name\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgMembers(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgMembers_Members\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgMembers_Members on Membership {\n    id\n    user {\n      id\n      full_name\n      avatar_url\n      type\n    }\n    role {\n      id\n      name\n      permissions\n    }\n    updated_at\n  }\n"): (typeof documents)["\n  query GetOrgMembers($first: Int!, $offset: Int!, $orgId: ID!) {\n    orgMembers(first: $first, offset: $offset, orgId: $orgId) {\n      totalCount\n      edges {\n        node {\n          ...GetOrgMembers_Members\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  fragment GetOrgMembers_Members on Membership {\n    id\n    user {\n      id\n      full_name\n      avatar_url\n      type\n    }\n    role {\n      id\n      name\n      permissions\n    }\n    updated_at\n  }\n"];
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

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;