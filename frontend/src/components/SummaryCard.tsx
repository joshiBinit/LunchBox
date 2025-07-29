import React from "react";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  color: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon: IconComponent,
  title,
  value,
  color,
}) => {
  const displayValue =
    title === "Total Groups" ? value : `Rs. ${value.toFixed(2)}`;
  // note: Tailwind 'bg-color-100' with dynamic class names requires safe-list or inline styles workaround
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div
          className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900`}
        >
          <IconComponent
            className={`w-6 h-6 text-${color}-500 dark:text-${color}-300`}
          />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {displayValue}
          </p>
        </div>
      </div>
    </div>
  );
};
