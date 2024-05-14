import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { Suspense, useEffect, useState } from "react";
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
import { ThemeProvider } from "next-themes";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persistOptions, queryClientOptions } from "@/lib/query-client";
import { QueryClient } from "@tanstack/react-query";

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_ENDPOINT}/graphql`,
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
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
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  useEffect(() => {
    loadDevTools();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Provider store={jotaiStore}>
          <ApolloProvider client={client}>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={persistOptions}
            >
              <ThemeProvider attribute="class" disableTransitionOnChange>
                <TooltipProvider delayDuration={0}>
                  <RouterProvider router={router} />
                </TooltipProvider>
              </ThemeProvider>
            </PersistQueryClientProvider>
          </ApolloProvider>
        </Provider>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
