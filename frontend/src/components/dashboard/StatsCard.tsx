import React, { type ComponentType, type SVGProps } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../Card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: "blue" | "emerald" | "red" | "yellow";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}) => {
  const gradientClasses = {
    blue: "from-blue-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-600",
    red: "from-red-500 to-pink-600",
    yellow: "from-amber-500 to-orange-600",
  };

  const backgroundClasses = {
    blue: "from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20",
    emerald:
      "from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20",
    red: "from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20",
    yellow:
      "from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden bg-gradient-to-br ${backgroundClasses[color]} backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-2xl transition-all duration-300 p-0`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/30 to-transparent dark:from-white/10 dark:to-transparent rounded-full -mr-16 -mt-16"></div>
        </div>

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {title}
              </p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className="mt-3"
              >
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
              </motion.div>

              {trend && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center mt-4 px-3 py-1 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm w-fit"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                      trend.isPositive ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    {trend.isPositive ? (
                      <TrendingUp size={12} className="text-white" />
                    ) : (
                      <TrendingDown size={12} className="text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      trend.isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {trend.isPositive ? "+" : ""}
                    {trend.value}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    vs last month
                  </span>
                </motion.div>
              )}
            </div>

            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${gradientClasses[color]} shadow-lg`}
            >
              <Icon width={28} height={28} className="text-white" />
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClasses[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
          />
        </div>
      </Card>
    </motion.div>
  );
};
