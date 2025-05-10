import { useAuthStore } from "@/lib/stores/auth.store";

export const useAuthNavigation = () => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear auth store state
      logout();

      // Force page reload to clear any cached state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show error to user
      alert("Failed to logout. Please try again.");
    }
  };

  return { handleLogout };
};
