import React from "react";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  variant?: "default" | "success" | "warning" | "info" | "danger";
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon: IconComponent,
  title,
  value,
  variant = "default",
  trend = "neutral",
  subtitle,
}) => {
  const displayValue =
    title === "Total Groups" ? value.toString() : `Rs. ${value.toFixed(2)}`;

  const variantStyles = {
    default: {
      card: "bg-gradient-to-br from-white to-slate-50 border border-slate-200/60",
      iconBg: "bg-slate-100 text-slate-600",
      iconRing: "ring-slate-200/50",
    },
    success: {
      card: "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60",
      iconBg: "bg-emerald-100 text-emerald-600",
      iconRing: "ring-emerald-200/50",
    },
    warning: {
      card: "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/60",
      iconBg: "bg-amber-100 text-amber-600",
      iconRing: "ring-amber-200/50",
    },
    info: {
      card: "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60",
      iconBg: "bg-blue-100 text-blue-600",
      iconRing: "ring-blue-200/50",
    },
    danger: {
      card: "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60",
      iconBg: "bg-red-100 text-red-600",
      iconRing: "ring-red-200/50",
    },
  };

  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-slate-500",
  };

  const currentStyle = variantStyles[variant];

  return (
    <div
      className={`${currentStyle.card} rounded-2xl shadow-lg border p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group select-none`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center space-x-5">
          <div
            className={`${currentStyle.iconBg} ${currentStyle.iconRing} p-4 rounded-xl ring-2 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 text-sm font-semibold">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p
                className={`${trendColors[trend]} text-3xl font-bold transition-colors select-text`}
              >
                {displayValue}
              </p>
              {trend !== "neutral" && (
                <div
                  className={`flex items-center text-xs font-medium ${trendColors[trend]}`}
                  aria-label={`Trend ${trend === "up" ? "upward" : "downward"}`}
                >
                  {trend === "up" ? "↗" : "↘"}
                </div>
              )}
            </div>
            {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Subtle decorative element */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent -translate-y-12 translate-x-12 opacity-50 pointer-events-none"></div>
    </div>
  );
};
