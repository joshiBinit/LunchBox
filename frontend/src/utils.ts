import type { Group, PersonListItemType } from "./types";

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

export const calculateAllBalances = (groups: Group[]): CalculatedResult => {
  const processedGroups = groups.map((group) => {
    const balances: Record<string, number> = {};
    group.members.forEach((member) => {
      balances[member] = 0;
    });

    group.expenses.forEach((expense) => {
      const payer = expense.payer;
      expense.items.forEach((item) => {
        const cost = item.cost;
        const sharers = item.sharedBy;
        if (cost > 0 && sharers.length > 0) {
          const share = cost / sharers.length;
          sharers.forEach((sharer) => {
            if (sharer !== payer) {
              balances[sharer] -= share; // owes money
              balances[payer] += share; // is owed money
            }
          });
        }
      });
    });

    const currentUser = "You";
    const groupReceivables: PersonListItemType[] = [];
    const groupPayables: PersonListItemType[] = [];
    const totalCost = group.expenses.reduce(
      (sum, exp) => sum + exp.totalCost,
      0
    );
    let userReceivable = 0;
    let userPayable = 0;

    const userBalance = balances[currentUser];
    if (userBalance > 0) {
      userReceivable = userBalance;
    } else {
      userPayable = -userBalance;
    }

    Object.entries(balances).forEach(([person, balance]) => {
      if (person === currentUser) return;

      if (userBalance > 0 && balance < 0) {
        groupReceivables.push({
          id: person,
          name: person,
          amount: Math.min(userBalance, -balance),
        });
      } else if (userBalance < 0 && balance > 0) {
        groupPayables.push({
          id: person,
          name: person,
          amount: Math.min(-userBalance, balance),
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
