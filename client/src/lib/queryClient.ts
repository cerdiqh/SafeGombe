import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    let errorMessage = `Request failed with status ${res.status}`;
    
    try {
      const errorData = errorText ? JSON.parse(errorText) : null;
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    
    const error = new Error(errorMessage);
    (error as any).status = res.status;
    throw error;
  }
}

export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // Handle empty responses (like 204 No Content)
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  
  // Parse and return JSON for all other successful responses
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Expect first item to be the base URL string (e.g., "/api/incidents")
    // Optional second item can be an object with query params
    const [baseUrl, params] = queryKey as [string, any?];

    let url = typeof baseUrl === "string" ? baseUrl : String(baseUrl);

    if (params && typeof params === "object") {
      const search = new URLSearchParams();
      // Map known filter keys if provided
      if (typeof params.area === "string" && params.area) search.set("area", params.area);
      if (typeof params.type === "string" && params.type) search.set("type", params.type);
      // Support time windows
      const hours = params.hours ?? (params.timePeriod ? parseInt(params.timePeriod, 10) : undefined);
      if (!Number.isNaN(hours) && hours) search.set("hours", String(hours));
      const qs = search.toString();
      if (qs) {
        url = `${url}?${qs}`;
      }
    }

    const res = await fetch(url, {
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
