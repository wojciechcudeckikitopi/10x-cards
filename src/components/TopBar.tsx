import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/stores/auth.store";
import { NavigationGroup, NavigationItem, NavigationMenu } from "./ui/Navigation";

interface TopBarProps {
  initialUser?: {
    id: string;
    email: string | null;
  } | null;
}

export const TopBar = ({ initialUser }: TopBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const { user, isAuthenticated, logout, setUser } = useAuthStore();

  useEffect(() => {
    setCurrentPath(new URL(window.location.href).pathname);
  }, []);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear auth store
      logout();
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { href: "/flashcards", label: "Flashcards" },
    { href: "/study", label: "Study" },
  ];

  const renderNavigationItems = (className?: string) => (
    <NavigationGroup className={className}>
      {navigationItems.map((item) => (
        <NavigationItem key={item.href} href={item.href} active={currentPath === item.href}>
          {item.label}
        </NavigationItem>
      ))}
    </NavigationGroup>
  );

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">10x</span>
            <span className="text-xl font-medium">Cards</span>
          </a>
          <NavigationMenu className="hidden md:flex h-full items-center space-y-0 py-0">
            {renderNavigationItems("flex space-x-1 space-y-0")}
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
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
          ) : (
            <a
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Login
            </a>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <NavigationMenu className="container mx-auto px-4 py-2">
            {renderNavigationItems("flex flex-col space-y-1")}
          </NavigationMenu>
        </div>
      )}
    </header>
  );
};
