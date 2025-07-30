import React, { useState, useEffect, useMemo } from "react";
import type { Group, Expense, UserRef } from "./types";
import { Dashboard } from "./components/Dashboard";
import { GroupView } from "./components/GroupView";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { Plus, X, LogOut, AlertCircle } from "lucide-react";
import { calculateAllBalances } from "./utils";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { toast, ToastContainer } from "react-toastify";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
              Create New Group
            </h2>
            <button
              onClick={onClose}
              aria-label="Close create group modal"
              type="button"
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., 'Weekend Trip' or 'Dinner Club'"
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={!groupName.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              <span>Create Group</span>
            </button>
          </form>
        </div>
      </div>
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

  // Load groups + full details + calculate balances, filtering by user membership
  const loadGroups = async () => {
    setLoadingGroups(true);
    setError(null);
    try {
      if (!user) throw new Error("User not logged in");

      // 1) Fetch basic group list
      const groupsSummary = await fetchGroups();

      // 2) Fetch full group details including expenses
      const groupsWithDetails: Group[] = await Promise.all(
        groupsSummary.map(async (g: { _id: string }) => {
          const fullGroup = await fetchGroupById(g._id);
          return fullGroup;
        })
      );

      // 3) Filter groups where current user is a member
      const filteredGroups = groupsWithDetails.filter((group) =>
        group.members.some((member) =>
          typeof member === "string"
            ? member === user.username
            : member?.username === user.username
        )
      );

      // 4) Calculate balances only on filtered groups
      const { processedGroups } = calculateAllBalances(
        filteredGroups,
        user.username
      );

      // 5) Update state with filtered and processed groups
      setGroups(processedGroups);
      setActiveGroup(null);
      setView("dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  // Load full group details and calculate balances when a group is selected
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

  // Handle group selection
  const handleGroupSelect = (group: Group) => {
    loadGroupById(group._id);
  };

  // Create new group
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

  // Update group locally and update activeGroup if matching
  const updateGroupLocally = (updatedGroup: Group) => {
    setGroups((prev) =>
      prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g))
    );
    if (activeGroup?._id === updatedGroup._id) {
      setActiveGroup(updatedGroup);
    }
  };

  // Add member to group with backend validation
  const handleAddMemberToGroup = async (memberName: string) => {
    if (!activeGroup) return;

    if (
      activeGroup.members.some(
        (m: UserRef) => (typeof m === "string" ? m : m.username) === memberName
      )
    ) {
      setError("Member already exists in the group");
      return;
    }

    try {
      await apiAddMember(activeGroup._id!, memberName);

      // Fetch full updated group details including expenses after adding member
      const fullGroup = await fetchGroupById(activeGroup._id!);

      // Calculate balances
      const { processedGroups } = calculateAllBalances(
        [fullGroup],
        user!.username
      );
      const processedGroup = processedGroups[0];

      // Update groups and activeGroup states with this full processed group
      setGroups((prevGroups) =>
        prevGroups.map((g) =>
          g._id === processedGroup._id ? processedGroup : g
        )
      );
      setActiveGroup(processedGroup);

      setError(null);
    } catch (err: any) {
      if (err.message) {
        if (err.message === "User not found") {
          toast.error("User not found");
        } else {
          setError(err.message);
        }
      } else {
        toast.error("Failed to add member");
      }
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

  // Add or edit expense, recalc balances and update state
  const handleExpenseSubmit = async (expenseData: Expense) => {
    if (!expenseModalState.group || !user) return;

    try {
      const groupId = expenseModalState.group._id!;
      let updatedExpense: Expense;

      if (expenseModalState.expenseToEdit) {
        const expenseId = expenseModalState.expenseToEdit._id!;
        updatedExpense = await apiEditExpense(groupId, expenseId, expenseData);
      } else {
        updatedExpense = await apiAddExpense(groupId, expenseData);
      }

      const updatedGroup = { ...expenseModalState.group };
      updatedGroup.expenses = updatedGroup.expenses || [];

      if (!updatedExpense._id) {
        updatedExpense._id = `temp-id-${Date.now()}`;
      }

      const idx = updatedGroup.expenses.findIndex(
        (e) => e._id === updatedExpense._id
      );
      if (idx > -1) {
        updatedGroup.expenses[idx] = updatedExpense;
      } else {
        updatedGroup.expenses = [updatedExpense, ...updatedGroup.expenses];
      }

      const { processedGroups } = calculateAllBalances(
        [updatedGroup],
        user.username
      );
      const processedGroup = processedGroups[0];

      updateGroupLocally(processedGroup);

      setExpenseModalState({ isOpen: false, group: null, expenseToEdit: null });
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to submit expense");
    }
  };

  // Memoize calculated groups and summary for dashboard
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

  // Render main UI
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
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen font-sans text-slate-900 relative transition-all duration-300"
        data-testid="app-container"
      >
        {/* Header with logout button */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ExpenseTracker
              </h1>
              {user && (
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Welcome, {user.username}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
              aria-label="Logout"
              type="button"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Error display */}
        {error && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-lg max-w-sm flex items-start space-x-3">
              <AlertCircle
                size={20}
                className="text-red-500 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button
                aria-label="Close error"
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loadingGroups ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 font-medium">
                Loading your groups...
              </p>
            </div>
          </div>
        ) : (
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
              {renderView()}
            </div>
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
    </>
  );
}
