import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "./useAuth";

/**
 * This hook creates a keyboard shortcut for admin access.
 * Press "Alt + Shift + A" to access the admin area.
 * This provides a hidden way to access the admin area without visible UI elements.
 */
export function useAdminAccess() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simple keyboard shortcut handler for admin access
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+A combination (using Ctrl instead of Alt to avoid browser conflicts)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        
        // If already authenticated, go to admin, otherwise go to login first
        if (isAuthenticated) {
          navigate("/admin");
        } else {
          window.location.href = "/api/login"; // Go to login endpoint
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, isAuthenticated]);
}
