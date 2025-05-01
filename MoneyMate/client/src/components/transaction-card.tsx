import { TransactionWithCategory } from "@shared/schema";
import { formatDate } from "@/lib/utils/date-utils";
import { formatCurrency } from "@/lib/utils/transaction-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  ShoppingBag, 
  Receipt, 
  Film, 
  Car, 
  Heart, 
  BookOpen,
  ShoppingCart,
  Home,
  Circle,
  DollarSign
} from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/constants";
import { getIconComponent } from "@/lib/utils/category-utils";

interface TransactionCardProps {
  transaction: TransactionWithCategory;
  onEdit?: (transaction: TransactionWithCategory) => void;
  onDelete?: (transaction: TransactionWithCategory) => void;
}

export default function TransactionCard({ 
  transaction,
  onEdit,
  onDelete
}: TransactionCardProps) {
  const isIncome = transaction.type === "income";
  
  // Get the appropriate icon based on category or transaction type
  const getIcon = () => {
    if (isIncome) {
      return DollarSign;
    }
    
    if (!transaction.category) {
      return Circle;
    }
    
    const iconName = transaction.category.icon || "circle";
    return getIconComponent(iconName);
  };
  
  const Icon = getIcon();
  
  // Get color classes based on transaction type
  const colorClasses = isIncome 
    ? "bg-green-100 text-green-500" 
    : "bg-red-100 text-red-500";
  
  // Get badge color based on category
  const getBadgeClasses = () => {
    if (isIncome) {
      return "bg-green-100 text-green-800";
    }
    
    if (!transaction.category) {
      return "bg-gray-100 text-gray-800";
    }
    
    return `bg-opacity-20 text-opacity-90`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${colorClasses}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">{transaction.description}</h3>
            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
          </div>
        </div>
        <span className={isIncome ? "text-income font-medium" : "text-expense font-medium"}>
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
        </span>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <Badge 
          variant="outline" 
          className={getBadgeClasses()}
          style={transaction.category ? { 
            backgroundColor: `${transaction.category.color}30`,
            color: transaction.category.color 
          } : {}}
        >
          {isIncome ? "Income" : transaction.category?.name || "Uncategorized"}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
