import React, { useState, useEffect, useMemo } from "react";
import { Card } from "./Card";
import { Plus, Trash2, X } from "lucide-react";
import type { Group, Expense, ExpenseItem, UserRef } from "../types";
import { toast } from "react-toastify";

interface AddExpenseModalProps {
  group: Group;
  onClose: () => void;
  onExpenseSubmit: (expense: Expense) => void;
  expenseToEdit: Expense | null;
}

const getUsername = (user: UserRef): string => {
  if (typeof user === "string") return user;
  if (user && typeof user === "object" && "username" in user)
    return user.username;
  return "";
};

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  group,
  onClose,
  onExpenseSubmit,
  expenseToEdit,
}) => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [restaurant, setRestaurant] = useState("");
  const [payer, setPayer] = useState<string>(getUsername(group.admin));

  const [items, setItems] = useState<ExpenseItem[]>([
    { _id: Date.now().toString(), name: "", cost: 0, sharedBy: [] },
  ]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  useEffect(() => {
    if (expenseToEdit) {
      setDate(expenseToEdit.date.split("T")[0]);
      setRestaurant(expenseToEdit.restaurant || "");
      setPayer(getUsername(expenseToEdit.payer) || getUsername(group.admin));

      const loadedItems = expenseToEdit.items.map((item, idx) => ({
        ...item,
        _id: item._id || (Date.now() + idx).toString(),
      }));
      setItems(loadedItems);
      setActiveItemId(loadedItems[0]?._id || null);
    } else {
      const firstId = Date.now().toString();
      setItems([{ _id: firstId, name: "", cost: 0, sharedBy: [] }]);
      setActiveItemId(firstId);
      setRestaurant("");
      setPayer(getUsername(group.admin));
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [expenseToEdit, group.admin]);

  const handleItemChange = (
    id: string,
    field: keyof ExpenseItem,
    value: any
  ) => {
    setItems(
      items.map((item) =>
        item._id === id
          ? { ...item, [field]: field === "cost" ? Number(value) : value }
          : item
      )
    );
  };

  const handleShareToggle = (memberName: string) => {
    if (!activeItemId) return;
    setItems(
      items.map((item) => {
        if (item._id === activeItemId) {
          const newSharedBy = item.sharedBy.includes(memberName)
            ? item.sharedBy.filter((m) => m !== memberName)
            : [...item.sharedBy, memberName];
          return { ...item, sharedBy: newSharedBy };
        }
        return item;
      })
    );
  };

  const addItemRow = () => {
    const newId = Date.now().toString();
    setItems([...items, { _id: newId, name: "", cost: 0, sharedBy: [] }]);
    setActiveItemId(newId);
  };

  const removeItemRow = (id: string) => {
    const newItems = items.filter((item) => item._id !== id);
    setItems(newItems);
    if (activeItemId === id) {
      setActiveItemId(newItems[0]?._id || null);
    }
  };

  const { billSplit, totalBill } = useMemo(() => {
    const split: Record<string, number> = {};
    let total = 0;

    group.members.forEach((m) => {
      const memberName = typeof m === "string" ? m : getUsername(m);
      if (memberName) split[memberName] = 0;
    });

    items.forEach((item) => {
      const cost = item.cost || 0;
      total += cost;
      if (cost > 0 && item.sharedBy.length > 0) {
        const shareCost = cost / item.sharedBy.length;
        item.sharedBy.forEach((member) => {
          split[member] = (split[member] || 0) + shareCost;
        });
      }
    });

    return { billSplit: split, totalBill: total };
  }, [items, group.members]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter(
      (i) => i.name.trim().length > 0 && i.cost > 0 && i.sharedBy.length > 0
    );

    // Allow submitting empty items array if editing existing expense (deleting all items)
    if (!expenseToEdit && validItems.length === 0) {
      toast.error("Please add at least one valid item before saving");
      return;
    }

    onExpenseSubmit({
      _id: expenseToEdit ? expenseToEdit._id : undefined,
      date,
      restaurant,
      payer,
      items: validItems,
      totalCost: validItems.reduce((sum, i) => sum + i.cost, 0),
    });
  };

  const activeItem = items.find((i) => i._id === activeItemId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-300">
          <h2 className="text-3xl font-extrabold text-gray-900 select-none">
            {expenseToEdit ? "Edit Expense" : "Log New Lunch Expense"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Close modal"
            type="button"
          >
            <X className="text-gray-800 w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-grow flex flex-col overflow-hidden"
        >
          {/* Top Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <input
              type="text"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              placeholder="Restaurant Name (optional)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            >
              <option value="" disabled>
                Bill Paid By...
              </option>
              {group.members.map((m) => {
                const memberName = typeof m === "string" ? m : getUsername(m);
                return (
                  <option key={memberName} value={memberName}>
                    {memberName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Main Content */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
            {/* Left: Items */}
            <div className="md:col-span-2 flex flex-col overflow-hidden border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-inner">
              <div className="flex-grow overflow-y-auto pr-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    onFocus={() => setActiveItemId(item._id)}
                    className={`p-3 rounded-lg flex items-center space-x-3 cursor-text transition-all duration-300 ${
                      activeItemId === item._id
                        ? "bg-white ring-2 ring-indigo-500 shadow-md"
                        : "bg-gray-100"
                    }`}
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(item._id, "name", e.target.value)
                      }
                      placeholder="e.g., 'Chicken Biryani'"
                      className="flex-grow px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                    <input
                      type="number"
                      value={item.cost || ""}
                      onChange={(e) =>
                        handleItemChange(item._id, "cost", e.target.value)
                      }
                      placeholder="Rs 0"
                      className="w-36 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none"
                      min={0}
                      step={0.01}
                    />
                    <button
                      type="button"
                      onClick={() => removeItemRow(item._id)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItemRow}
                className="mt-5 w-full border-2 border-dashed border-gray-400 text-gray-900 hover:bg-gray-200 font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Right: Share With */}
            <div className="flex flex-col rounded-lg bg-gray-50 p-6 border border-gray-300 shadow-inner">
              <h4 className="font-semibold text-center mb-4 text-gray-900 select-none">
                Share with:
              </h4>
              <div className="flex-grow overflow-y-auto space-y-3">
                {group.members.map((member) => {
                  const memberName =
                    typeof member === "string" ? member : getUsername(member);
                  const isSelected = activeItem?.sharedBy.includes(memberName);
                  return (
                    <button
                      key={memberName}
                      type="button"
                      disabled={!activeItem}
                      onClick={() => handleShareToggle(memberName)}
                      className={`w-full text-left p-3 rounded-lg font-semibold transition-colors duration-200 ease-in-out select-none ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      } ${
                        !activeItem
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      {memberName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-300 select-none">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Summary</h3>
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-inner">
              <span className="font-bold text-xl text-gray-900">
                Total Bill:
              </span>
              <span className="font-bold text-3xl text-indigo-700">
                Rs. {totalBill.toFixed(2)}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(billSplit).map(
                ([name, amount]) =>
                  amount > 0 && (
                    <div
                      key={name}
                      className="flex justify-between text-sm bg-white p-3 rounded shadow-sm border border-gray-200"
                    >
                      <span className="text-gray-900 font-medium truncate">
                        {name}:
                      </span>
                      <span className="font-semibold text-indigo-600">
                        Rs. {amount.toFixed(2)}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-auto pt-6">
            <button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold py-4 rounded-lg flex items-center justify-center space-x-3 shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-400"
            >
              <span>{expenseToEdit ? "Save Changes" : "Add Expense Log"}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
