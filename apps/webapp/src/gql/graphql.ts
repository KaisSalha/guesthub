/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A country code as defined by ISO 3166-1 alpha-2 */
  CountryCode: { input: any; output: any; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  Email: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: { input: any; output: any; }
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: { input: any; output: any; }
  /** A string that cannot be passed as an empty value */
  NonEmptyString: { input: any; output: any; }
  /** A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones */
  TimeZone: { input: any; output: any; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any; }
};

export type CreateOrganizationInput = {
  address: Scalars['NonEmptyString']['input'];
  city: Scalars['NonEmptyString']['input'];
  country_code: Scalars['CountryCode']['input'];
  lat?: InputMaybe<Scalars['Latitude']['input']>;
  lng?: InputMaybe<Scalars['Longitude']['input']>;
  logo_url?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['NonEmptyString']['input'];
  postal_code?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  timezone: Scalars['TimeZone']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrganizationPayload = {
  __typename?: 'CreateOrganizationPayload';
  organization?: Maybe<Organization>;
  success: Scalars['Boolean']['output'];
};

export type Membership = Node & {
  __typename?: 'Membership';
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  id: Scalars['ID']['output'];
  organization: Organization;
  role: Role;
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrganization: CreateOrganizationPayload;
  updateUser: UpdateUserPayload;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type Organization = Node & {
  __typename?: 'Organization';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country_code: Scalars['CountryCode']['output'];
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Latitude']['output']>;
  lng?: Maybe<Scalars['Longitude']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner: User;
  owner_id: Scalars['ID']['output'];
  postal_code?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['TimeZone']['output'];
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  orgAllRoles: Array<Role>;
  orgMembers: QueryOrgMembersConnection;
  orgRoles: QueryOrgRolesConnection;
  organization?: Maybe<Organization>;
  user?: Maybe<User>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryOrgAllRolesArgs = {
  orgId: Scalars['ID']['input'];
};


export type QueryOrgMembersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
};


export type QueryOrgRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryOrgMembersConnection = {
  __typename?: 'QueryOrgMembersConnection';
  edges: Array<Maybe<QueryOrgMembersConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryOrgMembersConnectionEdge = {
  __typename?: 'QueryOrgMembersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Membership;
};

export type QueryOrgRolesConnection = {
  __typename?: 'QueryOrgRolesConnection';
  edges: Array<Maybe<QueryOrgRolesConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryOrgRolesConnectionEdge = {
  __typename?: 'QueryOrgRolesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Role;
};

export type Role = Node & {
  __typename?: 'Role';
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
  permissions: Scalars['JSON']['output'];
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
};

export type UpdateUserInput = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type User = Node & {
  __typename?: 'User';
  avatar_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  email: Scalars['Email']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  full_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  memberships: Array<Membership>;
  type: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
};

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: any, first_name?: string | null, last_name?: string | null, avatar_url?: string | null, type: string, created_at?: any | null, memberships: Array<{ __typename?: 'Membership', id: string, role: { __typename?: 'Role', id: string, name: string, permissions: any }, organization: { __typename?: 'Organization', id: string, name: string, owner_id: string, website?: string | null, logo_url?: string | null, address: string, city: string, state?: string | null, country_code: any, postal_code?: string | null, timezone: any, lat?: any | null, lng?: any | null, owner: { __typename?: 'User', id: string, email: any, first_name?: string | null, last_name?: string | null, avatar_url?: string | null } } }> } | null };

export type GetOrgRolesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
}>;


export type GetOrgRolesQuery = { __typename?: 'Query', orgRoles: { __typename?: 'QueryOrgRolesConnection', totalCount: number, edges: Array<{ __typename?: 'QueryOrgRolesConnectionEdge', node: (
        { __typename?: 'Role' }
        & { ' $fragmentRefs'?: { 'GetOrgRoles_RolesFragment': GetOrgRoles_RolesFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetOrgRoles_RolesFragment = { __typename?: 'Role', id: string, name: string, permissions: any, updated_at?: any | null } & { ' $fragmentName'?: 'GetOrgRoles_RolesFragment' };

export type InviteTeamMemberForm_RolesFragment = { __typename?: 'Role', id: string, name: string } & { ' $fragmentName'?: 'InviteTeamMemberForm_RolesFragment' };

export type GetOrgMembersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
}>;


export type GetOrgMembersQuery = { __typename?: 'Query', orgMembers: { __typename?: 'QueryOrgMembersConnection', totalCount: number, edges: Array<{ __typename?: 'QueryOrgMembersConnectionEdge', node: (
        { __typename?: 'Membership' }
        & { ' $fragmentRefs'?: { 'GetOrgMembers_MembersFragment': GetOrgMembers_MembersFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetOrgMembers_MembersFragment = { __typename?: 'Membership', id: string, updated_at?: any | null, user: { __typename?: 'User', id: string, full_name: string, avatar_url?: string | null, type: string }, role: { __typename?: 'Role', id: string, name: string, permissions: any } } & { ' $fragmentName'?: 'GetOrgMembers_MembersFragment' };

export type TeamTabQueryQueryVariables = Exact<{
  orgId: Scalars['ID']['input'];
}>;


export type TeamTabQueryQuery = { __typename?: 'Query', orgAllRoles: Array<(
    { __typename?: 'Role' }
    & { ' $fragmentRefs'?: { 'InviteTeamMemberForm_RolesFragment': InviteTeamMemberForm_RolesFragment } }
  )> };

export type CreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'CreateOrganizationPayload', success: boolean } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserPayload', success: boolean } };

export const GetOrgRoles_RolesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgRoles_Roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgRoles_RolesFragment, unknown>;
export const InviteTeamMemberForm_RolesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InviteTeamMemberForm_roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<InviteTeamMemberForm_RolesFragment, unknown>;
export const GetOrgMembers_MembersFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgMembers_Members"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Membership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgMembers_MembersFragment, unknown>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country_code"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetOrgRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GetOrgRoles_Roles"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgRoles_Roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgRolesQuery, GetOrgRolesQueryVariables>;
export const GetOrgMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GetOrgMembers_Members"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgMembers_Members"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Membership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgMembersQuery, GetOrgMembersQueryVariables>;
export const TeamTabQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamTabQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgAllRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InviteTeamMemberForm_roles"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InviteTeamMemberForm_roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<TeamTabQueryQuery, TeamTabQueryQueryVariables>;
export const CreateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;