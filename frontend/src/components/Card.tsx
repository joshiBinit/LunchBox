import React, { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
};
