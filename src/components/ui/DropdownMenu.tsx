import { cn } from "@/lib/utils";
import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, className }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "inline-flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2",
        "bg-white text-sm font-medium text-gray-700",
        "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen);
      }}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({ children, className, align = "end" }: DropdownMenuContentProps) {
  const { isOpen } = React.useContext(DropdownMenuContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-10 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5",
        "animate-in fade-in-0 zoom-in-95",
        {
          "left-0": align === "start",
          "right-0": align === "end",
          "left-1/2 -translate-x-1/2": align === "center",
        },
        className
      )}
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
    >
      <div className="py-1" role="none">
        {children}
      </div>
    </div>
  );
}

export function DropdownMenuItem({ children, className, disabled = false, onSelect }: DropdownMenuItemProps) {
  const { setIsOpen } = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    if (!disabled) {
      onSelect?.();
      setIsOpen(false);
    }
  };

  return (
    <button
      className={cn(
        "flex w-full items-center px-4 py-2 text-sm text-gray-700",
        "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return <span className={cn("block px-4 py-2 text-sm font-medium text-gray-900", className)}>{children}</span>;
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200" role="none" />;
}
