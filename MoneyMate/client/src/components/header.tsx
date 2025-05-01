import { useState } from "react";
import { Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import DateFilter from "@/components/date-filter";

export default function Header() {
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800">Budget Tracker</h1>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 rounded-full hover:bg-gray-100"
            onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <DateFilter 
        isOpen={isDateFilterOpen} 
        onClose={() => setIsDateFilterOpen(false)} 
      />
    </header>
  );
}
