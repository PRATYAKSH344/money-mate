import { useQuery } from "@tanstack/react-query";
import { TransactionWithCategory } from "@shared/schema";
import TransactionCard from "@/components/transaction-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionListProps {
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function TransactionList({ 
  title = "Recent Transactions", 
  limit,
  showViewAll = false,
  onViewAll 
}: TransactionListProps) {
  const { data: transactions, isLoading, isError } = useQuery<TransactionWithCategory[]>({
    queryKey: ['/api/transactions'],
  });
  
  // Show skeleton loading state
  if (isLoading) {
    return (
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {showViewAll && (
            <Button variant="link" className="text-primary p-0" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {Array(limit || 3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  // Show error state
  if (isError || !transactions) {
    return (
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-500">Failed to load transactions. Please try again later.</p>
        </div>
      </section>
    );
  }
  
  // If no transactions, show empty state
  if (transactions.length === 0) {
    return (
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">No transactions found.</p>
          <p className="text-gray-500 text-sm mt-1">Add a transaction to get started</p>
        </div>
      </section>
    );
  }
  
  // Limit the number of transactions if needed
  const displayedTransactions = limit 
    ? transactions.slice(0, limit) 
    : transactions;
  
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {showViewAll && transactions.length > limit! && (
          <Button variant="link" className="text-primary p-0" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {displayedTransactions.map(transaction => (
          <TransactionCard 
            key={transaction.id} 
            transaction={transaction} 
          />
        ))}
      </div>
    </section>
  );
}
