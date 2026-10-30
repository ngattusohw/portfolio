import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { LockKeyhole } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  // Fragments never reach the server; remove the key from history immediately.
  const [setupToken] = useState(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("setup") ?? "";
    if (token) window.history.replaceState(null, "", "/admin");
    return token;
  });
  const { data: status, isLoading, error: statusError } = useQuery<{ configured: boolean; setupRequired: boolean }>({ queryKey: ["/api/auth/status"], staleTime: 0 });
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const setup = Boolean(setupToken && status?.setupRequired);
  const available = status?.configured && (!status.setupRequired || setup);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (setup && password !== confirmation) { setError("The passwords don't match."); return; }
    setBusy(true);
    try {
      const user = await apiRequest(setup ? "/api/auth/setup" : "/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password, ...(setup ? { token: setupToken } : {}) }),
      });
      setPassword("");
      setConfirmation("");
      queryClient.removeQueries({ queryKey: ["/api/blog"] });
      queryClient.setQueryData(["/api/auth/user"], user);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
    } finally { setBusy(false); }
  }

  return <main className="min-h-[85svh] px-4 pb-16 pt-28 sm:pt-36">
    <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-card p-6 sm:p-8">
      <LockKeyhole className="mb-5 h-8 w-8 text-primary" aria-hidden="true" />
      <h1 className="font-heading text-3xl">{setup ? "Set up your editor" : "Blog editor"}</h1>
      <p className="mb-7 mt-3 text-sm leading-relaxed text-muted-foreground">{setup ? "Choose a private password to manage your posts. A long passphrase works well." : "Sign in to write, edit, and publish your posts."}</p>
      {isLoading ? <p role="status">Loading sign-in…</p> : !available ? <p role="status" className="text-sm text-muted-foreground">{statusError ? "Couldn't load sign-in. Refresh to try again." : status?.configured ? "Owner setup is pending. Use your private setup link to choose a password." : "Sign-in isn't configured yet."}</p> : <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="owner-password">{setup ? "New password" : "Password"}</Label>
          <Input id="owner-password" type="password" autoComplete={setup ? "new-password" : "current-password"} minLength={15} maxLength={128} required value={password} onChange={event => setPassword(event.target.value)} className="h-12 text-base" aria-describedby="password-help" />
          <p id="password-help" className="text-xs text-muted-foreground">15–128 characters. Save it in your password manager.</p>
        </div>
        {setup && <div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" autoComplete="new-password" minLength={15} maxLength={128} required value={confirmation} onChange={event => setConfirmation(event.target.value)} className="h-12 text-base" /></div>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="h-12 w-full" disabled={busy}>{busy ? "Please wait…" : setup ? "Save password and open editor" : "Sign in"}</Button>
      </form>}
      <Link href="/" className="mt-7 inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">← Back to portfolio</Link>
    </div>
  </main>;
}
