import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/transaction-utils";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";

export default function ExpenseBreakdown() {
  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ['/api/summary'],
  });
  
  if (isLoading) {
    return (
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Expense Breakdown</h2>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>
              <div className="md:w-1/2 flex flex-col">
                <ul className="space-y-3">
                  {Array(6).fill(0).map((_, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Skeleton className="w-3 h-3 rounded-full mr-2" />
                        <Skeleton className="w-28 h-4" />
                      </div>
                      <Skeleton className="w-16 h-4" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  if (isError || !summary || !summary.expensesByCategory || summary.expensesByCategory.length === 0) {
    return (
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Expense Breakdown</h2>
        </div>
        <Card>
          <CardContent className="p-4">
            <p className="text-center text-gray-500 py-8">
              {isError 
                ? "Failed to load expense breakdown. Please try again later." 
                : "No expense data available for the selected period."}
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  const chartData = summary.expensesByCategory.map(item => ({
    name: item.category.name,
    value: item.amount,
    color: item.category.color
  }));
  
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Expense Breakdown</h2>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 flex justify-center items-center mb-6 md:mb-0 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '0.375rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:w-1/2 flex flex-col">
              <ul className="space-y-3">
                {summary.expensesByCategory.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.category.color }}
                      ></span>
                      <span className="text-sm text-gray-700">{item.category.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {formatCurrency(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
