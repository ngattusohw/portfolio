import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const method = options?.method || 'GET';
  const hasData = !!options?.body;
  
  const res = await fetch(url, {
    method,
    headers: {
      ...(hasData ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
    body: options?.body,
    credentials: "include",
    ...options,
  });

  await throwIfResNotOk(res);
  
  // Clone and parse JSON if it's JSON response
  if (res.headers.get('content-type')?.includes('application/json')) {
    const clonedRes = res.clone();
    try {
      const data = await clonedRes.json();
      return data;
    } catch (e) {
      console.error('Failed to parse JSON response', e);
    }
  }
  
  return res;
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
