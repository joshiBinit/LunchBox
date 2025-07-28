import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "pulse" | "dots";
  color?: "blue" | "emerald" | "purple" | "red" | "current";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  color = "current",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  // const colorClasses = {
  //   blue: "border-blue-500",
  //   emerald: "border-emerald-500",
  //   purple: "border-purple-500",
  //   red: "border-red-500",
  //   current: "border-current",
  // };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  if (variant === "gradient") {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`${sizeClasses[size]} relative`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-75"></div>
        <div className="absolute inset-0.5 rounded-full bg-white dark:bg-gray-800"></div>
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
      </motion.div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/50`}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex items-center space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className={`${dotSizes[size]} rounded-full bg-gradient-to-r ${
              color === "blue"
                ? "from-blue-500 to-indigo-500"
                : color === "emerald"
                ? "from-emerald-500 to-teal-500"
                : color === "purple"
                ? "from-purple-500 to-pink-500"
                : color === "red"
                ? "from-red-500 to-rose-500"
                : "from-gray-500 to-gray-600"
            } shadow-lg`}
            style={{
              boxShadow:
                color === "blue"
                  ? "0 0 10px rgba(59, 130, 246, 0.5)"
                  : color === "emerald"
                  ? "0 0 10px rgba(16, 185, 129, 0.5)"
                  : color === "purple"
                  ? "0 0 10px rgba(139, 92, 246, 0.5)"
                  : color === "red"
                  ? "0 0 10px rgba(239, 68, 68, 0.5)"
                  : "0 0 10px rgba(107, 114, 128, 0.5)",
            }}
          />
        ))}
      </div>
    );
  }

  // Default spinner with enhanced styling
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`${sizeClasses[size]} relative`}
    >
      {/* Outer ring with gradient */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r ${
          color === "blue"
            ? "from-blue-500 to-indigo-500"
            : color === "emerald"
            ? "from-emerald-500 to-teal-500"
            : color === "purple"
            ? "from-purple-500 to-pink-500"
            : color === "red"
            ? "from-red-500 to-rose-500"
            : "from-gray-500 to-gray-600"
        } bg-clip-border`}
      ></div>

      {/* Inner transparent section */}
      <div className="absolute inset-0.5 rounded-full bg-white dark:bg-gray-800"></div>

      {/* Animated gradient arc */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute inset-0 rounded-full border-2 border-transparent ${
          color === "current" ? "border-t-current" : `border-t-${color}-500`
        } bg-gradient-to-r ${
          color === "blue"
            ? "from-blue-500/20 via-blue-500 to-transparent"
            : color === "emerald"
            ? "from-emerald-500/20 via-emerald-500 to-transparent"
            : color === "purple"
            ? "from-purple-500/20 via-purple-500 to-transparent"
            : color === "red"
            ? "from-red-500/20 via-red-500 to-transparent"
            : color === "current"
            ? "from-current/20 via-current to-transparent"
            : "from-gray-500/20 via-gray-500 to-transparent"
        } bg-clip-border`}
        style={{
          background:
            color === "current"
              ? undefined
              : `conic-gradient(from 0deg, ${
                  color === "blue"
                    ? "rgba(59, 130, 246, 0.2)"
                    : color === "emerald"
                    ? "rgba(16, 185, 129, 0.2)"
                    : color === "purple"
                    ? "rgba(139, 92, 246, 0.2)"
                    : color === "red"
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(107, 114, 128, 0.2)"
                } 0deg, ${
                  color === "blue"
                    ? "#3b82f6"
                    : color === "emerald"
                    ? "#10b981"
                    : color === "purple"
                    ? "#8b5cf6"
                    : color === "red"
                    ? "#ef4444"
                    : "#6b7280"
                } 90deg, transparent 180deg)`,
        }}
      ></motion.div>

      {/* Glowing effect */}
      {color !== "current" && (
        <div
          className={`absolute inset-0 rounded-full blur-sm opacity-50 ${
            color === "blue"
              ? "bg-blue-500/30"
              : color === "emerald"
              ? "bg-emerald-500/30"
              : color === "purple"
              ? "bg-purple-500/30"
              : color === "red"
              ? "bg-red-500/30"
              : "bg-gray-500/30"
          }`}
        ></div>
      )}
    </motion.div>
  );
};
