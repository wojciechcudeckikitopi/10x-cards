import { cn } from "@/lib/utils";
import React from "react";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  gap?: "none" | "sm" | "md" | "lg";
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, maxWidth = "lg", padding = "md", gap = "md", ...props }, ref) => {
    const maxWidths = {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
    };

    const paddings = {
      none: "px-0",
      sm: "px-4",
      md: "px-6",
      lg: "px-8",
    };

    const gaps = {
      none: "gap-0",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={cn("mx-auto w-full", maxWidths[maxWidth], paddings[padding], gaps[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Layout.displayName = "Layout";

const LayoutHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <header ref={ref} className={cn("w-full py-4", className)} {...props} />
);
LayoutHeader.displayName = "LayoutHeader";

const LayoutMain = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <main ref={ref} className={cn("w-full flex-1", className)} {...props} />
);
LayoutMain.displayName = "LayoutMain";

const LayoutFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <footer ref={ref} className={cn("w-full py-4", className)} {...props} />
);
LayoutFooter.displayName = "LayoutFooter";

const LayoutSidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right";
    width?: "sm" | "md" | "lg";
  }
>(({ className, side = "left", width = "md", ...props }, ref) => {
  const widths = {
    sm: "w-64",
    md: "w-72",
    lg: "w-80",
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "h-full",
        widths[width],
        side === "left" ? "border-r" : "border-l",
        "border-gray-200 dark:border-gray-800",
        className
      )}
      {...props}
    />
  );
});
LayoutSidebar.displayName = "LayoutSidebar";

const LayoutContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1", className)} {...props} />
);
LayoutContent.displayName = "LayoutContent";

export { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutMain, LayoutSidebar };

