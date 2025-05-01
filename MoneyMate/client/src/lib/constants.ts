export const CATEGORIES = [
  { id: 1, name: "Food & Groceries", color: "#F59E0B", icon: "shopping-bag", isDefault: true },
  { id: 2, name: "Bills & Utilities", color: "#8B5CF6", icon: "bill", isDefault: true },
  { id: 3, name: "Entertainment", color: "#EC4899", icon: "film", isDefault: true },
  { id: 4, name: "Transport", color: "#3B82F6", icon: "car", isDefault: true },
  { id: 5, name: "Health", color: "#10B981", icon: "heart-pulse", isDefault: true },
  { id: 6, name: "Education", color: "#6366F1", icon: "book", isDefault: true },
  { id: 7, name: "Shopping", color: "#F97316", icon: "shopping-cart", isDefault: true },
  { id: 8, name: "Housing", color: "#4B5563", icon: "home", isDefault: true }
];

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export const DATE_FILTERS = [
  { label: "Current Month", value: "current-month" },
  { label: "Last Month", value: "last-month" },
  { label: "Last 3 Months", value: "last-3-months" },
  { label: "Last 6 Months", value: "last-6-months" },
  { label: "Current Year", value: "current-year" },
  { label: "Custom Range", value: "custom" }
];

export const CATEGORY_ICONS: Record<string, string> = {
  "shopping-bag": "ShoppingBag",
  "bill": "Receipt",
  "film": "Film",
  "car": "Car",
  "heart-pulse": "Heart",
  "book": "BookOpen",
  "shopping-cart": "ShoppingCart",
  "home": "Home"
};
