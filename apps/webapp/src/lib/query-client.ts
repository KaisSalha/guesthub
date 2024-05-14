import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProviderProps } from "@tanstack/react-query-persist-client";

export const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
};

const persister = createSyncStoragePersister({
  key: "REACT_QUERY_PERSISTER",
  storage: window.localStorage,
});

export const persistOptions: PersistQueryClientProviderProps["persistOptions"] =
  {
    persister,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) =>
        query?.state?.status === "success" &&
        ((query?.options?.meta?.persist as boolean | undefined) ?? false),
    },
  };
