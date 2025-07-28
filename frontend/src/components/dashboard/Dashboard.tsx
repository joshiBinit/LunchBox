import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, UtensilsCrossed, TrendingUp } from "lucide-react";
import RupeeIcon from "../icons/Rupee";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../Button";
import { StatsCard } from "./StatsCard";
import { GroupCard } from "./GroupCard";
import { CreateGroupModal } from "../modals/CreateGroupModal";
import { GroupDetailsModal } from "../modals/GroupDetailsModal";
import { getMyGroups } from "../../api/groupApi";

export const Dashboard: React.FC = () => {
  useAuth();
  const token = localStorage.getItem("lunchTracker_token"); // or extend your AuthContext to expose token
  const [groups, setGroups] = useState<any[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!token) return;
        const data = await getMyGroups(token);
        setGroups(data);
      } catch (error) {
        console.error("Error loading groups:", error);
      }
    };

    fetchGroups();
  }, [token]);

  const totalSpent = groups.reduce(
    (sum, group) =>
      sum +
      (group.lunches?.reduce(
        (lunchSum: number, lunch: any) => lunchSum + lunch.totalAmount,
        0
      ) || 0),
    0
  );

  const totalLunches = groups.reduce(
    (sum, group) => sum + (group.lunches?.length || 0),
    0
  );

  const totalMembers = new Set(groups.flatMap((group) => group.members)).size;

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 1 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 1, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              🍽️ Lunch Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              Track your groups, members, and lunch expenses.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={20} />
              <span>Create Group</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total Spent"
              value={`Rs ${totalSpent.toFixed(2)}`}
              icon={RupeeIcon}
              color="blue"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Active Groups"
              value={groups.length.toString()}
              icon={Users}
              color="emerald"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total Lunches"
              value={totalLunches.toString()}
              icon={UtensilsCrossed}
              color="yellow"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total Members"
              value={totalMembers.toString()}
              icon={TrendingUp}
              color="red"
            />
          </motion.div>
        </motion.div>

        {/* Groups */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            🧑‍🤝‍🧑 Your Groups
          </h2>

          {groups.length === 0 ? (
            <motion.div
              initial={{ opacity: 1, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/50"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <UtensilsCrossed className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                No groups yet!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Start by creating your first lunch group 🍜
              </p>
              <Button
                onClick={() => setShowCreateGroup(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Your First Group
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {groups.map((group) => (
                <motion.div key={group._id} variants={itemVariants}>
                  <GroupCard
                    group={group}
                    onClick={() => setSelectedGroup(group._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Modals */}
        {showCreateGroup && (
          <CreateGroupModal
            onClose={() => setShowCreateGroup(false)}
            onGroupCreated={(newGroup) => {
              setGroups((prev) => [...prev, newGroup]);
              setShowCreateGroup(false);
            }}
          />
        )}
        {selectedGroup && (
          <GroupDetailsModal
            groupId={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        )}
      </div>
    </div>
  );
};
