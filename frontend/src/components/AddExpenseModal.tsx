import React, { useState, useEffect, useMemo } from "react";
import { Card } from "./Card";
import { Plus, Trash2, X } from "lucide-react";
import type { Group, Expense, ExpenseItem } from "../types";

interface AddExpenseModalProps {
  group: Group;
  onClose: () => void;
  onExpenseSubmit: (expense: Expense) => void;
  expenseToEdit: Expense | null;
}

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
  const [payer, setPayer] = useState(group.admin);
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: Date.now(), name: "", cost: 0, sharedBy: [] },
  ]);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  useEffect(() => {
    if (expenseToEdit) {
      setDate(expenseToEdit.date);
      setRestaurant(expenseToEdit.restaurant || "");
      setPayer(expenseToEdit.payer || group.admin);
      const loadedItems = expenseToEdit.items.map((item, index) => ({
        ...item,
        id: item.id || Date.now() + index,
      }));
      setItems(loadedItems);
      setActiveItemId(loadedItems[0]?.id || null);
    } else {
      const firstItemId = Date.now();
      setItems([{ id: firstItemId, name: "", cost: 0, sharedBy: [] }]);
      setActiveItemId(firstItemId);
      setRestaurant("");
      setPayer(group.admin);
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [expenseToEdit, group.admin]);

  const handleItemChange = (
    id: number,
    field: keyof ExpenseItem,
    value: any
  ) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "cost" ? Number(value) : value }
          : item
      )
    );
  };

  const handleShareToggle = (memberName: string) => {
    if (!activeItemId) return;
    setItems(
      items.map((item) => {
        if (item.id === activeItemId) {
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
    const newId = Date.now();
    setItems([...items, { id: newId, name: "", cost: 0, sharedBy: [] }]);
    setActiveItemId(newId);
  };

  const removeItemRow = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    if (activeItemId === id) {
      setActiveItemId(newItems[0]?.id || null);
    }
  };

  const { billSplit, totalBill } = useMemo(() => {
    const split: Record<string, number> = {};
    let total = 0;
    group.members.forEach((m) => (split[m] = 0));

    items.forEach((item) => {
      const cost = item.cost || 0;
      total += cost;
      if (cost > 0 && item.sharedBy.length > 0) {
        const shareCost = cost / item.sharedBy.length;
        item.sharedBy.forEach((member) => {
          split[member] += shareCost;
        });
      }
    });

    return { billSplit: split, totalBill: total };
  }, [items, group.members]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(
      (i) => i.name.trim() && i.cost > 0 && i.sharedBy.length > 0
    );
    if (validItems.length > 0) {
      onExpenseSubmit({
        id: expenseToEdit ? expenseToEdit.id : Date.now(),
        date,
        restaurant,
        payer,
        items: validItems.map((i) => ({
          id: i.id || Date.now(),
          name: i.name.trim(),
          cost: i.cost,
          sharedBy: i.sharedBy,
        })),
        totalCost: totalBill,
      });
    }
  };

  const activeItem = items.find((i) => i.id === activeItemId);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {expenseToEdit ? "Edit Expense" : "Log New Lunch Expense"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-grow flex flex-col overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              placeholder="Restaurant Name (optional)"
              className="w-full input-style"
            />
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full input-style"
            />
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full input-style"
            >
              <option value="" disabled>
                Bill Paid By...
              </option>
              {group.members.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            <div className="md:col-span-2 flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onFocus={() => setActiveItemId(item.id)}
                    className={`p-3 rounded-lg flex items-center space-x-2 transition-all ${
                      activeItemId === item.id
                        ? "bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(item.id, "name", e.target.value)
                      }
                      placeholder="e.g., 'Chicken Biryani'"
                      className="flex-grow input-style"
                    />
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) =>
                        handleItemChange(item.id, "cost", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-32 input-style"
                      min={0}
                      step={0.01}
                    />
                    <button
                      type="button"
                      onClick={() => removeItemRow(item.id)}
                      className="flex-shrink-0 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
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
                className="mt-4 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>
            <div className="flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-semibold text-center mb-2 text-gray-600 dark:text-gray-300">
                Share with:
              </h4>
              <div className="flex-grow overflow-y-auto space-y-2">
                {group.members.map((member) => {
                  const isSelected = activeItem?.sharedBy.includes(member);
                  return (
                    <button
                      key={member}
                      type="button"
                      disabled={!activeItem}
                      onClick={() => handleShareToggle(member)}
                      className={`w-full text-left p-2 rounded-lg font-medium transition-all duration-200 ease-in-out ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      } ${
                        !activeItem
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {member}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Summary</h3>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
              <span className="font-bold text-xl">Total Bill:</span>
              <span className="font-bold text-2xl text-blue-500">
                Rs. {totalBill.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(billSplit).map(([name, amount]) =>
                amount > 0 ? (
                  <div
                    key={name}
                    className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded"
                  >
                    <span>{name}:</span>
                    <span className="font-medium">Rs. {amount.toFixed(2)}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div className="mt-auto pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>{expenseToEdit ? "Save Changes" : "Add Expense Log"}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
