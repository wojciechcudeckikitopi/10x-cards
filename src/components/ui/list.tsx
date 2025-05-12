import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { BaseProps } from "./types";

export interface ListProps extends BaseProps {
  variant?: "default" | "divided";
}

const sizeClasses = {
  sm: "py-2",
  md: "py-3",
  lg: "py-4",
};

export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("rounded-lg", variant === "divided" && "divide-y divide-gray-200", className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

List.displayName = "List";

export interface ListItemProps extends BaseProps {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const ListItemButton = forwardRef<HTMLButtonElement, ListItemProps>(
  (
    { className, children, selected, disabled, onClick, leading, trailing, description, size = "md", ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full items-start gap-3 px-4 text-left",
        sizeClasses[size],
        {
          "cursor-pointer bg-gray-50 hover:bg-gray-100": !disabled,
          "cursor-not-allowed opacity-50": disabled,
          "bg-blue-50": selected,
        },
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type="button"
      {...props}
    >
      {leading && <div className="flex-shrink-0">{leading}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium text-gray-900 truncate">{children}</div>
          {trailing && <div className="flex-shrink-0">{trailing}</div>}
        </div>
        {description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>}
      </div>
    </button>
  )
);

ListItemButton.displayName = "ListItemButton";

const ListItemStatic = forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, children, selected, leading, trailing, description, size = "md", ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "relative flex w-full items-start gap-3 px-4",
        sizeClasses[size],
        {
          "bg-blue-50": selected,
        },
        className
      )}
      {...props}
    >
      {leading && <div className="flex-shrink-0">{leading}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium text-gray-900 truncate">{children}</div>
          {trailing && <div className="flex-shrink-0">{trailing}</div>}
        </div>
        {description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>}
      </div>
    </li>
  )
);

ListItemStatic.displayName = "ListItemStatic";

export const ListItem = forwardRef<HTMLElement, ListItemProps>((props, ref) => {
  if (props.onClick) {
    return <ListItemButton {...props} ref={ref as React.Ref<HTMLButtonElement>} />;
  }
  return <ListItemStatic {...props} ref={ref as React.Ref<HTMLLIElement>} />;
});

ListItem.displayName = "ListItem";

export interface ListHeaderProps extends BaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const ListHeader = forwardRef<HTMLDivElement, ListHeaderProps>(
  ({ className, title, description, action, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-4 py-3", className)} {...props}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      </div>
    );
  }
);

ListHeader.displayName = "ListHeader";
