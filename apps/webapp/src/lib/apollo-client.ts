import { router } from "@/router";
import { ApolloClient, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  InvalidationPolicyCache,
  RenewalPolicy,
} from "@nerdwallet/apollo-cache-policies";

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_ENDPOINT}/graphql`,
  credentials: "include",
});

const errorLink = onError(({ operation }) => {
  const { response } = operation.getContext();
  if (
    response.status === 401 &&
    new URL(window.location.href).pathname.startsWith("/dashboard")
  ) {
    client.clearStore();
    router.navigate({
      to: "/login",
    });
  }
});

const cache = new InvalidationPolicyCache({
  invalidationPolicies: {
    timeToLive: 1000 * 60 * 60, // 1 hour
    renewalPolicy: RenewalPolicy.WriteOnly,
    types: {
      S3File: {
        timeToLive: 1000 * 60 * 10, // 10 minutes
        renewalPolicy: RenewalPolicy.WriteOnly,
      },
    },
  },
});

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
  defaultOptions: {
    mutate: {
      errorPolicy: "all",
    },
  },
});
