import { ConversationalForm } from "@/components/conversational-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered Loan Application
          </h1>
          <p className="text-gray-600">
            Chat with our AI assistant to complete your loan application in
            minutes
          </p>
        </div>
        <ConversationalForm />
      </div>
    </div>
  );
}
