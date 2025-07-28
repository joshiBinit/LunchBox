import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Sparkles, Coffee, Star } from "lucide-react";
import { Modal } from "./Modal";
import { Input } from "../Input";
import { Button } from "../Button";
import { useAuth } from "../../contexts/AuthContext";
import { createGroup as apiCreateGroup } from "../../api/groupApi.ts"; // Make sure this exists!

interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreated: (group: any) => void; // Callback to notify parent about new group
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onGroupCreated,
}) => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth(); // Getting the JWT token from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (!token) {
      setError("You must be logged in");
      return;
    }

    setIsLoading(true);

    try {
      const group = await apiCreateGroup(groupName.trim(), token);
      onGroupCreated(group); // Notify parent component of new group
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create group. Please try again.");
      setIsLoading(false);
    }
  };

  const suggestions = [
    {
      icon: Coffee,
      name: "Team Lunch Squad",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Star,
      name: "Friday Food Club",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Sparkles,
      name: "Office Foodies",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Group" size="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="text-center relative">
          <div className="relative inline-block">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mb-6 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Group
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Start a new lunch group to track expenses and split bills with your
            team or friends.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Group Name Input */}
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
            <Input
              label="Group Name"
              value={groupName}
              onChange={setGroupName}
              placeholder="Enter your group name..."
              required
              error={error}
            />
          </div>

          {/* Name Suggestions */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-blue-600" />
              Need Inspiration?
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGroupName(suggestion.name)}
                  className="w-full flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${suggestion.color} rounded-lg flex items-center justify-center`}
                  >
                    <suggestion.icon size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {suggestion.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Group Features Preview */}
          <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What you'll get:
            </h3>
            <div className="space-y-3">
              {[
                "Track lunch expenses with your group",
                "Split bills automatically among members",
                "Keep history of all group meals",
                "Manage who owes what to whom",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature}
                  </span>
                </motion.div>
              ))}
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
                disabled={!groupName.trim()}
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                  groupName.trim()
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Creating Group..." : "Create Group"}
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};
