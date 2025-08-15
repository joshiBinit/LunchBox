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
    <div className="space-y-10 px-6 md:px-12 lg:px-20 py-8 max-w-screen-xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent select-none leading-tight">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Manage your expenses and track group spending effortlessly.
          </p>
        </div>

        <button
          onClick={onShowCreateGroup}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center space-x-3 transform hover:-translate-y-1"
          aria-label="Create a new group"
          type="button"
        >
          <Plus className="w-5 h-5" />
          <span className="text-lg select-none">Create Group</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 select-none">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Active Groups
          </h2>
          <div className="text-gray-500 text-sm select-none">
            {groups.length} group{groups.length !== 1 ? "s" : ""}
          </div>
        </div>

        {groups.length === 0 ? (
          <Card
            variant="glass"
            className="text-center py-16 flex flex-col items-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <div className="max-w-xs">
              <h3 className="text-2xl font-semibold text-slate-900 select-none">
                No groups yet
              </h3>
              <p className="text-gray-600 mt-2">
                Create your first group to start tracking expenses with friends.
              </p>
            </div>
            <button
              onClick={onShowCreateGroup}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-7 rounded-lg shadow-lg transition-all duration-200 select-none"
              type="button"
              aria-label="Get started by creating a group"
            >
              Get Started
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {groups.map((group) => {
              const balanceStatus = getBalanceStatus(group);
              const variant = getGroupVariant(group);

              return (
                <Card
                  key={group._id}
                  variant={variant}
                  className="relative cursor-pointer overflow-hidden p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => onGroupSelect(group)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

                  <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-7 relative z-10">
                      <div className="space-y-1 max-w-[70%]">
                        <h3 className="font-bold text-2xl text-slate-900 truncate select-text">
                          {group.name}
                        </h3>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold select-none ${balanceStatus.bg} ${balanceStatus.color}`}
                        >
                          {balanceStatus.text}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLogExpenseForGroup(group);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          aria-label={`Log expense for ${group.name}`}
                          type="button"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteGroup(group);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
                          aria-label={`Delete ${group.name}`}
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="space-y-5 flex-grow relative z-10">
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl shadow-inner select-none">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-5 h-5 text-slate-500" />
                          <span className="text-base font-semibold text-slate-700">
                            Total Spent
                          </span>
                        </div>
                        <span className="text-xl font-semibold text-slate-900 select-text">
                          Rs. {group.summary?.totalCost?.toFixed(2) ?? "0.00"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl shadow-inner text-center select-none">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700">
                              Receivable
                            </span>
                          </div>
                          <span className="text-lg font-semibold text-emerald-800 select-text">
                            Rs.{" "}
                            {group.summary?.receivable?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>

                        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl shadow-inner text-center select-none">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <ArrowDownLeft className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-semibold text-red-700">
                              Payable
                            </span>
                          </div>
                          <span className="text-lg font-semibold text-red-800 select-text">
                            Rs. {group.summary?.payable?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom border indicator */}
                  <div
                    className={`h-1 w-full rounded-b-2xl ${
                      variant === "success"
                        ? "bg-gradient-to-r from-emerald-400 to-green-500"
                        : variant === "warning"
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                        : "bg-gradient-to-r from-slate-300 to-slate-400"
                    }`}
                  ></div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
