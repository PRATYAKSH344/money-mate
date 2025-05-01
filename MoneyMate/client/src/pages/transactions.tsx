import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TransactionWithCategory } from "@shared/schema";
import TransactionList from "@/components/transaction-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRANSACTION_TYPES } from "@/lib/constants";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  
  const { data: transactions } = useQuery<TransactionWithCategory[]>({
    queryKey: ['/api/transactions'],
  });
  
  // Filter transactions based on search term and type filter
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchTerm === "" || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "" || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Transactions</h1>
      
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search transactions"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All transaction types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <TransactionList 
        title={`${filteredTransactions?.length || 0} Transactions`}
      />
    </>
  );
}
