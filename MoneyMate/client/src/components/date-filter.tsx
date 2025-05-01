import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { DATE_FILTERS } from "@/lib/constants";
import { getDateRangeForFilter, formatDateForInput } from "@/lib/utils/date-utils";

interface DateFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DateFilter({ isOpen, onClose }: DateFilterProps) {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  useEffect(() => {
    if (selectedPeriod === "custom") {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      
      // Set dates based on the selected period
      const { startDate: start, endDate: end } = getDateRangeForFilter(selectedPeriod);
      setStartDate(formatDateForInput(start));
      setEndDate(formatDateForInput(end));
    }
  }, [selectedPeriod]);
  
  const handleApply = () => {
    if (selectedPeriod === "custom" && (!startDate || !endDate)) {
      toast({
        title: "Date range required",
        description: "Please select both start and end dates.",
        variant: "destructive"
      });
      return;
    }
    
    // Update queries with the new date range
    queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
    
    onClose();
    
    toast({
      title: "Date filter applied",
      description: "The financial data has been updated."
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200">
      <div className="flex gap-3 items-center justify-between">
        <div className="flex flex-col w-full">
          <Label htmlFor="datePeriod" className="mb-1">Time Period</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger id="datePeriod" className="w-full">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleApply} className="min-w-[80px]">Apply</Button>
      </div>
      
      {showCustomDateRange && (
        <div className="mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate" className="mb-1">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="mb-1">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
