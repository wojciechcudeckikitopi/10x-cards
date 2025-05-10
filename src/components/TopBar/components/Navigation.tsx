import { NavigationGroup, NavigationItem, NavigationMenu } from "@/components/ui/Navigation";
import { useEffect, useState } from "react";

const navigationItems = [
  { href: "/flashcards", label: "Flashcards" },
  { href: "/study", label: "Study" },
];

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(new URL(window.location.href).pathname);
  }, []);

  return (
    <NavigationMenu className={className}>
      <NavigationGroup>
        {navigationItems.map((item) => (
          <NavigationItem key={item.href} href={item.href} active={currentPath === item.href}>
            {item.label}
          </NavigationItem>
        ))}
      </NavigationGroup>
    </NavigationMenu>
  );
};
