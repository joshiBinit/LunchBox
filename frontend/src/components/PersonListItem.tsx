import React from "react";

interface PersonListItemProps {
  name: string;
  amount: number;
  type: "receivable" | "payable";
}

export const PersonListItem: React.FC<PersonListItemProps> = ({
  name,
  amount,
  type,
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div
        className={`w-10 h-10 rounded-full ${
          type === "receivable"
            ? "bg-green-100 dark:bg-green-900"
            : "bg-red-100 dark:bg-red-900"
        } flex items-center justify-center`}
      >
        <span className="text-lg font-bold text-gray-700 dark:text-white">
          {name.charAt(0)}
        </span>
      </div>
      <span className="font-medium text-gray-800 dark:text-gray-200">
        {name}
      </span>
    </div>
    <span
      className={`font-bold text-lg ${
        type === "receivable" ? "text-green-500" : "text-red-500"
      }`}
    >
      Rs. {amount.toFixed(2)}
    </span>
  </div>
);
