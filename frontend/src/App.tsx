import React, { useState, useMemo } from "react";
import type { Group, Expense } from "./types";
import { Dashboard } from "./components/Dashboard";
import { GroupView } from "./components/GroupView";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { Card } from "./components/Card";
import { Plus, X } from "lucide-react";
import { calculateAllBalances } from "./utils";
import { LoginPage } from "./components/LoginPage";

// Initial mock groups data
const initialGroups: Group[] = [
  {
    id: 1,
    name: "Engineering Team",
    admin: "You",
    members: ["You", "Alice", "Bob", "Eve", "Grace", "Henry"],
    expenses: [
      {
        id: 1,
        date: "2025-07-28",
        restaurant: "Pizza Heaven",
        payer: "You",
        items: [
          {
            id: 101,
            name: "Chicken Pizza",
            cost: 1200.0,
            sharedBy: ["You", "Alice", "Bob"],
          },
          {
            id: 102,
            name: "Momo Platter",
            cost: 800.0,
            sharedBy: ["You", "Eve"],
          },
        ],
        totalCost: 2000.0,
      },
      {
        id: 2,
        date: "2025-07-27",
        restaurant: "Sushi Central",
        payer: "Alice",
        items: [
          {
            id: 201,
            name: "Sushi Set",
            cost: 5500.0,
            sharedBy: ["You", "Eve", "Alice"],
          },
        ],
        totalCost: 5500.0,
      },
    ],
  },
  {
    id: 2,
    name: "Marketing Crew",
    admin: "You",
    members: ["You", "Charlie", "Frank"],
    expenses: [
      {
        id: 3,
        date: "2025-07-26",
        restaurant: "Taco Town",
        payer: "Charlie",
        items: [
          {
            id: 301,
            name: "Tacos",
            cost: 2550.0,
            sharedBy: ["You", "Charlie"],
          },
        ],
        totalCost: 2550.0,
      },
    ],
  },
];

const CreateGroupModal: React.FC<{
  onClose: () => void;
  onGroupCreate: (name: string) => void;
}> = ({ onClose, onGroupCreate }) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) onGroupCreate(groupName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Group</h2>
          <button onClick={onClose} aria-label="Close create group modal">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., 'Lunch Buddies'"
            className="w-full p-2 rounded border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
          >
            <Plus />
            <span>Create Group</span>
          </button>
        </form>
      </Card>
    </div>
  );
};

export default function App() {
  // Track logged-in username or null when logged out
  const [user, setUser] = useState<string | null>(null);

  const [view, setView] = useState<"dashboard" | "group">("dashboard");
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [expenseModalState, setExpenseModalState] = useState<{
    isOpen: boolean;
    group: Group | null;
    expenseToEdit: Expense | null;
  }>({ isOpen: false, group: null, expenseToEdit: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    group: Group | null;
  }>({
    isOpen: false,
    group: null,
  });

  const { processedGroups, overallSummary } = useMemo(
    () => calculateAllBalances(groups),
    [groups]
  );

  const handleGroupSelect = (group: Group) => {
    const selectedGroup =
      processedGroups.find((g) => g.id === group.id) || null;
    setActiveGroup(selectedGroup);
    setView("group");
  };

  const handleCreateGroup = (groupName: string) => {
    const newGroup: Group = {
      id: Date.now(),
      name: groupName,
      admin: "You",
      members: ["You"],
      expenses: [],
    };
    setGroups([newGroup, ...groups]);
    setIsCreatingGroup(false);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    const newGroups = groups.map((g) =>
      g.id === updatedGroup.id ? updatedGroup : g
    );
    setGroups(newGroups);
    const newActiveGroup =
      calculateAllBalances(newGroups).processedGroups.find(
        (g) => g.id === updatedGroup.id
      ) || null;
    if (activeGroup && activeGroup.id === updatedGroup.id) {
      setActiveGroup(newActiveGroup);
    }
  };

  const handleAddMemberToGroup = (memberName: string) => {
    if (!activeGroup) return;
    if (activeGroup.members.includes(memberName)) {
      console.log("Member already exists");
      return;
    }
    const updatedGroup = {
      ...activeGroup,
      members: [...activeGroup.members, memberName],
    };
    handleUpdateGroup(updatedGroup);
  };

  const openNewExpenseModal = (group: Group) =>
    setExpenseModalState({ isOpen: true, group: group, expenseToEdit: null });
  const openEditExpenseModal = (group: Group, expense: Expense) =>
    setExpenseModalState({
      isOpen: true,
      group: group,
      expenseToEdit: expense,
    });

  const handleExpenseSubmit = (expenseData: Expense) => {
    const { group } = expenseModalState;
    if (!group) return;

    const isEditing = !!expenseModalState.expenseToEdit;
    const updatedExpenses = isEditing
      ? group.expenses.map((exp) =>
          exp.id === expenseData.id ? expenseData : exp
        )
      : [expenseData, ...group.expenses];
    handleUpdateGroup({ ...group, expenses: updatedExpenses });
    setExpenseModalState({ isOpen: false, group: null, expenseToEdit: null });
  };

  const handleDeleteRequest = (group: Group) => {
    setDeleteConfirmation({ isOpen: true, group });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.group) {
      setGroups(groups.filter((g) => g.id !== deleteConfirmation.group!.id));
      if (activeGroup && activeGroup.id === deleteConfirmation.group.id) {
        setActiveGroup(null);
        setView("dashboard");
      }
    }
    setDeleteConfirmation({ isOpen: false, group: null });
  };

  const renderView = () => {
    if (view === "group" && activeGroup)
      return (
        <GroupView
          group={activeGroup}
          onBack={() => setView("dashboard")}
          onUpdateGroup={handleUpdateGroup}
          onAddMember={handleAddMemberToGroup}
          onLogExpense={() => openNewExpenseModal(activeGroup)}
          onEditExpense={(expense) =>
            openEditExpenseModal(activeGroup, expense)
          }
        />
      );

    return (
      <Dashboard
        groups={processedGroups}
        summary={overallSummary}
        onGroupSelect={handleGroupSelect}
        onShowCreateGroup={() => setIsCreatingGroup(true)}
        onLogExpenseForGroup={openNewExpenseModal}
        onDeleteGroup={handleDeleteRequest}
      />
    );
  };

  // If user not logged in, show LoginPage only
  if (!user) {
    return <LoginPage onLogin={(username) => setUser(username)} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100 relative">
      {/* Logout button */}
      <button
        onClick={() => {
          setUser(null);
          // On logout, reset view and active group too for safety
          setView("dashboard");
          setActiveGroup(null);
        }}
        className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded shadow-lg transition"
        aria-label="Logout"
      >
        Logout
      </button>

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>

      {isCreatingGroup && (
        <CreateGroupModal
          onClose={() => setIsCreatingGroup(false)}
          onGroupCreate={handleCreateGroup}
        />
      )}

      {expenseModalState.isOpen && expenseModalState.group && (
        <AddExpenseModal
          group={expenseModalState.group}
          onClose={() =>
            setExpenseModalState({
              isOpen: false,
              group: null,
              expenseToEdit: null,
            })
          }
          onExpenseSubmit={handleExpenseSubmit}
          expenseToEdit={expenseModalState.expenseToEdit}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, group: null })}
        onConfirm={confirmDelete}
        groupName={deleteConfirmation.group?.name}
      />
    </div>
  );
}
