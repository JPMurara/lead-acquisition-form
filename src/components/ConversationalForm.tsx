import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Message, MessageList } from "../ui/message";
import { ChatInput } from "../ui/chat-input";
import { CheckCircle, CloudCog } from "lucide-react";
import { parseAIResponse, ExtractedData } from "../lib/data-extraction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
  apiEndpoint?: string;
  onFormSubmit?: (data: any) => void;
  onFormError?: (error: any) => void;
  logoUrl?: string;
  showPreview?: boolean;
}

export function ConversationalForm({
  apiEndpoint = "/api/chat",
  onFormSubmit,
  onFormError,
  logoUrl,
  showPreview = true,
}: ConversationalFormProps) {
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
  const [isSubmitted, setIsSubmitted] = useState(false);
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

      // Call the external API endpoint
      const response = await fetch(apiEndpoint.replace("/chat", "/submit"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to submit lead");
      }

      if (onFormSubmit) {
        onFormSubmit(submissionData);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      if (onFormError) {
        onFormError(err);
      }
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
      const transformedMessageData = [
        ...conversationState.messages,
        userMsg,
      ].map((m) => ({ role: m.role, content: m.content }));

      // Send the user message to the external API
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: transformedMessageData,
          formData: conversationState.formData,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

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
      if (onFormError) {
        onFormError(error);
      }
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
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          {showPreview && (
            <TabsTrigger value="preview">Application Preview</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="chat" className="flex-1 mt-4 min-h-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex flex-row items-center justify-between">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="w-20 h-auto"
                  />
                )}
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

        {showPreview && (
          <TabsContent value="preview" className="flex-1 mt-4 min-h-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  Form Preview
                </CardTitle>
                <CardDescription>
                  Your information will be filled as we chat
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
        )}
      </Tabs>
    </div>
  );
}
