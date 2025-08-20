"use client";
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
import { conversationalFormSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

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

interface ConversationalFormProps {
  onSubmissionComplete?: () => void;
}

export function ConversationalForm({
  onSubmissionComplete,
}: ConversationalFormProps) {
  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      messages: [
        // Will be populated with chat history as conversation progresses
        {
          id: "1",
          role: "assistant",
          content:
            "Hi! I'm here to help you with your loan application. What loan amount are you considering? Please note that we only work with amounts between $1,000 and $40,000.",
          timestamp: new Date(),
        },
      ],
      formData: {}, // Will be populated as conversation progresses with the data extracted from the AI response
      isTyping: false, // Controls loading states
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-scroll reference for chat messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * FORM SUBMISSION HANDLER
   *
   * This function is called when the user submits the application and it does...
   * 1. Formats the chat history for storage
   * 2. Validates all collected data using Zod schema
   * 3. Calls the server action to save data
   * 4. Shows success/error feedback to user
   * 5. Closes the dialog on success
   */
  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      // Format chat history for database storage
      const formattedChatHistory = conversationState.messages
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n");

      // Prepare submission data with all collected information
      const submissionData = {
        loanAmount: conversationState.formData.loanAmount as number,
        loanType: conversationState.formData.loanType as string,
        name: conversationState.formData.name as string,
        email: conversationState.formData.email as string,
        phone: conversationState.formData.phone as string,
        chatHistory: formattedChatHistory,
      };

      // Validate data using Zod schema
      const validatedData = conversationalFormSchema.parse(submissionData);

      // Call server action to save data to database and CRM integration
      const result = await submitLeadAction(validatedData);
      if (!result.success) {
        throw new Error(result.error || "Failed to submit lead");
      }

      // Show success feedback to user
      toast.success("Application Submitted!", {
        description: result.message,
        duration: 5000,
      });

      // Close the dialog
      if (onSubmissionComplete) {
        onSubmissionComplete();
      }
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationState.messages]);

  /**
   * MESSAGE HANDLER
   *
   * This function processes messages and manages the conversation flow:
   * 1. Adds messages to chat history
   * 2. Shows typing indicator
   * 3. Integrates with OpenAI API using server action
   * 4. Extracts data from AI response
   */
  const handleSendMessage = async (userMessage: string) => {
    // Create user message object
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    // Add user message and show typing indicator
    setConversationState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isTyping: true,
    }));

    try {
      // Prepare message data for AI processing
      const transformedMessageData = [
        ...conversationState.messages,
        userMsg,
      ].map((m) => ({ role: m.role, content: m.content }));

      // Send conversation to the LLM via server action
      const data = await chatAction({
        messages: transformedMessageData,
        formData: conversationState.formData,
      });

      // Extract structured data from AI response (only on final confirmation)
      const extractedData = parseAIResponse(data.response);
      const updatedFormData = {
        ...conversationState.formData,
        ...extractedData,
      };

      // Create AI response message
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      // Update state with AI response and extracted data
      setConversationState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
        formData: updatedFormData,
        isTyping: false,
      }));
    } catch (error) {
      console.error("Error sending message:", error);

      // Show error message to user, e.g. invalid API key, etc
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

  // Check if all required form fields are completed - logic to show the submit button or the chat input
  const isFormComplete =
    conversationState.formData.name &&
    conversationState.formData.email &&
    conversationState.formData.phone &&
    conversationState.formData.loanAmount &&
    conversationState.formData.loanType;

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
          <TabsTrigger value="chat">Loan Application</TabsTrigger>
          <TabsTrigger value="preview">Application Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 mt-4 min-h-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex flex-row items-center justify-between">
                <Image
                  src="https://www.umeloans.com.au/wp-content/uploads/2024/11/UME-logo-new-with-registered-trademark-2024.png"
                  alt="UME Logo"
                  width={80}
                  height={40}
                  className="w-20 h-auto"
                />
                <CardTitle className="flex items-center gap-2">
                  Loan Assistant
                </CardTitle>
              </div>
              <CardDescription>
                Chat with our virtual assistant to complete your application
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
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
                  <div className="p-4 border-t flex-shrink-0">
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
                <div className="flex-shrink-0">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={conversationState.isTyping || !!isFormComplete}
                    placeholder={"Type your message..."}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 mt-4 min-h-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                Form Preview
              </CardTitle>
              <CardDescription>
                Used for testing purposes only. Not for production.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
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

                <div className="space-y-2">
                  <Label>Chat History</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={conversationState.messages
                        .map(
                          (msg) => `${msg.role.toUpperCase()}: ${msg.content}`
                        )
                        .join("\n\n")}
                      placeholder="Will be filled from conversation"
                      disabled
                      className="bg-gray-50"
                    />
                    {conversationState.messages && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
