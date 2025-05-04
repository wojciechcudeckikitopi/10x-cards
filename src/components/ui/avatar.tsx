import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { BaseProps } from "./types";

export interface AvatarProps extends BaseProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  bordered?: boolean;
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-14 w-14 text-xl",
};

const statusClasses = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", status, bordered = false, ...props }, ref) => {
    const getFallbackInitials = (name: string) => {
      return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    };

    return (
      <div ref={ref} className={cn("relative inline-block", className)} {...props}>
        <div
          className={cn(
            "relative flex shrink-0 overflow-hidden rounded-full",
            sizeClasses[size],
            bordered && "ring-2 ring-white ring-offset-2 ring-offset-gray-100",
            "bg-gray-100"
          )}
        >
          {src ? (
            <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
          ) : (
            <span className={cn("flex h-full w-full items-center justify-center font-medium text-gray-900")}>
              {fallback ? getFallbackInitials(fallback) : "?"}
            </span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              "absolute right-0 top-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white",
              statusClasses[status]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends BaseProps {
  max?: number;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, ...props }, ref) => {
    const childrenArray = Array.isArray(children) ? children : [children];
    const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
    const remainingCount = max ? Math.max(childrenArray.length - max, 0) : 0;

    return (
      <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
        {visibleAvatars}
        {remainingCount > 0 && (
          <div
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-full bg-gray-100",
              sizeClasses.md
            )}
          >
            <span className="text-sm font-medium text-gray-900">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";
