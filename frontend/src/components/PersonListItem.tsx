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
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === "receivable" ? "bg-gray-200" : "bg-gray-400"
        }`}
      >
        <span className="text-lg font-bold text-gray-800">
          {name.charAt(0)}
        </span>
      </div>
      <span className="font-medium text-gray-900">{name}</span>
    </div>
    <span
      className={`font-bold text-lg text-gray-900`}
      aria-label={`${type === "receivable" ? "Receivable" : "Payable"} amount`}
    >
      Rs. {amount.toFixed(2)}
    </span>
  </div>
);
