import { QueryClient, QueryFunction } from "@tanstack/react-query";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let message = res.statusText || "The request failed. Please try again.";
    if (res.headers.get("content-type")?.includes("application/json")) {
      const body = await res.json().catch(() => null);
      if (typeof body?.message === "string") message = body.message;
    }
    throw new ApiError(res.status, message);
  }
}

export async function apiRequest<T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  // Keep session credentials and the CSRF header on this app's API only.
  if (!url.startsWith("/api/") || url.includes("\\")) {
    throw new Error("API requests must use a local /api/ URL.");
  }
  const method = (options?.method || "GET").toUpperCase();
  const isWrite = method !== "GET" && method !== "HEAD";
  const body = options?.body ?? (isWrite ? "{}" : undefined);
  const headers = new Headers(options?.headers);
  if (body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (isWrite) {
    headers.set("Content-Type", "application/json");
    headers.set("X-Portfolio-CSRF", "1");
  }

  const res = await fetch(url, {
    ...options,
    method,
    body,
    headers,
    credentials: "include",
    redirect: "error",
  });

  await throwIfResNotOk(res);
  if (res.status === 204) return undefined as T;
  if (!res.headers.get("content-type")?.includes("application/json")) {
    throw new Error("The server returned an unexpected response. Please try again.");
  }
  return res.json() as Promise<T>;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
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
