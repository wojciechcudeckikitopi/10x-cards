import { cn } from "@/lib/utils";
import * as React from "react";

export interface LabelProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size"> {
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold";
  required?: boolean;
  optional?: boolean;
  error?: boolean;
  disabled?: boolean;
  tooltip?: string;
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
} as const;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className,
      children,
      size = "md",
      weight = "medium",
      required,
      optional,
      error,
      disabled,
      tooltip,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="inline-flex flex-wrap items-center gap-1">
        <label
          ref={ref}
          className={cn(
            // Base styles
            "inline-flex items-center gap-1.5",
            sizeClasses[size],
            weightClasses[weight],

            // State styles
            {
              "cursor-not-allowed opacity-50": disabled,
              "text-red-600": error,
              "text-gray-950 dark:text-gray-50": !error && !disabled,
            },

            className
          )}
          {...props}
        >
          {icon && <span className="text-gray-500">{icon}</span>}
          {children}
          {required && (
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          )}
          {optional && (
            <span className="text-gray-400 italic" aria-hidden="true">
              (optional)
            </span>
          )}
        </label>
        {tooltip && (
          <span className="group relative cursor-help" aria-label={tooltip}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-gray-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-full top-0 mt-[-8px] hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-900 rounded">
              {tooltip}
            </span>
          </span>
        )}
      </div>
    );
  }
);

Label.displayName = "Label";

export { Label };
