import React, { useState } from "react";
import type { Group, Expense, UserRef } from "../types";
import { Card } from "./Card";
import { PersonListItem } from "./PersonListItem";
import { AddMemberComponent } from "./AddMemberComponent";
import { Plus, Edit, ChevronDown, ChevronRight } from "lucide-react";

interface GroupViewProps {
  group: Group;
  onBack: () => void;
  onUpdateGroup: (group: Group) => void;
  onAddMember: (memberName: string) => void;
  onLogExpense: () => void;
  onEditExpense: (expense: Expense) => void;
}

const getUsername = (user: UserRef): string => {
  if (!user) return "";
  if (typeof user === "string") return user;
  if ("username" in user && typeof user.username === "string")
    return user.username;
  return "";
};

export const GroupView: React.FC<GroupViewProps> = ({
  group,
  onBack,
  onAddMember,
  onLogExpense,
  onEditExpense,
}) => {
  const [activeTab, setActiveTab] = useState<"receivable" | "payable">(
    "receivable"
  );
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Date filter states
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const sortedExpenses = [...(group.expenses ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter expenses by selected date range
  const filteredExpenses = sortedExpenses.filter((exp) => {
    const expenseDate = new Date(exp.date).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    if (start !== null && expenseDate < start) return false;
    if (end !== null && expenseDate > end) return false;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition text-sm sm:text-base"
          type="button"
          aria-label="Back to Dashboard"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transform -rotate-90" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 space-y-3 sm:space-y-0 gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight break-words">
              {group.name}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base truncate">
              Admin:{" "}
              <span className="font-semibold">
                {getUsername(group.admin) || "Unknown"}
              </span>
            </p>
          </div>
          <button
            onClick={onLogExpense}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg transition text-sm sm:text-base whitespace-nowrap"
            type="button"
            aria-label="Log Expense"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="bg-white shadow-lg border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 border-b border-gray-200 pb-2">
          Filter by Date
        </h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 lg:space-x-6 space-y-3 sm:space-y-0 items-stretch sm:items-center">
          <label className="flex flex-col text-gray-700 font-semibold text-xs sm:text-sm w-full sm:w-auto sm:flex-1 lg:flex-initial">
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 p-2 sm:p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              max={endDate || undefined}
            />
          </label>
          <label className="flex flex-col text-gray-700 font-semibold text-xs sm:text-sm w-full sm:w-auto sm:flex-1 lg:flex-initial">
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-2 p-2 sm:p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              min={startDate || undefined}
            />
          </label>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="mt-2 sm:mt-6 px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold shadow transition text-sm sm:text-base whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Expenses and Receivables/Payables */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          <Card className="bg-white shadow-lg border border-gray-200">
            {/* Tabs */}
            <div className="flex border-b border-gray-300 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("receivable")}
                className={`py-2.5 sm:py-3 px-3 sm:px-6 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
                  activeTab === "receivable"
                    ? "border-b-4 border-indigo-600 text-indigo-700"
                    : "text-gray-400 hover:text-indigo-600"
                }`}
              >
                Who Owes You
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payable")}
                className={`py-2.5 sm:py-3 px-3 sm:px-6 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
                  activeTab === "payable"
                    ? "border-b-4 border-red-600 text-red-600"
                    : "text-red-400 hover:text-red-600"
                }`}
              >
                Who You Owe
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 min-h-[120px] p-3 sm:p-4 lg:p-6">
              {activeTab === "receivable" &&
              group.groupReceivables &&
              group.groupReceivables.length > 0 ? (
                group.groupReceivables.map((p) => (
                  <PersonListItem
                    key={p.id}
                    name={p.name}
                    amount={p.amount}
                    type="receivable"
                    id=""
                  />
                ))
              ) : activeTab === "receivable" ? (
                <p className="text-center text-gray-400 italic py-4 sm:py-6 text-sm sm:text-base">
                  No one in this group owes you.
                </p>
              ) : null}

              {activeTab === "payable" &&
              group.groupPayables &&
              group.groupPayables.length > 0 ? (
                group.groupPayables.map((p) => (
                  <PersonListItem
                    key={p.id}
                    name={p.name}
                    amount={p.amount}
                    type="payable"
                    id=""
                  />
                ))
              ) : activeTab === "payable" ? (
                <p className="text-center text-red-400 italic py-4 sm:py-6 text-sm sm:text-base">
                  You don't owe anyone in this group.
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 border-b border-gray-300 pb-3">
              Expense Log
            </h2>
            <div className="space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-3 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => {
                  const allSharers = Array.from(
                    new Set(
                      (exp.items ?? [])
                        .flatMap((item) =>
                          Array.isArray(item.sharedBy)
                            ? item.sharedBy.map((u: UserRef) =>
                                typeof u === "string" ? u : u?.username || ""
                              )
                            : []
                        )
                        .filter(Boolean)
                    )
                  );

                  return (
                    <div
                      key={exp._id}
                      className="p-3 sm:p-4 lg:p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-base sm:text-lg text-gray-900 break-words">
                            {exp.restaurant || "Lunch"} on{" "}
                            {new Date(exp.date).toLocaleDateString("en-GB", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Paid by:{" "}
                            <span className="font-medium">
                              {getUsername(exp.payer) || "Unknown"}
                            </span>
                          </p>
                          <div className="mt-2 sm:mt-3 space-y-1 text-xs sm:text-sm text-gray-800">
                            {exp.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex justify-between w-full border-b border-gray-100 last:border-0 py-1 gap-2"
                              >
                                <p className="truncate flex-1 min-w-0">
                                  {item.name}
                                </p>
                                <p className="font-medium flex-shrink-0">
                                  Rs. {item.cost.toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-0 flex-shrink-0">
                          <p className="text-xl sm:text-2xl font-extrabold text-gray-900">
                            Rs. {exp.totalCost.toFixed(2)}
                          </p>
                          <button
                            type="button"
                            onClick={() => onEditExpense(exp)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition flex-shrink-0"
                            aria-label={`Edit expense ${
                              exp.restaurant || "Lunch"
                            }`}
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-2 tracking-wide">
                          Participants
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {allSharers.map((m) => (
                            <span
                              key={m}
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-full font-semibold break-all"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 italic py-8 sm:py-12 text-sm sm:text-base">
                  No expenses logged yet.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Members Sidebar */}
        <Card className="bg-white shadow-lg border border-gray-200 lg:sticky lg:top-6 max-h-none lg:max-h-[calc(100vh-72px)] overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 border-b border-gray-300 pb-3">
            Members ({group.members.length})
          </h2>
          <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
            {group.members.map((member) => {
              const username = getUsername(member);
              return (
                <div
                  key={username || Math.random()}
                  className="flex items-center space-x-3 sm:space-x-4 p-2.5 sm:p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-indigo-50 transition"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-300 flex items-center justify-center font-bold text-white uppercase select-none text-sm sm:text-base flex-shrink-0">
                    {username.charAt(0)}
                  </div>
                  <span className="text-gray-900 font-semibold truncate text-sm sm:text-base flex-1 min-w-0">
                    {username}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="mt-4 sm:mt-6 w-full inline-flex justify-center items-center space-x-2 border-2 border-indigo-600 text-indigo-600 font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-indigo-600 hover:text-white transition focus:ring-4 focus:ring-indigo-300 text-sm sm:text-base"
          >
            <span>{isAddingMember ? "Cancel" : "Add Member"}</span>
            <ChevronRight
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                isAddingMember ? "rotate-90" : ""
              }`}
            />
          </button>

          {isAddingMember && (
            <div className="mt-3 sm:mt-4">
              <AddMemberComponent
                onAddMember={(name) => {
                  onAddMember(name);
                  setIsAddingMember(false);
                }}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
