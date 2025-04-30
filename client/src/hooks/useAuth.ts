import { useQuery } from "@tanstack/react-query";

// Extended user type to include email
interface UserWithEmail {
  id: number;
  username: string;
  password: string;
  email?: string;  // Added for auth check
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<UserWithEmail>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Check if the user is Nick using any method available
  // Using any to bypass type checking during development
  const userAny = user as any;
  
  const isNick = 
    userAny?.username === "ngattuso3" || // Check username 
    userAny?.email === "ngattusohw@gmail.com"; // Check email
    
  console.log("Auth check in client:", userAny?.username, userAny?.email, isNick);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAuthorized: isNick, // Only Nick is authorized to access admin features
  };
}