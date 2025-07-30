import React from "react";
import { Card } from "./Card";
import { SummaryCard } from "./SummaryCard";
import type { Group } from "../types";
import {
  Plus,
  Trash2,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Sparkles,
} from "lucide-react";

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
  const getGroupVariant = (group: Group) => {
    const receivable = group.summary?.receivable ?? 0;
    const payable = group.summary?.payable ?? 0;

    if (receivable > payable) return "success";
    if (payable > receivable) return "warning";
    return "default";
  };

  const getBalanceStatus = (group: Group) => {
    const receivable = group.summary?.receivable ?? 0;
    const payable = group.summary?.payable ?? 0;

    if (receivable > payable)
      return {
        text: "You're ahead",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    if (payable > receivable)
      return { text: "You owe", color: "text-amber-600", bg: "bg-amber-50" };
    return { text: "All settled", color: "text-slate-600", bg: "bg-slate-50" };
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your expenses and track group spending
          </p>
        </div>

        <button
          onClick={onShowCreateGroup}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={Users}
          title="Total Groups"
          value={summary.totalGroups}
          variant="info"
          subtitle="Active groups"
        />
        <SummaryCard
          icon={DollarSign}
          title="Total Spent"
          value={summary.totalSpent}
          variant="default"
          subtitle="Across all groups"
        />
        <SummaryCard
          icon={ArrowUpRight}
          title="Total Receivable"
          value={summary.totalReceivable}
          variant="success"
          trend={summary.totalReceivable > 0 ? "up" : "neutral"}
          subtitle="Money owed to you"
        />
        <SummaryCard
          icon={ArrowDownLeft}
          title="Total Payable"
          value={summary.totalPayable}
          variant="warning"
          trend={summary.totalPayable > 0 ? "down" : "neutral"}
          subtitle="Money you owe"
        />
      </div>

      {/* Active Groups Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Active Groups
          </h2>
          <div className="text-slate-500 text-sm">
            {groups.length} group{groups.length !== 1 ? "s" : ""}
          </div>
        </div>

        {groups.length === 0 ? (
          <Card variant="glass" className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  No groups yet
                </h3>
                <p className="text-slate-600">
                  Create your first group to start tracking expenses with
                  friends
                </p>
              </div>
              <button
                onClick={onShowCreateGroup}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => {
              const balanceStatus = getBalanceStatus(group);

              return (
                <Card
                  key={group._id}
                  variant={getGroupVariant(group)}
                  className="relative hover:shadow-2xl transition-all duration-300 p-0 group/card overflow-hidden cursor-pointer transform hover:-translate-y-1"
                  onClick={() => onGroupSelect(group)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                  <div className="p-6 relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-1">
                        <h3 className="font-bold text-xl text-slate-900 group-hover/card:text-slate-800 transition-colors">
                          {group.name}
                        </h3>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${balanceStatus.bg} ${balanceStatus.color}`}
                        >
                          {balanceStatus.text}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 opacity-0 group-hover/card:opacity-100 transition-all duration-200 transform translate-x-2 group-hover/card:translate-x-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLogExpenseForGroup(group);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg"
                          aria-label={`Log expense for ${group.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteGroup(group);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg"
                          aria-label={`Delete ${group.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">
                            Total Spent
                          </span>
                        </div>
                        <span className="font-bold text-slate-900">
                          Rs. {group.summary?.totalCost?.toFixed(2) ?? "0.00"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <div className="flex items-center space-x-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-700">
                              Receivable
                            </span>
                          </div>
                          <span className="font-bold text-emerald-800">
                            Rs.{" "}
                            {group.summary?.receivable?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>

                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                          <div className="flex items-center space-x-1 mb-1">
                            <ArrowDownLeft className="w-3 h-3 text-red-600" />
                            <span className="text-xs font-medium text-red-700">
                              Payable
                            </span>
                          </div>
                          <span className="font-bold text-red-800">
                            Rs. {group.summary?.payable?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom border indicator */}
                  <div
                    className={`h-1 w-full ${
                      getGroupVariant(group) === "success"
                        ? "bg-gradient-to-r from-emerald-400 to-green-500"
                        : getGroupVariant(group) === "warning"
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                        : "bg-gradient-to-r from-slate-300 to-slate-400"
                    }`}
                  ></div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
