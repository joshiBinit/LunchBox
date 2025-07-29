import React from "react";
import { Card } from "./Card";
import { SummaryCard } from "./SummaryCard";
import type { Group } from "../types";
import { Plus, Trash2 } from "lucide-react";
import { Users, DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface DashboardProps {
  groups: Group[];
  summary: {
    totalGroups: number;
    totalSpent: number;
    totalReceivable: number;
    totalPayable: number;
  };
  onGroupSelect: (group: Group) => void;
  onShowCreateGroup: () => void;
  onLogExpenseForGroup: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  groups,
  summary,
  onGroupSelect,
  onShowCreateGroup,
  onLogExpenseForGroup,
  onDeleteGroup,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={onShowCreateGroup}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={Users}
          title="Total Groups"
          value={summary.totalGroups}
          color="blue"
        />
        <SummaryCard
          icon={DollarSign}
          title="Total Spent"
          value={summary.totalSpent}
          color="purple"
        />
        <SummaryCard
          icon={ArrowUpRight}
          title="Total Receivable"
          value={summary.totalReceivable}
          color="green"
        />
        <SummaryCard
          icon={ArrowDownLeft}
          title="Total Payable"
          value={summary.totalPayable}
          color="red"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Active Groups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="relative hover:shadow-xl transition-shadow p-0 group/card"
            >
              <div
                onClick={() => onGroupSelect(group)}
                className="p-6 cursor-pointer"
              >
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-4 pr-10">
                  {group.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Spent
                    </span>
                    <span className="font-semibold text-purple-500">
                      Rs. {group.summary?.totalCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      You are owed
                    </span>
                    <span className="font-semibold text-green-500">
                      Rs. {group.summary?.receivable.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      You owe
                    </span>
                    <span className="font-semibold text-red-500">
                      Rs. {group.summary?.payable.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogExpenseForGroup(group);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
                  aria-label={`Log expense for ${group.name}`}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGroup(group);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
                  aria-label={`Delete ${group.name}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
