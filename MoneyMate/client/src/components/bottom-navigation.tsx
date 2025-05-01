import { Link } from "wouter";
import { Home, BarChart2, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  currentPath: string;
  onAddTransaction: () => void;
}

export default function BottomNavigation({ 
  currentPath, 
  onAddTransaction 
}: BottomNavigationProps) {
  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around items-center h-16">
        <Link href="/">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full w-1/4 ${
              currentPath === "/" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
        </Link>
        
        <Link href="/transactions">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full w-1/4 ${
              currentPath === "/transactions" ? "text-primary" : "text-gray-500"
            }`}
          >
            <svg 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="12" y1="4" x2="12" y2="20"></line>
              <polyline points="18 10 12 4 6 10"></polyline>
              <polyline points="6 14 12 20 18 14"></polyline>
            </svg>
            <span className="text-xs mt-1">Transactions</span>
          </Button>
        </Link>
        
        <Button
          onClick={onAddTransaction}
          className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md"
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        <Link href="/reports">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full w-1/4 ${
              currentPath === "/reports" ? "text-primary" : "text-gray-500"
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            <span className="text-xs mt-1">Reports</span>
          </Button>
        </Link>
        
        <Link href="/profile">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full w-1/4 ${
              currentPath === "/profile" ? "text-primary" : "text-gray-500"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
