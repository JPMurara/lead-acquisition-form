"use client";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Message, MessageList } from "@/components/ui/message";
import { ChatInput } from "@/components/ui/chat-input";
import { CheckCircle } from "lucide-react";
import { parseAIResponse, ExtractedData } from "@/lib/data-extraction";
import { chatAction } from "@/lib/actions/chat";
import { submitLeadAction } from "@/lib/actions/submit-lead";
import { conversationalFormSchema, FormData } from "@/lib/schemas";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ConversationState {
  messages: Message[];
  formData: ExtractedData;
  isTyping: boolean;
}

export function ConversationalForm() {
  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      messages: [
        {
          id: "1",
          role: "assistant",
          content:
            "Hi! I'm here to help you with your loan application. What loan amount are you considering? Please note that we only work with amounts between $1,000 and $40,000.",
          timestamp: new Date(),
        },
      ],
      formData: {},
      isTyping: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const formattedChatHistory = conversationState.messages
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n");

      const submissionData = {
        loanAmount: conversationState.formData.loanAmount as number,
        loanType: conversationState.formData.loanType as string,
        name: conversationState.formData.name as string,
        email: conversationState.formData.email as string,
        phone: conversationState.formData.phone as string,
        chatHistory: formattedChatHistory,
      };

      const validatedData = conversationalFormSchema.parse(submissionData);

      const result = await submitLeadAction(validatedData);
      if (!result.success) {
        throw new Error(result.error || "Failed to submit lead");
      }

      // Show success toast with server response message
      toast.success("Application Submitted!", {
        description: result.message,
        duration: 5000,
      });

      // Reset form for new conversation
      setConversationState({
        messages: [
          {
            id: "1",
            role: "assistant",
            content:
              "Hi! I'm here to help you with your loan application. What loan amount are you considering? Please note that we only work with amounts between $1,000 and $40,000.",
            timestamp: new Date(),
          },
        ],
        formData: {},
        isTyping: false,
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Submission Failed", {
        description: "Failed to submit application. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationState.messages]);

  const handleSendMessage = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setConversationState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isTyping: true,
    }));

    try {
      const minimalMessages = [...conversationState.messages, userMsg].map(
        (m) => ({ role: m.role, content: m.content })
      );

      const data = await chatAction({
        messages: minimalMessages,
        formData: conversationState.formData,
      });

      // Extract data from AI response (only on final confirmation)
      const extractedData = parseAIResponse(data.response);

      const updatedFormData = {
        ...conversationState.formData,
        ...extractedData,
      };

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setConversationState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
        formData: updatedFormData,
        isTyping: false,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setConversationState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMsg],
        isTyping: false,
      }));
    }
  };

  const isFormComplete =
    conversationState.formData.name &&
    conversationState.formData.email &&
    conversationState.formData.phone &&
    conversationState.formData.loanAmount &&
    conversationState.formData.loanType;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <div className="flex flex-row items-center justify-between">
              <img
                src="https://www.umeloans.com.au/wp-content/uploads/2024/11/UME-logo-new-with-registered-trademark-2024.png"
                alt="UME Logo"
                className="w-28"
              />
              <CardTitle className="flex items-center gap-2">
                Loan Assistant
              </CardTitle>
            </div>
            <CardDescription>
              Chat with our virtual assistant to complete your application
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-y-auto">
            <div className="flex-1 overflow-y-auto">
              <MessageList>
                {conversationState.messages.map((message) => (
                  <Message
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                ))}
                {conversationState.isTyping && (
                  <Message role="assistant" content="" isTyping={true} />
                )}
                <div ref={messagesEndRef} />
              </MessageList>
            </div>
            {isFormComplete ? (
              <>
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleSubmitApplication}
                    className="w-full"
                    disabled={!isFormComplete || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </>
            ) : (
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={conversationState.isTyping || !!isFormComplete}
                placeholder={"Type your message..."}
              />
            )}
          </CardContent>
        </Card>

        {/* Form Preview */}
        {/* Not for UI preview. Only used here to verify the form data coming from AI. Would be hidden from client in production*/}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Application Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-4">
              {/* Loan Amount */}
              <div className="space-y-2">
                <Label>Loan Amount</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={
                      conversationState.formData.loanAmount
                        ? `$${conversationState.formData.loanAmount.toLocaleString()}`
                        : ""
                    }
                    placeholder="Will be filled from conversation"
                    disabled
                    className="bg-gray-50"
                  />
                  {conversationState.formData.loanAmount && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Loan Type */}
              <div className="space-y-2">
                <Label>Loan Type</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={conversationState.formData.loanType || ""}
                    placeholder="Will be filled from conversation"
                    disabled
                    className="bg-gray-50"
                  />
                  {conversationState.formData.loanType && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={conversationState.formData.name || ""}
                    placeholder="Will be filled from conversation"
                    disabled
                    className="bg-gray-50"
                  />
                  {conversationState.formData.name && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={conversationState.formData.email || ""}
                    placeholder="Will be filled from conversation"
                    disabled
                    className="bg-gray-50"
                  />
                  {conversationState.formData.email && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={conversationState.formData.phone || ""}
                    placeholder="Will be filled from conversation"
                    disabled
                    className="bg-gray-50"
                  />
                  {conversationState.formData.phone && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
