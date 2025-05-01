import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertTransactionSchema } from "@shared/schema";
import { formatDateForInput } from "@/lib/utils/date-utils";

interface TransactionFormProps {
  onSuccess?: () => void;
}

// Extend the transaction schema with client-side validation
const formSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.coerce.number().optional().nullable(),
  date: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  
  // Fetch categories for the dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: undefined,
      description: "",
      categoryId: undefined,
      date: formatDateForInput(new Date()),
    },
  });
  
  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (data: FormValues) => {
      // Convert categoryId to number or null
      const categoryId = data.categoryId ? Number(data.categoryId) : null;
      
      const response = await apiRequest("POST", "/api/transactions", {
        ...data,
        categoryId,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
      
      toast({
        title: "Transaction added",
        description: "Your transaction has been successfully added.",
      });
      
      form.reset({
        type: transactionType,
        amount: undefined,
        description: "",
        categoryId: undefined,
        date: formatDateForInput(new Date()),
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to add transaction",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleToggleTransactionType = (type: "income" | "expense") => {
    setTransactionType(type);
    form.setValue("type", type);
    
    // If switching to income, clear the category
    if (type === "income") {
      form.setValue("categoryId", undefined);
    }
  };
  
  const onSubmit = (data: FormValues) => {
    createTransaction.mutate(data);
  };
  
  return (
    <div className="p-4">
      {/* Transaction Type Toggle */}
      <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <Button
          type="button"
          variant="ghost"
          className={`flex-1 py-3 rounded-none ${
            transactionType === "income"
              ? "bg-income text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => handleToggleTransactionType("income")}
        >
          Income
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={`flex-1 py-3 rounded-none ${
            transactionType === "expense"
              ? "bg-expense text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => handleToggleTransactionType("expense")}
        >
          Expense
        </Button>
      </div>
      
      {/* Transaction Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What was this for?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {transactionType === "expense" && (
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full py-3 mt-6"
            disabled={createTransaction.isPending}
          >
            {createTransaction.isPending ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
