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
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-black hover:underline mb-4 flex items-center space-x-1 transition-colors"
          type="button"
        >
          <ChevronDown className="w-4 h-4 transform -rotate-90" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black">{group.name}</h1>
            <p className="text-gray-700">
              Admin: {getUsername(group.admin) || "Unknown"}
            </p>
          </div>
          <button
            onClick={onLogExpense}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 shadow-md"
            type="button"
          >
            <Plus className="w-5 h-5" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Date Filter UI */}
      <Card>
        <h2 className="text-lg font-semibold text-black mb-2">
          Filter by Date
        </h2>
        <div className="flex space-x-4 items-center">
          <label className="flex flex-col text-black font-medium text-sm">
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 p-1 border border-gray-300 rounded"
              max={endDate || undefined}
            />
          </label>
          <label className="flex flex-col text-black font-medium text-sm">
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 p-1 border border-gray-300 rounded"
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
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex border-b border-gray-300 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("receivable")}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === "receivable"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                Who Owes You
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payable")}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === "payable"
                    ? "border-b-2 border-red-700 text-red-700"
                    : "text-red-400 hover:text-red-700"
                }`}
              >
                Who You Owe
              </button>
            </div>
            <div className="space-y-3 min-h-[100px]">
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
                <p className="text-center text-gray-400 py-4">
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
                <p className="text-center text-red-400 py-4">
                  You don't owe anyone in this group.
                </p>
              ) : null}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4 text-black">Expense Log</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
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
                    <div key={exp._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg text-black">
                            {exp.restaurant || "Lunch"} on{" "}
                            {new Date(exp.date).toLocaleDateString("en-GB", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-700">
                            Paid by: {getUsername(exp.payer) || "Unknown"}
                          </p>
                          <div className="mt-2 space-y-1 text-sm text-gray-800">
                            {exp.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex justify-between w-full"
                              >
                                <p className="mr-4">{item.name}</p>
                                <p className="font-medium">
                                  Rs. {item.cost.toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-xl font-bold text-black">
                            Rs. {exp.totalCost.toFixed(2)}
                          </p>
                          <button
                            type="button"
                            onClick={() => onEditExpense(exp)}
                            className="text-black hover:text-gray-700 mt-1 p-1 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Edit expense"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Participants:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allSharers.map((m) => (
                            <span
                              key={m}
                              className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full"
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
                <p className="text-center text-gray-400 py-8">
                  No expenses logged yet.
                </p>
              )}
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-1 self-start">
          <h2 className="text-xl font-bold mb-4 text-black">
            Members ({group.members.length})
          </h2>
          <div className="space-y-2">
            {group.members.map((member) => {
              const username = getUsername(member);
              return (
                <div
                  key={username || Math.random()}
                  className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center font-semibold text-black">
                    {username.charAt(0)}
                  </div>
                  <span className="text-black">{username}</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="mt-4 text-black hover:text-gray-700 font-semibold flex items-center space-x-1 transition-colors"
          >
            <span>{isAddingMember ? "Cancel" : "Add Member"}</span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                isAddingMember ? "rotate-90" : ""
              }`}
            />
          </button>

          {isAddingMember && (
            <AddMemberComponent
              onAddMember={(name) => {
                onAddMember(name);
                setIsAddingMember(false);
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};
