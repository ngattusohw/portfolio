import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AuthButtons() {
  const { user, isAuthenticated } = useAuth();
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  if (!isAuthenticated) return null;
  async function logout() {
    setBusy(true);
    try {
      await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
      // Remove private draft caches as soon as the session ends.
      queryClient.clear();
      window.location.replace("/admin");
    } catch (error) {
      toast({ title: "Couldn't sign out", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
      setBusy(false);
    }
  }
  return <div className="flex items-center gap-3 text-sm">
    <span>{user?.username}</span>
    <Button variant="outline" className="min-h-11" disabled={busy} onClick={logout}>{busy ? "Signing out…" : "Sign out"}</Button>
  </div>;
}
