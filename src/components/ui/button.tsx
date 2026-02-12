import * as React from "react";
import { cn } from "@/utils/helpers";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "success" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-glow-sm hover:shadow-glow-md":
              variant === "default",
            "border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm hover:border-white/30":
              variant === "outline",
            "hover:bg-white/10 hover:shadow-glow-sm":
              variant === "ghost",
            "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-glow-sm hover:shadow-glow-md":
              variant === "destructive",
            "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-glow-emerald":
              variant === "success",
            "bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 shadow-glow-sm":
              variant === "danger",
          },
          {
            "h-10 px-4 py-2 text-sm": size === "default",
            "h-9 px-3 text-xs": size === "sm",
            "h-11 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
