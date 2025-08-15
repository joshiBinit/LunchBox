import React from "react";
import type { PersonListItemType } from "../types";

interface PersonListItemProps extends PersonListItemType {
  type: "receivable" | "payable";
}

export const PersonListItem: React.FC<PersonListItemProps> = ({
  name,
  amount,
  type,
}) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-default select-none">
    <div className="flex items-center space-x-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          type === "receivable" ? "bg-emerald-200" : "bg-amber-400"
        }`}
      >
        <span
          className={`text-xl font-extrabold ${
            type === "receivable" ? "text-emerald-900" : "text-amber-900"
          } select-text`}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <span className="font-semibold text-gray-900 text-lg truncate max-w-xs">
        {name}
      </span>
    </div>
    <span
      className={`font-extrabold text-lg ${
        type === "receivable" ? "text-emerald-700" : "text-amber-700"
      } select-text`}
      aria-label={`${type === "receivable" ? "Receivable" : "Payable"} amount`}
    >
      Rs. {amount.toFixed(2)}
    </span>
  </div>
);
