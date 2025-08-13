import { ConversationalForm } from "@/components/ConversationalForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8"></div>
        <ConversationalForm />
      </div>
    </div>
  );
}
