import { TransactionWithCategory } from "@shared/schema";
import { CATEGORIES } from "../constants";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function getCategoryIcon(categoryId?: number): string {
  if (!categoryId) return "Circle";
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category ? category.icon : "Circle";
}

export function getCategoryColor(categoryId?: number): string {
  if (!categoryId) return "#888";
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category ? category.color : "#888";
}

export function calculateBalance(transactions: TransactionWithCategory[]): {
  income: number;
  expenses: number;
  balance: number;
} {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses
  };
}

export function groupTransactionsByCategory(transactions: TransactionWithCategory[]): {
  category: {
    id: number;
    name: string;
    color: string;
  };
  amount: number;
}[] {
  const expenseTransactions = transactions.filter(t => t.type === "expense");
  
  const categoryMap = new Map<number, {
    id: number;
    name: string;
    color: string;
    amount: number;
  }>();
  
  // Initialize with all categories
  CATEGORIES.forEach(category => {
    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      color: category.color,
      amount: 0
    });
  });
  
  // Sum transactions by category
  expenseTransactions.forEach(transaction => {
    if (transaction.categoryId) {
      const category = categoryMap.get(transaction.categoryId);
      if (category) {
        category.amount += transaction.amount;
      }
    }
  });
  
  // Convert map to array and filter out categories with zero amount
  const result = Array.from(categoryMap.values())
    .filter(category => category.amount > 0)
    .map(category => ({
      category: {
        id: category.id,
        name: category.name,
        color: category.color
      },
      amount: category.amount
    }));
  
  // Sort by amount (highest first)
  return result.sort((a, b) => b.amount - a.amount);
}
