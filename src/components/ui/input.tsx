import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { InteractiveProps, Size } from "./types";

export interface InputProps extends InteractiveProps {
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  size?: Size;
  name?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size = "md",
      name,
      placeholder,
      value,
      defaultValue,
      error,
      helperText,
      required,
      disabled,
      icon,
      iconPosition = "left",
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const baseClasses = "w-full rounded-lg border-2 bg-white transition-colors duration-200 placeholder-gray-400";
    const stateClasses = {
      default: "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      error: "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
      disabled: "opacity-50 cursor-not-allowed bg-gray-100",
    };

    return (
      <div className="relative">
        {icon && iconPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          className={cn(
            baseClasses,
            sizeClasses[size],
            error ? stateClasses.error : stateClasses.default,
            disabled && stateClasses.disabled,
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            className
          )}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        {helperText && <p className={cn("mt-1 text-sm", error ? "text-red-500" : "text-gray-500")}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
