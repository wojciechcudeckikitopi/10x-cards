import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { BaseProps } from "./types";

export interface ToastProps extends BaseProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
  action?: React.ReactNode;
  onClose?: () => void;
}

const variantClasses = {
  default: "bg-white text-gray-900",
  success: "bg-green-50 text-green-900",
  warning: "bg-yellow-50 text-yellow-900",
  error: "bg-red-50 text-red-900",
};

const variantIconClasses = {
  default: "text-gray-400",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, variant = "default", action, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3 w-0 flex-1">
          {variant !== "default" && (
            <div className={cn("flex-shrink-0", variantIconClasses[variant])}>
              {variant === "success" && (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {variant === "warning" && (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {variant === "error" && (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}
          <div className="w-full">
            {title && <div className="font-medium">{title}</div>}
            {description && <div className="mt-1 text-sm">{description}</div>}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {action}
          {onClose && (
            <button
              onClick={onClose}
              className={cn("inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2", {
                "hover:bg-green-100 focus:ring-green-600": variant === "success",
                "hover:bg-yellow-100 focus:ring-yellow-600": variant === "warning",
                "hover:bg-red-100 focus:ring-red-600": variant === "error",
                "hover:bg-gray-100 focus:ring-gray-600": variant === "default",
              })}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Toast.displayName = "Toast";

export interface ProgressProps extends BaseProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
}

const progressSizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const progressVariantClasses = {
  default: "bg-blue-600",
  success: "bg-green-600",
  warning: "bg-yellow-600",
  error: "bg-red-600",
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, indeterminate = false, size = "md", variant = "default", ...props }, ref) => {
    const percentage = value != null ? Math.round((value / max) * 100) : null;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : (percentage ?? undefined)}
        className={cn("overflow-hidden rounded-full bg-gray-200", progressSizeClasses[size], className)}
        {...props}
      >
        <div
          className={cn("h-full transition-all", progressVariantClasses[variant], {
            "animate-indeterminate w-3/4": indeterminate,
            "w-0": !indeterminate && !percentage,
          })}
          style={!indeterminate && percentage != null ? { width: `${percentage}%` } : undefined}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";
