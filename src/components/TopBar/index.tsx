import { useAuthStore } from "@/lib/stores/auth.store";
import { useEffect } from "react";
import { AuthSection } from "./components/AuthSection";
import { Logo } from "./components/Logo";
import { MobileMenu } from "./components/MobileMenu";
import { Navigation } from "./components/Navigation";

interface TopBarProps {
  initialUser?: {
    id: string;
    email: string | null;
  } | null;
}

export const TopBar = ({ initialUser }: TopBarProps) => {
  const { isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo />
          {isAuthenticated && <Navigation className="hidden md:flex h-full items-center space-y-0 py-0" />}
        </div>

        <div className="flex items-center gap-4">
          <AuthSection />
          {isAuthenticated && <MobileMenu />}
        </div>
      </div>
    </header>
  );
};

// Export components for compound component pattern
TopBar.Logo = Logo;
TopBar.Navigation = Navigation;
TopBar.AuthSection = AuthSection;
TopBar.MobileMenu = MobileMenu;
