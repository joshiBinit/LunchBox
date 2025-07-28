import React, { type ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: "default" | "gradient" | "glass";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  onClick,
  variant = "default",
}) => {
  const baseClasses = `
    rounded-2xl transition-all duration-300 transform-gpu
    ${hover ? "cursor-pointer" : ""}
  `;

  const variantClasses = {
    default: `
      bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
      border border-gray-200/50 dark:border-gray-700/50
      shadow-lg shadow-gray-500/10 dark:shadow-gray-900/20
      ${
        hover
          ? "hover:shadow-xl hover:shadow-gray-500/20 dark:hover:shadow-gray-900/30"
          : ""
      }
    `,
    gradient: `
      bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-700/90
      backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50
      shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20
      ${
        hover
          ? "hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-900/30"
          : ""
      }
    `,
    glass: `
      bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-700/60
      backdrop-blur-md border border-white/20 dark:border-gray-600/20
      shadow-xl shadow-gray-500/20 dark:shadow-gray-900/40
      ${
        hover
          ? "hover:shadow-2xl hover:shadow-gray-500/30 dark:hover:shadow-gray-900/50"
          : ""
      }
    `,
  };

  const hoverAnimation = hover
    ? {
        y: -4,
        scale: 1.02,
        transition: {
          type: "spring" as "spring",
          stiffness: 400,
          damping: 10,
        },
      }
    : {};

  const tapAnimation = hover
    ? {
        y: -2,
        scale: 1.01,
        transition: {
          type: "spring" as "spring",
          stiffness: 400,
          damping: 10,
        },
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.3 },
      }}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.div>
  );
};
