import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { fallbackProjects, fallbackTestimonials, getFallbackProject } from "@/data/fallback-data";

const REMOVED_PROJECT_NAMES = new Set(["TerraGenesis"]);

function isRemovedProject(project: unknown): boolean {
  return Boolean(
    project &&
      typeof project === "object" &&
      "name" in project &&
      REMOVED_PROJECT_NAMES.has(String((project as { name?: string }).name)),
  );
}

function sanitizeProjects<T>(projects: T): T {
  if (!Array.isArray(projects)) {
    return projects;
  }

  const visibleProjects = projects.filter((project) => !isRemovedProject(project));

  const hasVanam = visibleProjects.some(
    (project) =>
      project &&
      typeof project === "object" &&
      "name" in project &&
      (project as { name?: string }).name === "Vanam",
  );

  if (hasVanam) {
    return visibleProjects as T;
  }

  const vanam = getFallbackProject(6);
  return vanam ? ([vanam, ...visibleProjects] as T) : (visibleProjects as T);
}

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
      const data = await res.json();
      if (url.startsWith("/api/projects") && queryKey.length === 1) {
        return sanitizeProjects(data as T);
      }
      if (url.startsWith("/api/projects") && queryKey.length > 1 && isRemovedProject(data)) {
        throw new Error("Project not found");
      }
      return data;
    } catch (error) {
      if (url.startsWith("/api/projects")) {
        if (queryKey.length > 1) {
          const id = Number(queryKey[1]);
          const fallbackProject = Number.isFinite(id) ? getFallbackProject(id) : undefined;
          if (fallbackProject && !isRemovedProject(fallbackProject)) {
            return fallbackProject as T;
          }
        }
        return sanitizeProjects(fallbackProjects as T);
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
