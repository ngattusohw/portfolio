import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * This hook creates a keyboard shortcut for admin access.
 * Press "Alt + Shift + A" to access the admin area.
 * This provides a hidden way to access the admin area without visible UI elements.
 */
export function useAdminAccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Simple keyboard shortcut handler for admin access
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt+Shift+A combination
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        // Navigate to admin page when the shortcut is pressed
        navigate("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
}