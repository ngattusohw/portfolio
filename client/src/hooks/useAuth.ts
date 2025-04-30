import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Check if the user is Nick (username: ngattuso3)
  const isNick = user?.username === "ngattuso3"; // Replace with your actual Replit username

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAuthorized: isNick, // Only Nick is authorized to access admin features
  };
}