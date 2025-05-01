import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FinancialSummary from "@/components/financial-summary";
import ExpenseBreakdown from "@/components/expense-breakdown";
import TransactionList from "@/components/transaction-list";

export default function Home() {
  const [_, navigate] = useLocation();
  const currentMonth = format(new Date(), "MMMM yyyy");
  
  return (
    <>
      <FinancialSummary period={currentMonth} />
      <ExpenseBreakdown />
      <TransactionList 
        limit={3} 
        showViewAll={true}
        onViewAll={() => navigate("/transactions")}
      />
    </>
  );
}
