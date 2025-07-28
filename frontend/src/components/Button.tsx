import React, { type ReactNode } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 backdrop-blur-sm border shadow-lg hover:shadow-xl transform-gpu";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500/50 disabled:from-blue-300 disabled:to-indigo-300 border-blue-500/20 shadow-blue-500/25 hover:shadow-blue-500/40",
    secondary:
      "bg-gradient-to-r from-gray-100/80 to-blue-50/80 hover:from-gray-200/80 hover:to-blue-100/80 text-gray-700 dark:from-gray-700/80 dark:to-gray-600/80 dark:hover:from-gray-600/80 dark:hover:to-gray-500/80 dark:text-gray-200 focus:ring-gray-500/50 disabled:from-gray-100/50 disabled:to-gray-200/50 dark:disabled:from-gray-800/50 dark:disabled:to-gray-700/50 border-gray-200/50 dark:border-gray-600/50 shadow-gray-500/10 hover:shadow-gray-500/20",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white focus:ring-red-500/50 disabled:from-red-300 disabled:to-rose-300 border-red-500/20 shadow-red-500/25 hover:shadow-red-500/40",
  };

  const sizeClasses = {
    sm: "px-4 py-2.5 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2.5",
    lg: "px-8 py-4 text-lg gap-3",
  };

  const disabledClasses =
    disabled || loading
      ? "cursor-not-allowed opacity-60 shadow-none hover:shadow-none transform-none"
      : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]";

  return (
    <motion.button
      whileHover={
        disabled || loading
          ? {}
          : {
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }
      }
      whileTap={
        disabled || loading
          ? {}
          : {
              scale: 0.98,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }
      }
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <LoadingSpinner size="sm" />
        </motion.div>
      )}
      <motion.span
        className={loading ? "ml-1" : ""}
        initial={loading ? { opacity: 0.7 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};
