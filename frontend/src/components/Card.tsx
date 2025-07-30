import React, { type ReactNode, type MouseEventHandler } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "elevated"
    | "glass"
    | "bordered"
    | "gradient"
    | "success"
    | "warning";
  padding?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>; // <-- add this line
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "lg",
  hover = false,
  onClick, // receive the onClick prop
}) => {
  const baseClasses = "rounded-2xl transition-all duration-300";

  const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
    default: "bg-white shadow-sm border border-slate-200/60",
    elevated: "bg-white shadow-xl border border-slate-200/60",
    glass: "bg-white/70 backdrop-blur-sm shadow-lg border border-white/20",
    bordered: "bg-white border-2 border-slate-200 shadow-sm",
    gradient:
      "bg-gradient-to-br from-white to-slate-50 shadow-lg border border-slate-200/60",
    success: "bg-green-100 border border-green-400 text-green-800 shadow-md",
    warning: "bg-yellow-100 border border-yellow-400 text-yellow-800 shadow-md",
  };

  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const hoverClasses = hover
    ? "hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 cursor-pointer"
    : "";

  return (
    <div
      onClick={onClick} // pass down the onClick prop
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};
