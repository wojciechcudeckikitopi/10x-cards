import { cn } from "@/lib/utils";
import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the skeleton
   * - text: For text content
   * - circular: For avatars and icons
   * - rectangular: For cards and images
   */
  variant?: "text" | "circular" | "rectangular";

  /**
   * The width of the skeleton
   * - full: 100% width
   * - number: specific width in pixels
   * - string: CSS width value
   */
  width?: "full" | number | string;

  /**
   * The height of the skeleton
   * - number: specific height in pixels
   * - string: CSS height value
   */
  height?: number | string;

  /**
   * Whether to show animation
   */
  animate?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", width, height, animate = true, ...props }, ref) => {
    const styles: React.CSSProperties = {
      width: width === "full" ? "100%" : width,
      height,
    };

    return (
      <div
        ref={ref}
        data-variant={variant}
        className={cn(
          // Base styles
          "bg-gray-200 dark:bg-gray-700",

          // Animation
          animate && "animate-pulse",

          // Variants
          {
            // Text variant
            "h-4 w-full rounded": variant === "text",

            // Circular variant
            "aspect-square rounded-full": variant === "circular",

            // Rectangular variant
            "rounded-lg": variant === "rectangular",
          },

          className
        )}
        style={styles}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Prebuilt components for common use cases
const SkeletonText = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, "variant">>((props, ref) => (
  <Skeleton ref={ref} variant="text" {...props} />
));
SkeletonText.displayName = "SkeletonText";

const SkeletonCircle = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, "variant">>((props, ref) => (
  <Skeleton ref={ref} variant="circular" {...props} />
));
SkeletonCircle.displayName = "SkeletonCircle";

const SkeletonRectangle = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, "variant">>((props, ref) => (
  <Skeleton ref={ref} variant="rectangular" {...props} />
));
SkeletonRectangle.displayName = "SkeletonRectangle";

// Compound components for complex skeletons
const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)} {...props}>
    <SkeletonRectangle height={200} width="full" />
    <div className="space-y-2">
      <SkeletonText width="60%" />
      <SkeletonText width="40%" />
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonProps & { size?: number }>(
  ({ size = 40, className, ...props }, ref) => (
    <SkeletonCircle ref={ref} width={size} height={size} className={cn("shrink-0", className)} {...props} />
  )
);
SkeletonAvatar.displayName = "SkeletonAvatar";

const SkeletonList = React.forwardRef<HTMLDivElement, SkeletonProps & { count?: number }>(
  ({ count = 3, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <SkeletonAvatar />
          <div className="space-y-2 flex-1">
            <SkeletonText width="40%" />
            <SkeletonText width="70%" />
          </div>
        </div>
      ))}
    </div>
  )
);
SkeletonList.displayName = "SkeletonList";

export { Skeleton, SkeletonAvatar, SkeletonCard, SkeletonCircle, SkeletonList, SkeletonRectangle, SkeletonText };
