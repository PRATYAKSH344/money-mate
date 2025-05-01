import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils/transaction-utils";
import { formatMonthYear } from "@/lib/utils/date-utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("expenses");
  
  const { data: summary } = useQuery({
    queryKey: ['/api/summary'],
  });
  
  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions'],
  });
  
  if (!summary || !transactions) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Reports</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-8">
              Loading financial data...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Prepare chart data
  const expenseChartData = summary.expensesByCategory
    ? summary.expensesByCategory.map(item => ({
        name: item.category.name,
        value: item.amount,
        color: item.category.color,
      }))
    : [];
  
  // Sample data for income/expense trend (this would ideally be from the API)
  const trendData = [
    { name: "Jan", income: 3200, expenses: 1900 },
    { name: "Feb", income: 3500, expenses: 2100 },
    { name: "Mar", income: 3100, expenses: 2000 },
    { name: "Apr", income: 3800, expenses: 2200 },
    { name: "May", income: 3400, expenses: 2100 },
    { name: "Jun", income: 3250, expenses: 1995 },
  ];
  
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Reports</h1>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Summary for {summary.period}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-xl font-semibold text-income">
                {formatCurrency(summary.income)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-xl font-semibold text-expense">
                {formatCurrency(summary.expenses)}
              </p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
          <TabsTrigger value="trends" className="flex-1">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10B981" />
                    <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
