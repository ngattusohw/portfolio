import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

// Extended user type to include email
interface OwnerUser {
  id: string;
  username: string;
  role: "owner";
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<OwnerUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAuthorized: user?.role === "owner",
  };
}
