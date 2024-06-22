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
  CountryCode: { input: string; output: string; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: Date; output: Date; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  Email: { input: string; output: string; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: Record<string, any>; output: Record<string, any>; }
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: { input: number; output: number; }
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: { input: number; output: number; }
  /** A string that cannot be passed as an empty value */
  NonEmptyString: { input: string; output: string; }
  /** S3 File URL with presigned URL generation */
  S3File: { input: string; output: string; }
  /** A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones */
  TimeZone: { input: string; output: string; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: number; output: number; }
};

export type AcceptInvitationInput = {
  inviteId: Scalars['ID']['input'];
};

export type AcceptInvitationPayload = {
  __typename?: 'AcceptInvitationPayload';
  success: Scalars['Boolean']['output'];
};

export type Activity = Node & {
  __typename?: 'Activity';
  action: ActivityAction;
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  id: Scalars['ID']['output'];
  meta: Scalars['JSON']['output'];
  object_id: Scalars['String']['output'];
  organization: Organization;
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
  user: User;
};

export enum ActivityAction {
  CanceledEvent = 'CANCELED_EVENT',
  CreatedEvent = 'CREATED_EVENT',
  DeletedEvent = 'DELETED_EVENT',
  InvitedToEvent = 'INVITED_TO_EVENT',
  InvitedToOrganization = 'INVITED_TO_ORGANIZATION',
  JoinedEvent = 'JOINED_EVENT',
  JoinedOrganization = 'JOINED_ORGANIZATION',
  LeftOrganization = 'LEFT_ORGANIZATION',
  UpdatedEvent = 'UPDATED_EVENT',
  UpdatedOrganization = 'UPDATED_ORGANIZATION'
}

export type CreateEventInput = {
  address: Scalars['NonEmptyString']['input'];
  banner_url?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['NonEmptyString']['input'];
  country_code: Scalars['CountryCode']['input'];
  description: Scalars['NonEmptyString']['input'];
  end_date: Scalars['Timestamp']['input'];
  lat?: InputMaybe<Scalars['Latitude']['input']>;
  lng?: InputMaybe<Scalars['Longitude']['input']>;
  logo_url?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['NonEmptyString']['input'];
  orgId: Scalars['ID']['input'];
  plus_code?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  start_date: Scalars['Timestamp']['input'];
  state?: InputMaybe<Scalars['String']['input']>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  timezone: Scalars['TimeZone']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEventPayload = {
  __typename?: 'CreateEventPayload';
  event?: Maybe<Event>;
  success: Scalars['Boolean']['output'];
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

export type Event = Node & {
  __typename?: 'Event';
  address: Scalars['String']['output'];
  banner_url?: Maybe<Scalars['S3File']['output']>;
  city: Scalars['String']['output'];
  country_code: Scalars['CountryCode']['output'];
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  created_by: User;
  created_by_id: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  end_date: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Latitude']['output']>;
  lng?: Maybe<Scalars['Longitude']['output']>;
  logo_url?: Maybe<Scalars['S3File']['output']>;
  name: Scalars['String']['output'];
  organization: Organization;
  organization_id: Scalars['ID']['output'];
  plus_code?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  start_date: Scalars['Date']['output'];
  state?: Maybe<Scalars['String']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['TimeZone']['output'];
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type InviteTeamMemberInput = {
  email: Scalars['String']['input'];
  orgId: Scalars['ID']['input'];
  orgRoleId: Scalars['ID']['input'];
};

export type InviteTeamMemberPayload = {
  __typename?: 'InviteTeamMemberPayload';
  invite?: Maybe<OrgInvite>;
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: AcceptInvitationPayload;
  createEvent: CreateEventPayload;
  createOrganization: CreateOrganizationPayload;
  inviteTeamMember: InviteTeamMemberPayload;
  updateUser: UpdateUserPayload;
};


export type MutationAcceptInvitationArgs = {
  input: AcceptInvitationInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationInviteTeamMemberArgs = {
  input: InviteTeamMemberInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type OrgInvite = Node & {
  __typename?: 'OrgInvite';
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  email: Scalars['Email']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  role: OrgRole;
  status: OrgInviteStatus;
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
  user?: Maybe<User>;
};

export enum OrgInviteStatus {
  Accepted = 'accepted',
  Declined = 'declined',
  Pending = 'pending'
}

export type OrgMembership = Node & {
  __typename?: 'OrgMembership';
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  id: Scalars['ID']['output'];
  organization: Organization;
  role: OrgRole;
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
  user: User;
};

export type OrgRole = Node & {
  __typename?: 'OrgRole';
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
  permissions: Scalars['JSON']['output'];
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
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
  logo_url?: Maybe<Scalars['S3File']['output']>;
  name: Scalars['String']['output'];
  owner: User;
  owner_id: Scalars['ID']['output'];
  plus_code?: Maybe<Scalars['String']['output']>;
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
  event?: Maybe<Event>;
  eventActivities: QueryEventActivitiesConnection;
  me?: Maybe<User>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  orgActivities: QueryOrgActivitiesConnection;
  orgAllRoles: Array<OrgRole>;
  orgEvents: QueryOrgEventsConnection;
  orgInvite?: Maybe<OrgInvite>;
  orgMembers: QueryOrgMembersConnection;
  orgRoles: QueryOrgRolesConnection;
  orgTeamInvites?: Maybe<QueryOrgTeamInvitesConnection>;
  organization?: Maybe<Organization>;
  userOrgInvites?: Maybe<QueryUserOrgInvitesConnection>;
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventActivitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryOrgActivitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
};


export type QueryOrgAllRolesArgs = {
  orgId: Scalars['ID']['input'];
};


export type QueryOrgEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
};


export type QueryOrgInviteArgs = {
  id: Scalars['ID']['input'];
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


export type QueryOrgTeamInvitesArgs = {
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


export type QueryUserOrgInvitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
};

export type QueryEventActivitiesConnection = {
  __typename?: 'QueryEventActivitiesConnection';
  edges: Array<Maybe<QueryEventActivitiesConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryEventActivitiesConnectionEdge = {
  __typename?: 'QueryEventActivitiesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Activity;
};

export type QueryOrgActivitiesConnection = {
  __typename?: 'QueryOrgActivitiesConnection';
  edges: Array<Maybe<QueryOrgActivitiesConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryOrgActivitiesConnectionEdge = {
  __typename?: 'QueryOrgActivitiesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Activity;
};

export type QueryOrgEventsConnection = {
  __typename?: 'QueryOrgEventsConnection';
  edges: Array<Maybe<QueryOrgEventsConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryOrgEventsConnectionEdge = {
  __typename?: 'QueryOrgEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
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
  node: OrgMembership;
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
  node: OrgRole;
};

export type QueryOrgTeamInvitesConnection = {
  __typename?: 'QueryOrgTeamInvitesConnection';
  edges: Array<Maybe<QueryOrgTeamInvitesConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryOrgTeamInvitesConnectionEdge = {
  __typename?: 'QueryOrgTeamInvitesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: OrgInvite;
};

export type QueryUserOrgInvitesConnection = {
  __typename?: 'QueryUserOrgInvitesConnection';
  edges: Array<Maybe<QueryUserOrgInvitesConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryUserOrgInvitesConnectionEdge = {
  __typename?: 'QueryUserOrgInvitesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: OrgInvite;
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
  avatar_url?: Maybe<Scalars['S3File']['output']>;
  created_at?: Maybe<Scalars['Timestamp']['output']>;
  email: Scalars['Email']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  full_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  orgInvites?: Maybe<Array<OrgInvite>>;
  orgMemberships: Array<OrgMembership>;
  profile_completed: Scalars['Boolean']['output'];
  updated_at?: Maybe<Scalars['Timestamp']['output']>;
};

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, first_name?: string | null, last_name?: string | null, avatar_url?: string | null, created_at?: number | null, orgMemberships: Array<{ __typename?: 'OrgMembership', id: string, role: { __typename?: 'OrgRole', id: string, name: string, permissions: Record<string, any> }, organization: { __typename?: 'Organization', id: string, name: string, owner_id: string, website?: string | null, logo_url?: string | null, address: string, city: string, state?: string | null, country_code: string, postal_code?: string | null, timezone: string, lat?: number | null, lng?: number | null } }> } | null };

export type GetEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, name: string, tagline?: string | null, banner_url?: string | null, logo_url?: string | null, updated_at?: number | null } | null };

export type GetEventDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEventDetailsQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, name: string, tagline?: string | null, description?: string | null, banner_url?: string | null, logo_url?: string | null, updated_at?: number | null, start_date: Date, end_date: Date, timezone: string, address: string, city: string, created_at?: number | null, created_by: { __typename?: 'User', id: string, full_name: string, avatar_url?: string | null } } | null };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CreateEventPayload', success: boolean, event?: { __typename?: 'Event', id: string } | null } };

export type GetOrgEventsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
}>;


export type GetOrgEventsQuery = { __typename?: 'Query', orgEvents: { __typename?: 'QueryOrgEventsConnection', totalCount: number, edges: Array<{ __typename?: 'QueryOrgEventsConnectionEdge', node: (
        { __typename?: 'Event' }
        & { ' $fragmentRefs'?: { 'GetEvents_EventsFragment': GetEvents_EventsFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetEvents_EventsFragment = { __typename?: 'Event', id: string, name: string, tagline?: string | null, banner_url?: string | null, logo_url?: string | null, start_date: Date, end_date: Date, address: string, city: string, timezone: string } & { ' $fragmentName'?: 'GetEvents_EventsFragment' };

export type GetOrgRolesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
}>;


export type GetOrgRolesQuery = { __typename?: 'Query', orgRoles: { __typename?: 'QueryOrgRolesConnection', totalCount: number, edges: Array<{ __typename?: 'QueryOrgRolesConnectionEdge', node: (
        { __typename?: 'OrgRole' }
        & { ' $fragmentRefs'?: { 'GetOrgRoles_RolesFragment': GetOrgRoles_RolesFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetOrgRoles_RolesFragment = { __typename?: 'OrgRole', id: string, name: string, permissions: Record<string, any>, updated_at?: number | null } & { ' $fragmentName'?: 'GetOrgRoles_RolesFragment' };

export type InviteTeamMemberForm_RolesFragment = { __typename?: 'OrgRole', id: string, name: string } & { ' $fragmentName'?: 'InviteTeamMemberForm_RolesFragment' };

export type InviteTeamMemberForm_InviteTeamMemberMutationVariables = Exact<{
  input: InviteTeamMemberInput;
}>;


export type InviteTeamMemberForm_InviteTeamMemberMutation = { __typename?: 'Mutation', inviteTeamMember: { __typename?: 'InviteTeamMemberPayload', invite?: { __typename?: 'OrgInvite', id: string } | null } };

export type GetOrgInvitesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
}>;


export type GetOrgInvitesQuery = { __typename?: 'Query', orgTeamInvites?: { __typename?: 'QueryOrgTeamInvitesConnection', totalCount: number, edges: Array<{ __typename?: 'QueryOrgTeamInvitesConnectionEdge', node: (
        { __typename?: 'OrgInvite' }
        & { ' $fragmentRefs'?: { 'GetOrgInvites_InvitesFragment': GetOrgInvites_InvitesFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } | null };

export type GetOrgInvites_InvitesFragment = { __typename?: 'OrgInvite', id: string, email: string, status: OrgInviteStatus, created_at?: number | null, updated_at?: number | null, role: { __typename?: 'OrgRole', id: string, name: string, permissions: Record<string, any> } } & { ' $fragmentName'?: 'GetOrgInvites_InvitesFragment' };

export type GetOrgMembersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orgId: Scalars['ID']['input'];
}>;


export type GetOrgMembersQuery = { __typename?: 'Query', orgMembers: { __typename?: 'QueryOrgMembersConnection', totalCount: number, edges: Array<{ __typename?: 'QueryOrgMembersConnectionEdge', node: (
        { __typename?: 'OrgMembership' }
        & { ' $fragmentRefs'?: { 'GetOrgMembers_MembersFragment': GetOrgMembers_MembersFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetOrgMembers_MembersFragment = { __typename?: 'OrgMembership', id: string, updated_at?: number | null, user: { __typename?: 'User', id: string, email: string, full_name: string, avatar_url?: string | null }, role: { __typename?: 'OrgRole', id: string, name: string, permissions: Record<string, any> } } & { ' $fragmentName'?: 'GetOrgMembers_MembersFragment' };

export type TeamTabQueryQueryVariables = Exact<{
  orgId: Scalars['ID']['input'];
}>;


export type TeamTabQueryQuery = { __typename?: 'Query', orgAllRoles: Array<(
    { __typename?: 'OrgRole' }
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

export type GetOrgInviteQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrgInviteQuery = { __typename?: 'Query', orgInvite?: { __typename?: 'OrgInvite', id: string, email: string, organization: { __typename?: 'Organization', id: string, name: string, logo_url?: string | null }, user?: { __typename?: 'User', id: string, email: string, profile_completed: boolean } | null } | null };

export type AcceptInvitationMutationVariables = Exact<{
  input: AcceptInvitationInput;
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename?: 'AcceptInvitationPayload', success: boolean } };

export type UpdateInviteUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateInviteUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserPayload', success: boolean } };

export const GetEvents_EventsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetEvents_Events"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"banner_url"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}}]} as unknown as DocumentNode<GetEvents_EventsFragment, unknown>;
export const GetOrgRoles_RolesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgRoles_Roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgRoles_RolesFragment, unknown>;
export const InviteTeamMemberForm_RolesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InviteTeamMemberForm_roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<InviteTeamMemberForm_RolesFragment, unknown>;
export const GetOrgInvites_InvitesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgInvites_Invites"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgInvite"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgInvites_InvitesFragment, unknown>;
export const GetOrgMembers_MembersFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgMembers_Members"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgMembership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgMembers_MembersFragment, unknown>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"orgMemberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country_code"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"banner_url"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;
export const GetEventDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"banner_url"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetEventDetailsQuery, GetEventDetailsQueryVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const GetOrgEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GetEvents_Events"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetEvents_Events"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"banner_url"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}}]} as unknown as DocumentNode<GetOrgEventsQuery, GetOrgEventsQueryVariables>;
export const GetOrgRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GetOrgRoles_Roles"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgRoles_Roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgRolesQuery, GetOrgRolesQueryVariables>;
export const InviteTeamMemberForm_InviteTeamMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteTeamMemberForm_inviteTeamMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteTeamMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteTeamMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<InviteTeamMemberForm_InviteTeamMemberMutation, InviteTeamMemberForm_InviteTeamMemberMutationVariables>;
export const GetOrgInvitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgInvites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgTeamInvites"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GetOrgInvites_Invites"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgInvites_Invites"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgInvite"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgInvitesQuery, GetOrgInvitesQueryVariables>;
export const GetOrgMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GetOrgMembers_Members"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GetOrgMembers_Members"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgMembership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetOrgMembersQuery, GetOrgMembersQueryVariables>;
export const TeamTabQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamTabQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgAllRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InviteTeamMemberForm_roles"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InviteTeamMemberForm_roles"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrgRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<TeamTabQueryQuery, TeamTabQueryQueryVariables>;
export const CreateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetOrgInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profile_completed"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgInviteQuery, GetOrgInviteQueryVariables>;
export const AcceptInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const UpdateInviteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInviteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateInviteUserMutation, UpdateInviteUserMutationVariables>;