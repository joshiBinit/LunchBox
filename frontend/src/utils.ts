import type {
  Group,
  Expense,
  ExpenseItem,
  PersonListItemType,
  UserRef,
} from "./types";

interface OverallSummary {
  totalGroups: number;
  totalSpent: number;
  totalReceivable: number;
  totalPayable: number;
}

interface CalculatedResult {
  processedGroups: Group[];
  overallSummary: OverallSummary;
}

// Helper function to extract username string from a UserRef
const getUsername = (user: UserRef): string => {
  if (typeof user === "string") return user;
  if (user && typeof user === "object" && "username" in user)
    return user.username;
  return ""; // fallback empty string
};

export const calculateAllBalances = (
  groups: Group[],
  currentUsername: string
): CalculatedResult => {
  const processedGroups = groups.map((group) => {
    const balances: Record<string, number> = {};

    // Extract members usernames as strings defensively
    const members = Array.isArray(group.members) ? group.members : [];
    members.forEach((member) => {
      const username = getUsername(member);
      if (username) balances[username] = 0;
    });

    // Defensive fallback for expenses array
    const expenses = Array.isArray(group.expenses) ? group.expenses : [];

    expenses.forEach((expense) => {
      const payer = getUsername(expense.payer) || "";
      // Defensive fallback for items
      const items = Array.isArray(expense.items) ? expense.items : [];

      items.forEach((item) => {
        const cost = item.cost || 0;
        // Extract usernames of sharers
        const sharers = Array.isArray(item.sharedBy)
          ? item.sharedBy.map(getUsername).filter(Boolean)
          : [];

        if (cost > 0 && sharers.length > 0) {
          const share = cost / sharers.length;
          sharers.forEach((sharer) => {
            if (sharer !== payer) {
              balances[sharer] = (balances[sharer] || 0) - share; // owes money
              balances[payer] = (balances[payer] || 0) + share; // is owed money
            }
          });
        }
      });
    });

    const currentUser = currentUsername;
    const groupReceivables: PersonListItemType[] = [];
    const groupPayables: PersonListItemType[] = [];

    const totalCost = expenses.reduce(
      (sum, exp) => sum + (exp.totalCost || 0),
      0
    );

    const userBalance = balances[currentUser] ?? 0;
    let userReceivable = 0;
    let userPayable = 0;

    if (userBalance > 0) {
      userReceivable = userBalance;
    } else if (userBalance < 0) {
      userPayable = -userBalance;
    }

    Object.entries(balances).forEach(([person, balance]) => {
      if (person === currentUser) return;

      if (userBalance > 0 && balance < 0) {
        groupReceivables.push({
          id: person,
          name: person,
          amount: Math.min(userBalance, -balance),
          type: "receivable",
        });
      } else if (userBalance < 0 && balance > 0) {
        groupPayables.push({
          id: person,
          name: person,
          amount: Math.min(-userBalance, balance),
          type: "payable",
        });
      }
    });

    return {
      ...group,
      summary: {
        totalCost,
        receivable: userReceivable,
        payable: userPayable,
      },
      groupReceivables,
      groupPayables,
    };
  });

  // Compute overall summary from all processed groups
  const overallSummary = processedGroups.reduce(
    (acc, group) => {
      acc.totalSpent += group.summary?.totalCost ?? 0;
      acc.totalReceivable += group.summary?.receivable ?? 0;
      acc.totalPayable += group.summary?.payable ?? 0;
      return acc;
    },
    {
      totalGroups: groups.length,
      totalSpent: 0,
      totalReceivable: 0,
      totalPayable: 0,
    }
  );

  return { processedGroups, overallSummary };
};
