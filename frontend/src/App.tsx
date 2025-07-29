import React, { useState, useEffect, useMemo } from "react";
import type { Group, Expense, UserRef } from "./types";
import { Dashboard } from "./components/Dashboard";
import { GroupView } from "./components/GroupView";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { Card } from "./components/Card";
import { Plus, X } from "lucide-react";
import { calculateAllBalances } from "./utils";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import {
  login as apiLogin,
  signup as apiSignup,
  fetchGroups,
  createGroup as apiCreateGroup,
  deleteGroup as apiDeleteGroup,
  addMember as apiAddMember,
  addExpense as apiAddExpense,
  editExpense as apiEditExpense,
  fetchGroupById,
  setAuthToken,
} from "./api";

type User = { username: string; token: string };

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
  // Auth and UI state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showSignUp, setShowSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data and view states
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [view, setView] = useState<"dashboard" | "group">("dashboard");
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [expenseModalState, setExpenseModalState] = useState<{
    isOpen: boolean;
    group: Group | null;
    expenseToEdit: Expense | null;
  }>({ isOpen: false, group: null, expenseToEdit: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    group: Group | null;
  }>({ isOpen: false, group: null });

  // Set auth token and load groups on user change
  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
      localStorage.setItem("user", JSON.stringify(user));
      loadGroups();
    } else {
      setAuthToken(null);
      localStorage.removeItem("user");
      setGroups([]);
      setActiveGroup(null);
      setView("dashboard");
    }
  }, [user]);

  // Load groups from backend
  const loadGroups = async () => {
    setLoadingGroups(true);
    setError(null);
    try {
      const groupsData = await fetchGroups();
      setGroups(groupsData);
      setActiveGroup(null);
      setView("dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  // Load full group details including expenses, then calculate balances
  const loadGroupById = async (groupId: string) => {
    setLoadingGroups(true);
    setError(null);
    try {
      if (!user) throw new Error("User is not logged in");

      const groupData = await fetchGroupById(groupId);
      const { processedGroups } = calculateAllBalances(
        [groupData],
        user.username
      );
      setActiveGroup(processedGroups[0]);
      setView("group");
    } catch (err) {
      setError((err as Error).message || "Failed to load group");
    } finally {
      setLoadingGroups(false);
    }
  };

  // Login handler
  const handleLogin = async (username: string, password: string) => {
    setError(null);
    try {
      const data = await apiLogin(username, password);
      setUser({ username: data.user.username, token: data.token });
    } catch (err) {
      setError((err as Error).message || "Login failed");
      throw err;
    }
  };

  // Signup handler
  const handleSignUp = async (
    username: string,
    email: string,
    password: string
  ) => {
    setError(null);
    try {
      await apiSignup(username, email, password);
      setShowSignUp(false);
    } catch (err) {
      setError((err as Error).message || "Signup failed");
      throw err;
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setError(null);
  };

  // Handle group selection: load group data and balances
  const handleGroupSelect = (group: Group) => {
    loadGroupById(group._id);
  };

  // Create new group handler
  const handleCreateGroup = async (groupName: string) => {
    try {
      if (!user) throw new Error("Unauthorized");
      const newGroup = await apiCreateGroup(groupName, user.username);
      setGroups([newGroup, ...groups]);
      setIsCreatingGroup(false);
    } catch (err) {
      setError((err as Error).message || "Failed to create group");
    }
  };

  // Update group in local state and activeGroup state if relevant
  const updateGroupLocally = (updatedGroup: Group) => {
    setGroups((prev) =>
      prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g))
    );
    if (activeGroup?._id === updatedGroup._id) {
      setActiveGroup(updatedGroup);
    }
  };

  // Add member to the group
  const handleAddMemberToGroup = async (memberName: string) => {
    if (!activeGroup) return;

    if (
      activeGroup.members.some(
        (m: UserRef) => (typeof m === "string" ? m : m.username) === memberName
      )
    ) {
      setError("Member already exists");
      return;
    }
    try {
      await apiAddMember(activeGroup._id!, memberName);
      const updatedGroup = {
        ...activeGroup,
        members: [...activeGroup.members, memberName],
      };
      updateGroupLocally(updatedGroup);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to add member");
    }
  };

  // Delete group handler
  const handleDeleteGroup = async (group: Group) => {
    try {
      await apiDeleteGroup(group._id!);
      setGroups((prev) => prev.filter((g) => g._id !== group._id));
      if (activeGroup?._id === group._id) {
        setActiveGroup(null);
        setView("dashboard");
      }
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to delete group");
    }
  };

  // Add or edit expense, then recalc balances and update group state
  const handleExpenseSubmit = async (expenseData: Expense) => {
    if (!expenseModalState.group || !user) return;

    try {
      const groupId = expenseModalState.group._id!;
      let updatedExpense: Expense;

      if (expenseModalState.expenseToEdit) {
        // Edit expense
        const expenseId = expenseModalState.expenseToEdit._id!;
        updatedExpense = await apiEditExpense(groupId, expenseId, expenseData);
      } else {
        // Add new expense
        updatedExpense = await apiAddExpense(groupId, expenseData);
      }

      // Update group's expenses array immutably
      const updatedGroup = { ...expenseModalState.group };

      const idx = updatedGroup.expenses.findIndex(
        (e) => e._id === updatedExpense._id
      );

      if (idx > -1) {
        updatedGroup.expenses[idx] = updatedExpense;
      } else {
        updatedGroup.expenses = [updatedExpense, ...updatedGroup.expenses];
      }

      // Calculate balances with updated data
      const { processedGroups } = calculateAllBalances(
        [updatedGroup],
        user.username
      );
      const processedGroup = processedGroups[0];

      // Update state with processed group data
      updateGroupLocally(processedGroup);

      // Close modal and clear
      setExpenseModalState({ isOpen: false, group: null, expenseToEdit: null });
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to submit expense");
    }
  };

  // Compute summary for dashboard balances dynamically
  const { processedGroups, overallSummary } = useMemo(() => {
    if (!user) {
      return {
        processedGroups: [],
        overallSummary: {
          totalGroups: 0,
          totalSpent: 0,
          totalReceivable: 0,
          totalPayable: 0,
        },
      };
    }
    return calculateAllBalances(groups, user.username);
  }, [groups, user]);

  // Render main view depending on current UI state
  const renderView = () => {
    if (view === "group" && activeGroup) {
      return (
        <GroupView
          group={activeGroup}
          onBack={() => setView("dashboard")}
          onUpdateGroup={updateGroupLocally}
          onAddMember={handleAddMemberToGroup}
          onLogExpense={() =>
            setExpenseModalState({
              isOpen: true,
              group: activeGroup,
              expenseToEdit: null,
            })
          }
          onEditExpense={(expense) =>
            setExpenseModalState({
              isOpen: true,
              group: activeGroup,
              expenseToEdit: expense,
            })
          }
        />
      );
    }
    return (
      <Dashboard
        groups={processedGroups}
        summary={overallSummary}
        onGroupSelect={handleGroupSelect}
        onShowCreateGroup={() => setIsCreatingGroup(true)}
        onLogExpenseForGroup={(group) =>
          setExpenseModalState({ isOpen: true, group, expenseToEdit: null })
        }
        onDeleteGroup={(group) =>
          setDeleteConfirmation({ isOpen: true, group })
        }
      />
    );
  };

  if (!user) {
    return showSignUp ? (
      <SignUpPage
        onSignUp={handleSignUp}
        errorMessage={error ?? undefined}
        onSwitchToLogin={() => {
          setShowSignUp(false);
          setError(null);
        }}
      />
    ) : (
      <LoginPage
        onLogin={handleLogin}
        errorMessage={error ?? undefined}
        onSwitchToSignUp={() => {
          setShowSignUp(true);
          setError(null);
        }}
      />
    );
  }

  return (
    <div
      className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100 relative"
      data-testid="app-container"
    >
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded shadow-lg transition"
        aria-label="Logout"
        type="button"
      >
        Logout
      </button>

      {/* Error display */}
      {error && (
        <div className="absolute top-16 right-4 bg-red-200 border border-red-600 text-red-800 p-2 rounded shadow z-50 max-w-xs">
          {error}
          <button
            aria-label="Close error"
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800 font-bold"
            type="button"
          >
            &times;
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loadingGroups ? (
        <p className="p-4 text-center">Loading your groups...</p>
      ) : (
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderView()}
        </main>
      )}

      {/* Modals */}
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
        onConfirm={() => {
          if (deleteConfirmation.group) {
            handleDeleteGroup(deleteConfirmation.group);
          }
          setDeleteConfirmation({ isOpen: false, group: null });
        }}
        groupName={deleteConfirmation.group?.name}
      />
    </div>
  );
}
