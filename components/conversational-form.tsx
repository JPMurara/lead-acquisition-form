"use client";

import { useForm } from "@tanstack/react-form";
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
import { CheckCircle, User, Bot } from "lucide-react";
import {
  parseAIResponse,
  ExtractedData,
  determineNextStep,
} from "@/lib/data-extraction";

// Updated Zod schema to include chat history
const conversationalFormSchema = z.object({
  loanAmount: z
    .number()
    .min(1000, "Loan amount must be at least $1,000")
    .max(40000, "Loan amount must be no more than $40,000"),
  loanType: z.string().min(1, "Loan type is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/,
      "Please enter a valid phone number"
    ),
  chatHistory: z.string().optional(), // Hidden field for chat history
});

type FormData = z.infer<typeof conversationalFormSchema>;

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ConversationState {
  currentStep: "loan_amount" | "loan_type" | "personal_details" | "complete";
  messages: Message[];
  formData: ExtractedData;
  isTyping: boolean;
}

export function ConversationalForm() {
  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      currentStep: "loan_amount",
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    defaultValues: {
      loanAmount: "", // Change from undefined to empty string
      loanType: "",
      name: "",
      email: "",
      phone: "",
      chatHistory: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Format chat history before submission
        const formattedChatHistory = conversationState.messages
          .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join("\n\n");

        const submissionData = {
          ...value,
          chatHistory: formattedChatHistory,
        };

        const validatedData = conversationalFormSchema.parse(submissionData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form submitted:", validatedData);
        setIsSubmitted(true);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationState.messages]);

  // Update the useEffect to also handle chatHistory updates
  useEffect(() => {
    // Create a complete form data object including chat history
    const completeFormData = {
      ...conversationState.formData,
      chatHistory: conversationState.messages
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n"),
    };

    Object.entries(completeFormData).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        try {
          // Convert loanAmount to string for the form
          const formValue =
            field === "loanAmount" && typeof value === "number"
              ? value.toString()
              : String(value);
          form.setFieldValue(field as keyof FormData, formValue);
        } catch (error) {
          console.error(`Error setting field ${field}:`, error);
        }
      }
    });
  }, [conversationState.formData, conversationState.messages]); // Add messages to dependency

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...conversationState.messages, userMsg],
          currentStep: conversationState.currentStep,
          formData: conversationState.formData,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Extract data from AI response (only on final confirmation)
      const extractedData = parseAIResponse(
        data.response,
        conversationState.currentStep
      );

      const updatedFormData = {
        ...conversationState.formData,
        ...extractedData,
      };

      const nextStep = determineNextStep(
        conversationState.currentStep,
        updatedFormData
      );

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
        currentStep: nextStep as any,
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

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Thank You!
          </CardTitle>
          <CardDescription>
            Your loan application has been submitted successfully. We'll be in
            touch soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Loan Assistant
            </CardTitle>
            <CardDescription>
              Chat with our AI assistant to complete your application
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
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={conversationState.isTyping || !!isFormComplete}
              placeholder={
                conversationState.currentStep === "loan_amount"
                  ? "Enter loan amount..."
                  : conversationState.currentStep === "loan_type"
                  ? "Choose loan type..."
                  : "Provide your details..."
              }
            />
          </CardContent>
        </Card>

        {/* Form Preview */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Application Summary
            </CardTitle>
            <CardDescription>
              Your information will be filled as we chat
            </CardDescription>
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

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={() => form.handleSubmit()}
                className="w-full"
                disabled={!isFormComplete || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
