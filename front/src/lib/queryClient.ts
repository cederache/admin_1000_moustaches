import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: (failureCount, error: unknown) => {
        // Don't retry on 401 (auth)
        const err = error as { status?: number };
        if (err?.status === 401) return false;
        return failureCount < 2;
      },
    },
  },
});
