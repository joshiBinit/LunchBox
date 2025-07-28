import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Users, Mail, Check } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { useApp } from "../../contexts/AppContext";

interface AddMemberModalProps {
  groupId: string;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  groupId,
  onClose,
}) => {
  const { users, groups, addMemberToGroup } = useApp();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const group = groups.find((g) => g.id === groupId);
  const availableUsers = users.filter(
    (user) => !group?.members.includes(user.id)
  );

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    addMemberToGroup(groupId, selectedUserId);
    setIsLoading(false);
    onClose();
  };

  const selectedUser = availableUsers.find(
    (user) => user.id === selectedUserId
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Group Member" size="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="text-center relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-lg">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Member
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Invite someone to join your lunch group and start splitting bills
            together.
          </p>
        </div>

        {availableUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Available Users
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              All registered users are already members of this group. New users
              need to register first before they can be invited.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* User Selection Section */}
            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-blue-600" />
                Select User to Add
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-lg"
              >
                <option value="">Choose a user to invite...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected User Preview */}
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Check size={20} className="text-emerald-600" />
                  Selected Member
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedUser.name}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail size={14} />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Available Users Count */}
            <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {availableUsers.length}
                </span>{" "}
                {availableUsers.length === 1 ? "user" : "users"} available to
                invite
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <Button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddMember}
                  disabled={!selectedUserId}
                  loading={isLoading}
                  className={`px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                    selectedUserId
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "Adding Member..." : "Add to Group"}
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </Modal>
  );
};
