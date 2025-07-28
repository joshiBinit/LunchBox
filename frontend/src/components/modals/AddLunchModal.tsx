import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Users,
} from "lucide-react";
import { Modal } from "./Modal";
import { Input } from "../Input";
import { Button } from "../Button";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import type { FoodItem } from "../../contexts/AppContext";

interface AddLunchModalProps {
  groupId: string;
  onClose: () => void;
}

export const AddLunchModal: React.FC<AddLunchModalProps> = ({
  groupId,
  onClose,
}) => {
  const { groups, addLunch, getUserById } = useApp();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<Omit<FoodItem, "id">[]>([
    { name: "", cost: 0, sharedBy: [] },
  ]);
  const [paidBy, setPaidBy] = useState(user?.id || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;

  const addItem = () => {
    setItems([...items, { name: "", cost: 0, sharedBy: [] }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof Omit<FoodItem, "id">,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const toggleMemberForItem = (itemIndex: number, memberId: string) => {
    const newItems = [...items];
    const currentSharedBy = newItems[itemIndex].sharedBy;

    if (currentSharedBy.includes(memberId)) {
      newItems[itemIndex].sharedBy = currentSharedBy.filter(
        (id) => id !== memberId
      );
    } else {
      newItems[itemIndex].sharedBy = [...currentSharedBy, memberId];
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!restaurant.trim()) {
      setError("Restaurant name is required");
      return;
    }

    if (
      items.length === 0 ||
      items.some((item) => !item.name.trim() || item.cost <= 0)
    ) {
      setError("All items must have a name and cost greater than 0");
      return;
    }

    if (items.some((item) => item.sharedBy.length === 0)) {
      setError("Each item must be shared by at least one person");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const totalAmount = items.reduce((sum, item) => sum + item.cost, 0);
    const itemsWithIds = items.map((item) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    }));

    addLunch(groupId, {
      date,
      restaurant: restaurant.trim(),
      totalAmount,
      items: itemsWithIds,
      paidBy,
    });

    setIsLoading(false);
    onClose();
  };

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Lunch" size="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="text-center relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl mb-6 shadow-lg">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Record New Lunch
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Add lunch details and split the bill among your group members
            effortlessly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              Lunch Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Input
                  label="Restaurant"
                  value={restaurant}
                  onChange={setRestaurant}
                  placeholder="e.g., Pizza Palace"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={setDate}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payer Section */}
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-600" />
              Who Paid?
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 font-medium"
              required
            >
              {group.members.map((memberId) => {
                const member = getUserById(memberId);
                return (
                  <option key={memberId} value={memberId}>
                    {member?.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Food Items Section */}
          <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Utensils size={20} className="text-amber-600" />
                Food Items
              </h3>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
                >
                  <Plus size={16} />
                  Add Item
                </Button>
              </motion.div>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <Input
                        label="Item Name"
                        value={item.name}
                        onChange={(value) => updateItem(index, "name", value)}
                        placeholder="e.g., Large Pepperoni Pizza"
                        required
                      />
                    </div>
                    <div className="w-36">
                      <Input
                        label="Cost ($)"
                        type="number"
                        value={item.cost.toString()}
                        onChange={(value) =>
                          updateItem(index, "cost", parseFloat(value) || 0)
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {items.length > 1 && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="mt-6"
                      >
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      Shared By
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((memberId) => {
                        const member = getUserById(memberId);
                        const isSelected = item.sharedBy.includes(memberId);

                        return (
                          <motion.button
                            key={memberId}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleMemberForItem(index, memberId)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                            }`}
                          >
                            {member?.name}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200 dark:border-red-800 rounded-2xl"
            >
              <p className="text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-300"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                loading={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "Adding Lunch..." : "Add Lunch"}
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};
