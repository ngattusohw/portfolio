import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthButtons() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Button variant="ghost" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">
          <span className="font-semibold mr-1">
            {user?.username}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/api/logout"}>
          Log out
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => window.location.href = "/api/login"}>
      Log in
    </Button>
  );
}