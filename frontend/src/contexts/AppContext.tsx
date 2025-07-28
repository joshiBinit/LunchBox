import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface FoodItem {
  id: string;
  name: string;
  cost: number;
  sharedBy: string[];
}

export interface Lunch {
  id: string;
  date: string;
  restaurant: string;
  totalAmount: number;
  items: FoodItem[];
  paidBy: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  adminId: string;
  members: string[];
  lunches: Lunch[];
}

export interface Balance {
  owes: { [userId: string]: number };
  owedBy: { [userId: string]: number };
}

interface AppContextType {
  groups: Group[];

  users: any[];
  createGroup: (name: string) => void;
  addMemberToGroup: (groupId: string, userId: string) => void;
  addLunch: (groupId: string, lunch: Omit<Lunch, "id" | "groupId">) => void;
  getBalance: (groupId: string, userId: string) => Balance;
  getUserById: (userId: string) => any;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedGroups = localStorage.getItem("lunchTracker_groups");
    const storedUsers = localStorage.getItem("lunchTracker_users");

    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lunchTracker_groups", JSON.stringify(groups));
  }, [groups]);

  const createGroup = (name: string) => {
    if (!user) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      adminId: user.id,
      members: [user.id],
      lunches: [],
    };

    setGroups((prev) => [...prev, newGroup]);
  };

  const addMemberToGroup = (groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, members: [...new Set([...group.members, userId])] }
          : group
      )
    );
  };

  const addLunch = (groupId: string, lunch: Omit<Lunch, "id" | "groupId">) => {
    const newLunch: Lunch = {
      ...lunch,
      id: Date.now().toString(),
      groupId,
    };

    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, lunches: [...group.lunches, newLunch] }
          : group
      )
    );
  };

  const getBalance = (groupId: string, userId: string): Balance => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return { owes: {}, owedBy: {} };

    const balance: Balance = { owes: {}, owedBy: {} };

    group.lunches.forEach((lunch) => {
      lunch.items.forEach((item) => {
        const costPerPerson = item.cost / item.sharedBy.length;

        item.sharedBy.forEach((memberId) => {
          if (memberId !== lunch.paidBy) {
            // This member owes money to the person who paid
            if (!balance.owes[lunch.paidBy]) balance.owes[lunch.paidBy] = 0;
            balance.owes[lunch.paidBy] += costPerPerson;
          }
        });

        if (lunch.paidBy === userId) {
          // This user paid, so others owe them
          item.sharedBy.forEach((memberId) => {
            if (memberId !== userId) {
              if (!balance.owedBy[memberId]) balance.owedBy[memberId] = 0;
              balance.owedBy[memberId] += costPerPerson;
            }
          });
        }
      });
    });

    return balance;
  };

  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  return (
    <AppContext.Provider
      value={{
        groups,
        users,
        createGroup,
        addMemberToGroup,
        addLunch,
        getBalance,
        getUserById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
