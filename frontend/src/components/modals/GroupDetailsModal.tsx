import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Crown,
  Plus,
  DollarSign,
  Utensils,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "../Button";

import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { AddMemberModal } from "./AddMemberModal";
import { AddLunchModal } from "./AddLunchModal";
import { format } from "date-fns";

interface GroupDetailsModalProps {
  groupId: string;
  onClose: () => void;
}

export const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  groupId,
  onClose,
}) => {
  const { groups, getBalance, getUserById } = useApp();
  const { user } = useAuth();
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddLunch, setShowAddLunch] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "lunches" | "members"
  >("overview");

  const group = groups.find((g) => g.id === groupId);
  if (!group || !user) return null;

  const isAdmin = group.adminId === user.id;
  const balance = getBalance(groupId, user.id);

  const totalOwed = Object.values(balance.owedBy).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalOwes = Object.values(balance.owes).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const netBalance = totalOwed - totalOwes;

  const groupTotal = group.lunches.reduce(
    (sum, lunch) => sum + lunch.totalAmount,
    0
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: DollarSign },
    { id: "lunches", label: "Lunches", icon: Utensils },
    { id: "members", label: "Members", icon: Users },
  ] as const;

  return (
    <>
      <Modal isOpen={true} onClose={onClose} title={group.name} size="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="space-y-8"
        >
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {group.members.length}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Members
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {group.lunches.length}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Lunches
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                ${groupTotal.toFixed(2)}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Spent
              </div>
            </motion.div>
          </div>

          {/* Your Balance */}
          {netBalance !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-gradient-to-br backdrop-blur-sm rounded-2xl p-6 border ${
                netBalance > 0
                  ? "from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-700/50"
                  : "from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      netBalance > 0
                        ? "bg-gradient-to-br from-emerald-500 to-green-600"
                        : "bg-gradient-to-br from-red-500 to-rose-600"
                    }`}
                  >
                    {netBalance > 0 ? (
                      <TrendingUp className="w-6 h-6 text-white" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Balance
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {netBalance > 0
                        ? "Others owe you this amount"
                        : "You owe others this amount"}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    netBalance > 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {netBalance > 0 ? "+" : ""}${netBalance.toFixed(2)}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50"
          >
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex-1 justify-center ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Recent Activity
                    </h3>
                  </div>
                  {group.lunches.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Utensils className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Activity Yet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Start by adding your first lunch!
                      </p>
                    </motion.div>
                  ) : (
                    group.lunches
                      .slice(-5)
                      .reverse()
                      .map((lunch, index) => (
                        <motion.div
                          key={lunch.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                                <Utensils className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {lunch.restaurant}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {format(new Date(lunch.date), "MMM dd, yyyy")}{" "}
                                  • Paid by {getUserById(lunch.paidBy)?.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 dark:text-white text-xl">
                                ${lunch.totalAmount.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {lunch.items.length} items
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                  )}
                </div>
              )}

              {activeTab === "lunches" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      All Lunches
                    </h3>
                    {isAdmin && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setShowAddLunch(true)}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Lunch
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  {group.lunches.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Utensils className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Lunches Yet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        No lunches recorded yet
                      </p>
                    </motion.div>
                  ) : (
                    group.lunches.reverse().map((lunch, index) => (
                      <motion.div
                        key={lunch.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                                <Utensils className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {lunch.restaurant}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {format(
                                    new Date(lunch.date),
                                    "EEEE, MMM dd, yyyy"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 dark:text-white text-xl">
                                ${lunch.totalAmount.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Paid by {getUserById(lunch.paidBy)?.name}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                              <DollarSign size={16} className="text-blue-600" />
                              Items:
                            </h5>
                            <div className="space-y-3">
                              {lunch.items.map((item) => (
                                <div key={item.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                      {item.name}
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                      ${item.cost.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                                    {item.sharedBy.map((userId) => {
                                      const user = getUserById(userId);
                                      const individualShare =
                                        item.cost / item.sharedBy.length;
                                      return (
                                        <div
                                          key={userId}
                                          className="flex items-center justify-between text-sm bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg p-2"
                                        >
                                          <span className="text-gray-600 dark:text-gray-400">
                                            {user?.name}
                                          </span>
                                          <span className="font-medium text-gray-900 dark:text-white">
                                            ${individualShare.toFixed(2)}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "members" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Group Members
                    </h3>
                    {isAdmin && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setShowAddMember(true)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Member
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {group.members.map((memberId, index) => {
                      const member = getUserById(memberId);
                      const memberBalance = getBalance(groupId, memberId);
                      const memberNet =
                        Object.values(memberBalance.owedBy).reduce(
                          (sum, amount) => sum + amount,
                          0
                        ) -
                        Object.values(memberBalance.owes).reduce(
                          (sum, amount) => sum + amount,
                          0
                        );

                      return (
                        <motion.div
                          key={memberId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {member?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-3 mb-1">
                                  <span className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {member?.name}
                                  </span>
                                  {memberId === group.adminId && (
                                    <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                                      <Crown size={14} className="text-white" />
                                      <span className="text-xs font-semibold text-white">
                                        Admin
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {member?.email}
                                </span>
                              </div>
                            </div>
                            {memberNet !== 0 && (
                              <div className="text-right">
                                <div
                                  className={`text-xl font-bold ${
                                    memberNet > 0
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {memberNet > 0 ? "+" : ""}$
                                  {memberNet.toFixed(2)}
                                </div>
                                <div
                                  className={`text-xs font-medium ${
                                    memberNet > 0
                                      ? "text-emerald-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {memberNet > 0 ? "is owed" : "owes"}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Modal>

      {showAddMember && (
        <AddMemberModal
          groupId={groupId}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {showAddLunch && (
        <AddLunchModal
          groupId={groupId}
          onClose={() => setShowAddLunch(false)}
        />
      )}
    </>
  );
};
