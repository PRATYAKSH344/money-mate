import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Transactions from "@/pages/transactions";
import Reports from "@/pages/reports";
import Profile from "@/pages/profile";
import BottomNavigation from "@/components/bottom-navigation";
import Header from "@/components/header";
import { useState } from "react";
import AddTransactionDialog from "@/components/add-transaction-dialog";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/reports" component={Reports} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 px-4 py-5 overflow-y-auto">
            <Router />
            <div className="h-20"></div> {/* Add padding for bottom navigation */}
          </main>
          <BottomNavigation 
            currentPath={location}
            onAddTransaction={() => setIsTransactionDialogOpen(true)}
          />
          <AddTransactionDialog 
            open={isTransactionDialogOpen}
            onOpenChange={setIsTransactionDialogOpen}
          />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
