import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/transaction-utils";

interface FinancialSummaryProps {
  period: string;
}

export default function FinancialSummary({ period }: FinancialSummaryProps) {
  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ['/api/summary'],
  });
  
  if (isLoading) {
    return (
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Financial Summary</h2>
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Balance</h3>
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">For <Skeleton className="h-4 w-24 inline-block" /></h3>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Income</span>
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Expenses</span>
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  if (isError) {
    return (
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Financial Summary</h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-red-500">Failed to load financial summary. Please try again later.</p>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Financial Summary</h2>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Balance</h3>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(summary.balance)}
              </p>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">
                  For <span>{summary.period || period}</span>
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Income</span>
                  <span className="text-base font-semibold text-income">
                    {formatCurrency(summary.income)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Expenses</span>
                  <span className="text-base font-semibold text-expense">
                    {formatCurrency(summary.expenses)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
