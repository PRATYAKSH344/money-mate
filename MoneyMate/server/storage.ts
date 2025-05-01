import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  transactions, type Transaction, type InsertTransaction,
  TransactionWithCategory, 
  budgets, type Budget, type InsertBudget
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Transaction operations
  getTransactions(userId?: number, filter?: {
    type?: string,
    categoryId?: number,
    startDate?: Date,
    endDate?: Date
  }): Promise<TransactionWithCategory[]>;
  getTransaction(id: number): Promise<TransactionWithCategory | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Budget operations (optional enhancement)
  getBudgets(userId: number, month: number, year: number): Promise<Budget[]>;
  getBudget(id: number): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  
  // Summary operations
  getFinancialSummary(userId?: number, startDate?: Date, endDate?: Date): Promise<{
    income: number;
    expenses: number;
    balance: number;
    expensesByCategory: Array<{ category: Category, amount: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private transactions: Map<number, Transaction>;
  private budgets: Map<number, Budget>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private transactionCurrentId: number;
  private budgetCurrentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.transactions = new Map();
    this.budgets = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.transactionCurrentId = 1;
    this.budgetCurrentId = 1;
    
    // Initialize with default categories
    this.initDefaultCategories();
  }

  private initDefaultCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Food & Groceries", color: "#F59E0B", icon: "shopping-bag", isDefault: true },
      { name: "Bills & Utilities", color: "#8B5CF6", icon: "bill", isDefault: true },
      { name: "Entertainment", color: "#EC4899", icon: "film", isDefault: true },
      { name: "Transport", color: "#3B82F6", icon: "car", isDefault: true },
      { name: "Health", color: "#10B981", icon: "heart-pulse", isDefault: true },
      { name: "Education", color: "#6366F1", icon: "book", isDefault: true },
      { name: "Shopping", color: "#F97316", icon: "shopping-cart", isDefault: true },
      { name: "Housing", color: "#4B5563", icon: "home", isDefault: true }
    ];
    
    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Transaction operations
  async getTransactions(userId?: number, filter: {
    type?: string,
    categoryId?: number,
    startDate?: Date,
    endDate?: Date
  } = {}): Promise<TransactionWithCategory[]> {
    let transactions = Array.from(this.transactions.values());
    
    // Apply filters
    if (userId !== undefined) {
      transactions = transactions.filter(t => t.userId === userId);
    }
    
    if (filter.type) {
      transactions = transactions.filter(t => t.type === filter.type);
    }
    
    if (filter.categoryId) {
      transactions = transactions.filter(t => t.categoryId === filter.categoryId);
    }
    
    if (filter.startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= filter.startDate!);
    }
    
    if (filter.endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= filter.endDate!);
    }
    
    // Sort by date (most recent first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Add category information
    return transactions.map(transaction => {
      const category = transaction.categoryId 
        ? this.categories.get(transaction.categoryId) 
        : undefined;
      
      return {
        ...transaction,
        category
      };
    });
  }
  
  async getTransaction(id: number): Promise<TransactionWithCategory | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const category = transaction.categoryId 
      ? this.categories.get(transaction.categoryId) 
      : undefined;
    
    return {
      ...transaction,
      category
    };
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updateData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }
  
  // Budget operations
  async getBudgets(userId: number, month: number, year: number): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(
      budget => budget.userId === userId && budget.month === month && budget.year === year
    );
  }
  
  async getBudget(id: number): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }
  
  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = this.budgetCurrentId++;
    const budget: Budget = { ...insertBudget, id };
    this.budgets.set(id, budget);
    return budget;
  }
  
  async updateBudget(id: number, updateData: Partial<InsertBudget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updatedBudget = { ...budget, ...updateData };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }
  
  // Summary operations
  async getFinancialSummary(userId?: number, startDate?: Date, endDate?: Date): Promise<{
    income: number;
    expenses: number;
    balance: number;
    expensesByCategory: Array<{ category: Category, amount: number }>;
  }> {
    // Get filtered transactions
    const transactions = await this.getTransactions(userId, {
      startDate,
      endDate
    });
    
    // Calculate income and expenses
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate balance
    const balance = income - expenses;
    
    // Calculate expenses by category
    const expensesByCategory: Array<{ category: Category, amount: number }> = [];
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Get all categories
    const categories = await this.getCategories();
    
    // Initialize expenses for each category
    categories.forEach(category => {
      const categoryExpenses = expenseTransactions
        .filter(t => t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (categoryExpenses > 0) {
        expensesByCategory.push({
          category,
          amount: categoryExpenses
        });
      }
    });
    
    // Sort by amount (highest first)
    expensesByCategory.sort((a, b) => b.amount - a.amount);
    
    return {
      income,
      expenses,
      balance,
      expensesByCategory
    };
  }
}

export const storage = new MemStorage();
