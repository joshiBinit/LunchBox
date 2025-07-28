import { forwardRef } from "react";
import { motion } from "framer-motion";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "glass" | "floating";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      required = false,
      disabled = false,
      className = "",
      variant = "default",
    },
    ref
  ) => {
    const containerClasses = `space-y-3 ${className}`;

    const labelClasses = `
      block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2
      transition-colors duration-200
    `;

    const baseInputClasses = `
      w-full px-4 py-3 rounded-xl transition-all duration-300 transform-gpu
      text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
      font-medium focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-60
    `;

    const variantClasses = {
      default: `
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        border border-gray-300/50 dark:border-gray-600/50
        focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50
        shadow-lg shadow-gray-500/10 dark:shadow-gray-900/20
        focus:shadow-xl focus:shadow-blue-500/20
        hover:shadow-lg hover:shadow-gray-500/15
        disabled:bg-gray-100/50 dark:disabled:bg-gray-700/50
        ${
          error
            ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/50 shadow-red-500/10"
            : ""
        }
      `,
      glass: `
        bg-gradient-to-br from-white/60 to-blue-50/60 dark:from-gray-800/60 dark:to-gray-700/60
        backdrop-blur-md border border-white/20 dark:border-gray-600/20
        focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400/60
        shadow-xl shadow-gray-500/20 dark:shadow-gray-900/40
        focus:shadow-2xl focus:shadow-blue-500/30
        hover:shadow-xl hover:shadow-gray-500/25
        disabled:bg-gray-100/40 dark:disabled:bg-gray-700/40
        ${
          error
            ? "border-red-400/40 focus:ring-red-500/30 focus:border-red-400/60 shadow-red-500/20"
            : ""
        }
      `,
      floating: `
        bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20
        backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50
        focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500/60
        shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20
        focus:shadow-xl focus:shadow-blue-500/25
        hover:shadow-lg hover:shadow-blue-500/15
        disabled:bg-gray-100/50 dark:disabled:bg-gray-700/50
        ${
          error
            ? "border-red-500/50 focus:ring-red-500/25 focus:border-red-500/60 shadow-red-500/15"
            : ""
        }
      `,
    };

    return (
      <motion.div
        className={containerClasses}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.3 },
        }}
      >
        {label && (
          <motion.label
            className={labelClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {label}
            {required && (
              <motion.span
                className="text-red-500 ml-1 font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              >
                *
              </motion.span>
            )}
          </motion.label>
        )}

        <motion.div className="relative">
          <motion.input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            whileFocus={{
              scale: 1.01,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            whileHover={
              disabled
                ? {}
                : {
                    scale: 1.005,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }
            }
            className={`${baseInputClasses} ${variantClasses[variant]}`}
          />

          {/* Focus ring effect */}
          <motion.div
            className={`absolute inset-0 rounded-xl pointer-events-none ${
              error
                ? "bg-gradient-to-r from-red-500/5 to-rose-500/5"
                : "bg-gradient-to-r from-blue-500/5 to-indigo-500/5"
            }`}
            initial={{ opacity: 0 }}
            whileFocus={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 backdrop-blur-sm rounded-xl border border-red-200/50 dark:border-red-700/50"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex-shrink-0"></div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";
