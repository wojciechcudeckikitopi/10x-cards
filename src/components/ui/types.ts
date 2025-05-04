import type { ReactNode } from "react";

export interface BaseProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

export type Size = "sm" | "md" | "lg" | "xl";
export type Variant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
export type ColorScheme = "default" | "brand" | "success" | "warning" | "danger";

export interface InteractiveProps extends BaseProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}
