import React from "react";
import { motion } from "framer-motion";
import { Users, Crown, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import type { Group } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { Card } from "../Card";

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  const { user } = useAuth();
  const { getBalance } = useApp();

  const isAdmin = group.adminId === user?.id;
  const balance = user
    ? getBalance(group.id, user.id)
    : { owes: {}, owedBy: {} };

  const totalOwed = Object.values(balance.owedBy).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalOwes = Object.values(balance.owes).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const netBalance = totalOwed - totalOwes;

  const recentLunches = group.lunches?.slice(-3) ?? [];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 p-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {group.name}
                  </h3>
                  {isAdmin && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-1 mt-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-sm"
                    >
                      <Crown size={12} className="text-white" />
                      <span className="text-xs font-semibold text-white">
                        Admin
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users
                      size={12}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <span className="font-medium">
                    {Array.isArray(group.members) ? group.members.length : 0}{" "}
                    members
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <Calendar
                      size={12}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <span className="font-medium">
                    {Array.isArray(group.lunches) ? group.lunches.length : 0}{" "}
                    orders
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Section */}
          {netBalance !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      netBalance > 0
                        ? "bg-gradient-to-r from-emerald-500 to-green-600"
                        : "bg-gradient-to-r from-red-500 to-pink-600"
                    }`}
                  >
                    {netBalance > 0 ? (
                      <TrendingUp size={16} className="text-white" />
                    ) : (
                      <TrendingDown size={16} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Your Balance
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-lg font-bold ${
                        netBalance > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ${Math.abs(netBalance).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {netBalance > 0 ? "owed to you" : "you owe"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Lunches */}
          {recentLunches.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded opacity-60"></div>
                <span>Recent Orders</span>
              </h4>
              <div className="space-y-2">
                {recentLunches.map((lunch, index) => (
                  <motion.div
                    key={lunch.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {lunch.restaurant.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {lunch.restaurant}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${lunch.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
      </Card>
    </motion.div>
  );
};
