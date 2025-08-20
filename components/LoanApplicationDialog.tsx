"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConversationalForm } from "./ConversationalForm";

export function LoanApplicationDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmission = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="text-lg px-8 py-6 bg-[#fa8d30] hover:bg-[#fa8d30]/80 text-gray-800 absolute bottom-10 right-10"
        >
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl w-[32rem] h-[42rem] p-0 overflow-hidden"
        aria-label="Loan Application"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Loan Application</DialogTitle>
          <DialogDescription>
            Complete your loan application through our conversational assistant
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ConversationalForm onSubmissionComplete={handleFormSubmission} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
