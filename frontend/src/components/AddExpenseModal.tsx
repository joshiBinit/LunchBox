import React, { useState, useEffect, useMemo } from "react";
import { Card } from "./Card";
import { Plus, Trash2, X } from "lucide-react";
import type { Group, Expense, ExpenseItem, UserRef } from "../types";

interface AddExpenseModalProps {
  group: Group;
  onClose: () => void;
  onExpenseSubmit: (expense: Expense) => void;
  expenseToEdit: Expense | null;
}

// Helper to get username string from UserRef union type
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
  // Initialize date to today or from edited expense
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [restaurant, setRestaurant] = useState("");
  const [payer, setPayer] = useState<string>(getUsername(group.admin));

  // Items state - use string _id for MongoDB IDs and temporary generated IDs
  const [items, setItems] = useState<ExpenseItem[]>([
    { _id: Date.now().toString(), name: "", cost: 0, sharedBy: [] },
  ]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  // Effect: When editing an existing expense or when group.admin changes, update form state
  useEffect(() => {
    if (expenseToEdit) {
      setDate(expenseToEdit.date.split("T")[0]);

      setRestaurant(expenseToEdit.restaurant || "");
      setPayer(getUsername(expenseToEdit.payer) || getUsername(group.admin));

      // Load items, ensuring each has _id string
      const loadedItems = expenseToEdit.items.map((item, idx) => ({
        ...item,
        _id: item._id || (Date.now() + idx).toString(),
      }));
      setItems(loadedItems);
      setActiveItemId(loadedItems[0]?._id || null);
    } else {
      const firstItemId = Date.now().toString();
      setItems([{ _id: firstItemId, name: "", cost: 0, sharedBy: [] }]);
      setActiveItemId(firstItemId);
      setRestaurant("");
      setPayer(getUsername(group.admin));
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [expenseToEdit, group.admin]);

  // Handle single item field change
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

  // Toggle member sharing on the active item
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

  // Add a new empty item row
  const addItemRow = () => {
    const newId = Date.now().toString();
    setItems([...items, { _id: newId, name: "", cost: 0, sharedBy: [] }]);
    setActiveItemId(newId);
  };

  // Remove item by id, adjust active item
  const removeItemRow = (id: string) => {
    const newItems = items.filter((item) => item._id !== id);
    setItems(newItems);
    if (activeItemId === id) {
      setActiveItemId(newItems[0]?._id || null);
    }
  };

  // Calculate total bill and split per group member
  const { billSplit, totalBill } = useMemo(() => {
    const split: Record<string, number> = {};
    let total = 0;

    // Initialize split amounts for all members (using usernames)
    group.members.forEach((m) => {
      const memberName = typeof m === "string" ? m : getUsername(m);
      if (memberName) split[memberName] = 0;
    });

    // Sum costs and split shares
    items.forEach((item) => {
      const cost = item.cost || 0;
      total += cost;
      if (cost > 0 && item.sharedBy.length > 0) {
        const shareCost = cost / item.sharedBy.length;
        item.sharedBy.forEach((member) => {
          // Defensive: member should be a string username
          split[member] = (split[member] || 0) + shareCost;
        });
      }
    });

    return { billSplit: split, totalBill: total };
  }, [items, group.members]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    const validItems = items.filter(
      (i) => i.name.trim().length > 0 && i.cost > 0 && i.sharedBy.length > 0
    );
    if (validItems.length === 0) {
      console.warn("No valid items to submit");
      return;
    }
    if (validItems.length > 0) {
      onExpenseSubmit({
        _id: expenseToEdit ? expenseToEdit._id : undefined,
        date,
        restaurant,
        payer,
        items: validItems.map((i) => {
          const itemPayload: any = {
            name: i.name.trim(),
            cost: i.cost,
            sharedBy: i.sharedBy,
          };
          // Only include _id if it's a valid ObjectId string (edit mode)
          if (expenseToEdit && i._id && /^[a-f\d]{24}$/i.test(i._id)) {
            itemPayload._id = i._id;
          }
          return itemPayload;
        }),
        totalCost: totalBill,
      });
    }
  };

  // Currently active item for sharing toggles
  const activeItem = items.find((i) => i._id === activeItemId);

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
          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            <div className="md:col-span-2 flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-2">
                {items.map((item) => (
                  <div
                    key={item._id}
                    onFocus={() => setActiveItemId(item._id)}
                    className={`p-3 rounded-lg flex items-center space-x-2 transition-all ${
                      activeItemId === item._id
                        ? "bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(item._id, "name", e.target.value)
                      }
                      placeholder="e.g., 'Chicken Biryani'"
                      className="flex-grow input-style"
                    />
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) =>
                        handleItemChange(item._id, "cost", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-32 input-style"
                      min={0}
                      step={0.01}
                    />
                    <button
                      type="button"
                      onClick={() => removeItemRow(item._id)}
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
                  const memberName =
                    typeof member === "string" ? member : getUsername(member);
                  const isSelected = activeItem?.sharedBy.includes(memberName);
                  return (
                    <button
                      key={memberName}
                      type="button"
                      disabled={!activeItem}
                      onClick={() => handleShareToggle(memberName)}
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
                      {memberName}
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
