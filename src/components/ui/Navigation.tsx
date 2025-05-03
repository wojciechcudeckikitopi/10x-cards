import { cn } from "@/lib/utils";
import { Children, cloneElement, forwardRef, isValidElement, type ElementType, type ReactNode } from "react";
import type { BaseProps } from "./types";

export interface NavigationItemProps extends BaseProps {
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  onClick?: () => void;
}

type NavigationItemComponent = ElementType<{
  ref?: React.Ref<HTMLElement>;
  href?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}>;

export const NavigationItem = forwardRef<HTMLElement, NavigationItemProps>(
  ({ className, children, href, icon, active, disabled, external, onClick, ...props }, ref) => {
    const Component = (href ? "a" : "button") as NavigationItemComponent;
    const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          {
            "bg-gray-100 text-gray-900": active,
            "text-gray-700 hover:bg-gray-100 hover:text-gray-900": !active && !disabled,
            "cursor-not-allowed opacity-50": disabled,
          },
          className
        )}
        href={href}
        onClick={onClick}
        disabled={disabled}
        {...externalProps}
        {...props}
      >
        {icon && <span className="h-4 w-4">{icon}</span>}
        {children}
      </Component>
    );
  }
);

NavigationItem.displayName = "NavigationItem";

export interface NavigationGroupProps extends BaseProps {
  title?: string;
}

export const NavigationGroup = forwardRef<HTMLDivElement, NavigationGroupProps>(
  ({ className, children, title, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {title && <h4 className="mb-2 px-2 text-sm font-semibold text-gray-900">{title}</h4>}
        {children}
      </div>
    );
  }
);

NavigationGroup.displayName = "NavigationGroup";

export interface NavigationMenuProps extends BaseProps {
  "aria-label"?: string;
}

export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(({ className, children, ...props }, ref) => {
  return (
    <nav ref={ref} className={cn("space-y-6 px-2 py-4", className)} {...props}>
      {children}
    </nav>
  );
});

NavigationMenu.displayName = "NavigationMenu";

export interface NavigationTabsProps extends BaseProps {
  value?: string;
  onChange?: (value: string) => void;
}

export interface NavigationTabProps extends NavigationItemProps {
  value: string;
}

export const NavigationTabs = forwardRef<HTMLDivElement, NavigationTabsProps>(
  ({ className, children, value, onChange, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex space-x-1 rounded-lg bg-gray-100 p-1", className)} {...props}>
        {Children.map(children, (child) => {
          if (!isValidElement<NavigationTabProps>(child)) return null;
          return cloneElement<NavigationTabProps>(child, {
            ...child.props,
            onClick: () => onChange?.(child.props.value),
            active: child.props.value === value,
          });
        })}
      </div>
    );
  }
);

NavigationTabs.displayName = "NavigationTabs";

export const NavigationTab = forwardRef<HTMLButtonElement, NavigationTabProps>(
  ({ className, children, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all",
          {
            "bg-white text-gray-900 shadow": active,
            "text-gray-700 hover:text-gray-900": !active,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NavigationTab.displayName = "NavigationTab";
