import { Category } from "@shared/schema";
import * as Icons from "lucide-react";
import { CATEGORY_ICONS } from "../constants";

// Modified to avoid JSX in .ts file
export const getIconComponent = (iconName: string) => {
  const iconKey = CATEGORY_ICONS[iconName] || "Circle";
  return Icons[iconKey as keyof typeof Icons] || Icons.Circle;
};

export const formatCategoryLabel = (category?: Category): string => {
  return category?.name || "Uncategorized";
};

export const getCategoryColor = (category?: Category): string => {
  return category?.color || "#888888";
};

export const getCategoryByName = (categories: Category[], name: string): Category | undefined => {
  return categories.find(category => category.name.toLowerCase() === name.toLowerCase());
};

export const getCategoryById = (categories: Category[], id?: number): Category | undefined => {
  if (!id) return undefined;
  return categories.find(category => category.id === id);
};
