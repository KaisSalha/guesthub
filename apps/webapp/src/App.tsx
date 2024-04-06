import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@guesthub/ui/toaster";
import { TooltipProvider } from "@guesthub/ui/tooltip";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { Provider } from "jotai";
import { jotaiStore } from "./lib/jotai-store";
import { setContext } from "@apollo/client/link/context";
import { authAtom } from "./atoms/auth";
import { ThemeProvider } from "next-themes";

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_ENDPOINT}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = jotaiStore.get(authAtom).token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const loadDevTools = () => {
  if (process.env.NODE_ENV !== "production") {
    return import("@apollo/client/dev")
      .then(({ loadDevMessages, loadErrorMessages }) => {
        loadDevMessages();
        loadErrorMessages();
      })
      .catch((err) => console.error("Failed to load dev messages", err));
  }
  return Promise.resolve();
};

function App() {
  useEffect(() => {
    loadDevTools();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Provider store={jotaiStore}>
          <ApolloProvider client={client}>
            <ThemeProvider attribute="class">
              <TooltipProvider delayDuration={0}>
                <RouterProvider router={router} />
              </TooltipProvider>
            </ThemeProvider>
          </ApolloProvider>
        </Provider>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
