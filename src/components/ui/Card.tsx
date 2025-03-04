
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
}

const Card = ({ className, children, interactive = false, onClick }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border border-border shadow-sm",
        interactive && "hover-card-effect cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader = ({ className, children }: CardHeaderProps) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
    >
      {children}
    </div>
  );
};

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

const CardTitle = ({ className, children }: CardTitleProps) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const CardDescription = ({
  className,
  children,
}: CardDescriptionProps) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </p>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent = ({ className, children }: CardContentProps) => {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
