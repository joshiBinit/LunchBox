import React, { useState } from "react";
import type { Group, Expense } from "../types";
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
  const sortedExpenses = [...group.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-blue-500 hover:underline mb-4 flex items-center space-x-1"
        >
          <ChevronDown className="w-4 h-4 transform -rotate-90" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {group.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Admin: {group.admin}
            </p>
          </div>
          <button
            onClick={onLogExpense}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                onClick={() => setActiveTab("receivable")}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === "receivable"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-500"
                }`}
              >
                Who Owes You
              </button>
              <button
                onClick={() => setActiveTab("payable")}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === "payable"
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-500"
                }`}
              >
                Who You Owe
              </button>
            </div>
            <div className="space-y-3">
              {activeTab === "receivable" &&
              (group.groupReceivables?.length ?? 0) > 0 ? (
                group.groupReceivables!.map((p) => (
                  <PersonListItem
                    key={p.id}
                    name={p.name}
                    amount={p.amount}
                    type="receivable"
                  />
                ))
              ) : activeTab === "receivable" ? (
                <p className="text-center text-gray-500 py-4">
                  No one in this group owes you.
                </p>
              ) : null}

              {activeTab === "payable" &&
              (group.groupPayables?.length ?? 0) > 0 ? (
                group.groupPayables!.map((p) => (
                  <PersonListItem
                    key={p.id}
                    name={p.name}
                    amount={p.amount}
                    type="payable"
                  />
                ))
              ) : activeTab === "payable" ? (
                <p className="text-center text-gray-500 py-4">
                  You don't owe anyone in this group.
                </p>
              ) : null}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Expense Log
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((exp) => {
                  const allSharers = Array.from(
                    new Set(exp.items.flatMap((item) => item.sharedBy))
                  );
                  return (
                    <div
                      key={exp.id}
                      className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
                            {exp.restaurant || "Lunch"} on{" "}
                            {new Date(exp.date).toLocaleDateString("en-GB", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Paid by: {exp.payer}
                          </p>
                          <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            {exp.items.map((item) => (
                              <div
                                key={item.id}
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
                          <p className="text-xl font-bold text-blue-500">
                            Rs. {exp.totalCost.toFixed(2)}
                          </p>
                          <button
                            onClick={() => onEditExpense(exp)}
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-1 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50"
                            aria-label="Edit expense"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                          Participants:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allSharers.map((m) => (
                            <span
                              key={m}
                              className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full"
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
                <p className="text-center text-gray-500 py-8">
                  No expenses logged yet.
                </p>
              )}
            </div>
          </Card>
        </div>
        <Card className="lg:col-span-1 self-start">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Members ({group.members.length})
          </h2>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div
                key={member}
                className="flex items-center space-x-3 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-gray-700 dark:text-white">
                  {member.charAt(0)}
                </div>
                <span className="text-gray-800 dark:text-gray-200">
                  {member}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="mt-4 text-blue-500 hover:text-blue-600 font-semibold flex items-center space-x-1"
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
