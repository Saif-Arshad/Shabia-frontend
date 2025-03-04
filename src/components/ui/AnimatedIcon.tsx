
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  icon: React.ReactNode;
  className?: string;
  animation?: "pulse" | "float" | "spin" | "bounce" | "none";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

const animationStyles = {
  pulse: "animate-pulse",
  float: "animate-float",
  spin: "animate-spin",
  bounce: "animate-bounce",
  none: "",
};

const AnimatedIcon = ({
  icon,
  className,
  animation = "none",
  size = "md",
}: AnimatedIconProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 text-primary",
        sizeStyles[size],
        animationStyles[animation],
        className
      )}
    >
      {icon}
    </div>
  );
};

export default AnimatedIcon;
