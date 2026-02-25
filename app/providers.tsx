"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            // The API data never changes — fetch once and keep forever.
            // This means zero redundant network requests across the session.
            staleTime: Infinity,
            gcTime: Infinity,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ReactQueryDevtools is automatically tree-shaken from production builds
          by @tanstack/react-query-devtools v5 when NODE_ENV !== "development" */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
