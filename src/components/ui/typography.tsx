import { cn } from "@/lib/utils";
import type { ElementType } from "react";
import { forwardRef } from "react";
import type { BaseProps } from "./types";

export type TypographyVariant =
  | "display" // 34px
  | "h1" // 28px
  | "h2" // 24px
  | "h3" // 20px
  | "body" // 17px
  | "caption" // 12px
  | "small"; // 10px

export type TypographyWeight = "regular" | "medium" | "semibold" | "bold";

export interface TypographyProps extends BaseProps {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  as?: ElementType;
}

const variantClasses: Record<TypographyVariant, string> = {
  display: "text-[34px] leading-[1.2]",
  h1: "text-[28px] leading-[1.3]",
  h2: "text-[24px] leading-[1.35]",
  h3: "text-[20px] leading-[1.4]",
  body: "text-[17px] leading-[1.5]",
  caption: "text-[12px] leading-[1.4]",
  small: "text-[10px] leading-[1.4]",
};

const weightClasses: Record<TypographyWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "body", weight = "regular", as, className, children, ...props }, ref) => {
    const Component = as || getDefaultTag(variant);

    return (
      <Component ref={ref} className={cn(variantClasses[variant], weightClasses[weight], className)} {...props}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

function getDefaultTag(variant: TypographyVariant): ElementType {
  switch (variant) {
    case "display":
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "caption":
    case "small":
      return "span";
    default:
      return "p";
  }
}
