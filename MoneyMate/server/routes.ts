import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTransactionSchema, 
  insertCategorySchema,
  insertBudgetSchema,
  TRANSACTION_TYPES
} from "@shared/schema";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const parseResult = insertCategorySchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid category data", errors: parseResult.error.format() });
      }
      
      const category = await storage.createCategory(parseResult.data);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req: Request, res: Response) => {
    try {
      const { type, categoryId, startDate, endDate } = req.query;
      
      const filter: any = {};
      
      if (type && TRANSACTION_TYPES.includes(type as any)) {
        filter.type = type;
      }
      
      if (categoryId && !isNaN(Number(categoryId))) {
        filter.categoryId = Number(categoryId);
      }
      
      if (startDate && typeof startDate === 'string') {
        filter.startDate = parseISO(startDate);
      }
      
      if (endDate && typeof endDate === 'string') {
        filter.endDate = parseISO(endDate);
      }
      
      const transactions = await storage.getTransactions(undefined, filter);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }
      
      const transaction = await storage.getTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const parseResult = insertTransactionSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid transaction data", errors: parseResult.error.format() });
      }
      
      // Convert date string to Date object if needed
      let data = parseResult.data;
      if (typeof data.date === 'string') {
        data.date = new Date(data.date);
      }
      
      const transaction = await storage.createTransaction(data);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.put("/api/transactions/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }
      
      const parseResult = insertTransactionSchema.partial().safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid transaction data", errors: parseResult.error.format() });
      }
      
      // Convert date string to Date object if needed
      let data = parseResult.data;
      if (data.date && typeof data.date === 'string') {
        data.date = new Date(data.date);
      }
      
      const updatedTransaction = await storage.updateTransaction(id, data);
      
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }
      
      const success = await storage.deleteTransaction(id);
      
      if (!success) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  // Summary route
  app.get("/api/summary", async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      
      let start: Date | undefined;
      let end: Date | undefined;
      
      if (startDate && typeof startDate === 'string') {
        start = parseISO(startDate);
      } else {
        // Default to current month
        start = startOfMonth(new Date());
      }
      
      if (endDate && typeof endDate === 'string') {
        end = parseISO(endDate);
      } else {
        // Default to current month
        end = endOfMonth(new Date());
      }
      
      const summary = await storage.getFinancialSummary(undefined, start, end);
      
      // Add period information
      const period = format(start, 'MMMM yyyy');
      
      res.json({
        ...summary,
        period
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial summary" });
    }
  });

  // Budget routes (optional enhancement)
  app.get("/api/budgets", async (req: Request, res: Response) => {
    try {
      const { month, year } = req.query;
      
      if (!month || !year || isNaN(Number(month)) || isNaN(Number(year))) {
        return res.status(400).json({ message: "Month and year are required" });
      }
      
      // Using 1 as a placeholder for userId
      const budgets = await storage.getBudgets(1, Number(month), Number(year));
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", async (req: Request, res: Response) => {
    try {
      const parseResult = insertBudgetSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid budget data", errors: parseResult.error.format() });
      }
      
      // Using 1 as a placeholder for userId
      const budget = await storage.createBudget({
        ...parseResult.data,
        userId: 1
      });
      
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ message: "Failed to create budget" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
