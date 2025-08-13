import { LoanApplicationDialog } from "@/components/LoanApplicationDialog";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 w-full">
      <LoanApplicationDialog />
    </main>
  );
}
