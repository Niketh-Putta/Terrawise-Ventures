import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { fallbackProjects, fallbackTestimonials, getFallbackProject } from "@/data/fallback-data";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  }
): Promise<any> {
  const res = await fetch(url, {
    method: options?.method || "GET",
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
    body: options?.body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      if (url.startsWith("/api/projects")) {
        if (queryKey.length > 1) {
          const id = Number(queryKey[1]);
          const fallbackProject = Number.isFinite(id) ? getFallbackProject(id) : undefined;
          if (fallbackProject) {
            return fallbackProject as T;
          }
        }
        return fallbackProjects as T;
      }

      if (url.startsWith("/api/testimonials")) {
        return fallbackTestimonials as T;
      }

      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
