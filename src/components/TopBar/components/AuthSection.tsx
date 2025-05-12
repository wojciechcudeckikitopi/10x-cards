import { useAuthStore } from "@/lib/stores/auth.store";
import { useAuthNavigation } from "../hooks/useAuthNavigation";

export const AuthSection = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { handleLogout } = useAuthNavigation();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {user.email || user.id}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <a href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
        Login
      </a>
      <a href="/auth/register" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
        Register
      </a>
    </div>
  );
};
