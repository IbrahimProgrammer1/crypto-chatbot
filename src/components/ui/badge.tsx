import * as React from "react";
import { cn } from "@/utils/helpers";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold transition-all duration-300",
          {
            "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-glow-sm":
              variant === "default",
            "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald":
              variant === "success",
            "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30":
              variant === "warning",
            "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-glow-rose":
              variant === "danger",
            "border border-white/20 bg-white/5 text-gray-300": variant === "outline",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
