/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as IndexImport } from './routes/index'
import { Route as TeamInviteIndexImport } from './routes/team-invite/index'
import { Route as SignupIndexImport } from './routes/signup/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as TeamInviteSignupIndexImport } from './routes/team-invite/signup/index'
import { Route as TeamInviteGetStartedIndexImport } from './routes/team-invite/get-started/index'
import { Route as TeamInviteAcceptIndexImport } from './routes/team-invite/accept/index'
import { Route as SignupProfileIndexImport } from './routes/signup/profile/index'
import { Route as SignupOrganizationIndexImport } from './routes/signup/organization/index'
import { Route as DashboardTeamIndexImport } from './routes/dashboard/team/index'
import { Route as DashboardRequestsIndexImport } from './routes/dashboard/requests/index'
import { Route as DashboardReportsIndexImport } from './routes/dashboard/reports/index'
import { Route as DashboardHelpIndexImport } from './routes/dashboard/help/index'
import { Route as DashboardGuestsIndexImport } from './routes/dashboard/guests/index'
import { Route as DashboardEventsIndexImport } from './routes/dashboard/events/index'
import { Route as DashboardCalendarIndexImport } from './routes/dashboard/calendar/index'
import { Route as DashboardAccountIndexImport } from './routes/dashboard/account/index'
import { Route as TeamInviteSignupProfileIndexImport } from './routes/team-invite/signup/profile/index'

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TeamInviteIndexRoute = TeamInviteIndexImport.update({
  path: '/team-invite/',
  getParentRoute: () => rootRoute,
} as any)

const SignupIndexRoute = SignupIndexImport.update({
  path: '/signup/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)

const TeamInviteSignupIndexRoute = TeamInviteSignupIndexImport.update({
  path: '/team-invite/signup/',
  getParentRoute: () => rootRoute,
} as any)

const TeamInviteGetStartedIndexRoute = TeamInviteGetStartedIndexImport.update({
  path: '/team-invite/get-started/',
  getParentRoute: () => rootRoute,
} as any)

const TeamInviteAcceptIndexRoute = TeamInviteAcceptIndexImport.update({
  path: '/team-invite/accept/',
  getParentRoute: () => rootRoute,
} as any)

const SignupProfileIndexRoute = SignupProfileIndexImport.update({
  path: '/signup/profile/',
  getParentRoute: () => rootRoute,
} as any)

const SignupOrganizationIndexRoute = SignupOrganizationIndexImport.update({
  path: '/signup/organization/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardTeamIndexRoute = DashboardTeamIndexImport.update({
  path: '/team/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardRequestsIndexRoute = DashboardRequestsIndexImport.update({
  path: '/requests/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardReportsIndexRoute = DashboardReportsIndexImport.update({
  path: '/reports/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardHelpIndexRoute = DashboardHelpIndexImport.update({
  path: '/help/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardGuestsIndexRoute = DashboardGuestsIndexImport.update({
  path: '/guests/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardEventsIndexRoute = DashboardEventsIndexImport.update({
  path: '/events/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardCalendarIndexRoute = DashboardCalendarIndexImport.update({
  path: '/calendar/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardAccountIndexRoute = DashboardAccountIndexImport.update({
  path: '/account/',
  getParentRoute: () => DashboardRoute,
} as any)

const TeamInviteSignupProfileIndexRoute =
  TeamInviteSignupProfileIndexImport.update({
    path: '/team-invite/signup/profile/',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardImport
    }
    '/login/': {
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/signup/': {
      preLoaderRoute: typeof SignupIndexImport
      parentRoute: typeof rootRoute
    }
    '/team-invite/': {
      preLoaderRoute: typeof TeamInviteIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/account/': {
      preLoaderRoute: typeof DashboardAccountIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/calendar/': {
      preLoaderRoute: typeof DashboardCalendarIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/events/': {
      preLoaderRoute: typeof DashboardEventsIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/guests/': {
      preLoaderRoute: typeof DashboardGuestsIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/help/': {
      preLoaderRoute: typeof DashboardHelpIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/reports/': {
      preLoaderRoute: typeof DashboardReportsIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/requests/': {
      preLoaderRoute: typeof DashboardRequestsIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/team/': {
      preLoaderRoute: typeof DashboardTeamIndexImport
      parentRoute: typeof DashboardImport
    }
    '/signup/organization/': {
      preLoaderRoute: typeof SignupOrganizationIndexImport
      parentRoute: typeof rootRoute
    }
    '/signup/profile/': {
      preLoaderRoute: typeof SignupProfileIndexImport
      parentRoute: typeof rootRoute
    }
    '/team-invite/accept/': {
      preLoaderRoute: typeof TeamInviteAcceptIndexImport
      parentRoute: typeof rootRoute
    }
    '/team-invite/get-started/': {
      preLoaderRoute: typeof TeamInviteGetStartedIndexImport
      parentRoute: typeof rootRoute
    }
    '/team-invite/signup/': {
      preLoaderRoute: typeof TeamInviteSignupIndexImport
      parentRoute: typeof rootRoute
    }
    '/team-invite/signup/profile/': {
      preLoaderRoute: typeof TeamInviteSignupProfileIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  DashboardRoute.addChildren([
    DashboardIndexRoute,
    DashboardAccountIndexRoute,
    DashboardCalendarIndexRoute,
    DashboardEventsIndexRoute,
    DashboardGuestsIndexRoute,
    DashboardHelpIndexRoute,
    DashboardReportsIndexRoute,
    DashboardRequestsIndexRoute,
    DashboardTeamIndexRoute,
  ]),
  LoginIndexRoute,
  SignupIndexRoute,
  TeamInviteIndexRoute,
  SignupOrganizationIndexRoute,
  SignupProfileIndexRoute,
  TeamInviteAcceptIndexRoute,
  TeamInviteGetStartedIndexRoute,
  TeamInviteSignupIndexRoute,
  TeamInviteSignupProfileIndexRoute,
])

/* prettier-ignore-end */
