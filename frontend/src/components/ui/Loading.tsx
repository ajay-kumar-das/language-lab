import React from "react";
import { cn } from "./utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = "md"
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );
};

interface GlobalLoaderProps {
  message?: string;
  className?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({
  message = "Loading...",
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = "Loading...",
  children
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <GlobalLoader message={message} />
        </div>
      )}
    </div>
  );
};

export { LoadingSpinner };
export default LoadingSpinner;
