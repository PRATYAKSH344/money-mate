import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "@/components/transaction-form";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTransactionDialog({
  open,
  onOpenChange
}: AddTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-auto">
        <DialogHeader className="border-b border-gray-200 pb-3">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold text-gray-800">Add Transaction</DialogTitle>
            <button 
              className="text-gray-500"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        
        <TransactionForm 
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
