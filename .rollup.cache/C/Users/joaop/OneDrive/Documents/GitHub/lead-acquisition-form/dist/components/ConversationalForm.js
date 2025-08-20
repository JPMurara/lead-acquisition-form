import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../ui/card";
import { Message, MessageList } from "../ui/message";
import { ChatInput } from "../ui/chat-input";
import { CheckCircle } from "lucide-react";
import { parseAIResponse } from "../lib/data-extraction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
export function ConversationalForm({ apiEndpoint = "/api/chat", onFormSubmit, onFormError, logoUrl, showPreview = true, }) {
    const [conversationState, setConversationState] = useState({
        messages: [
            {
                id: "1",
                role: "assistant",
                content: "Hi! I'm here to help you with your loan application. What loan amount are you considering? Please note that we only work with amounts between $1,000 and $40,000.",
                timestamp: new Date(),
            },
        ],
        formData: {},
        isTyping: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const messagesEndRef = useRef(null);
    const handleSubmitApplication = async () => {
        setIsSubmitting(true);
        try {
            const formattedChatHistory = conversationState.messages
                .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                .join("\n\n");
            const submissionData = {
                loanAmount: conversationState.formData.loanAmount,
                loanType: conversationState.formData.loanType,
                name: conversationState.formData.name,
                email: conversationState.formData.email,
                phone: conversationState.formData.phone,
                chatHistory: formattedChatHistory,
            };
            // Call the external API endpoint
            const response = await fetch(apiEndpoint.replace('/chat', '/submit'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        }
        catch (err) {
            console.error("Error submitting form:", err);
            if (onFormError) {
                onFormError(err);
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [conversationState.messages]);
    const handleSendMessage = async (userMessage) => {
        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content: userMessage,
            timestamp: new Date(),
        };
        setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, userMsg], isTyping: true })));
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
            const updatedFormData = Object.assign(Object.assign({}, conversationState.formData), extractedData);
            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            };
            setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, assistantMsg], formData: updatedFormData, isTyping: false })));
        }
        catch (error) {
            console.error("Error sending message:", error);
            if (onFormError) {
                onFormError(error);
            }
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I apologize, but I encountered an error. Please try again.",
                timestamp: new Date(),
            };
            setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, errorMsg], isTyping: false })));
        }
    };
    const isFormComplete = conversationState.formData.name &&
        conversationState.formData.email &&
        conversationState.formData.phone &&
        conversationState.formData.loanAmount &&
        conversationState.formData.loanType;
    if (isSubmitted) {
        return (_jsx(Card, { className: "w-full max-w-4xl mx-auto", children: _jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-green-600 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-6 w-6" }), "Thank You!"] }), _jsx(CardDescription, { children: "Your loan application has been submitted successfully. We'll be in touch soon!" })] }) }));
    }
    return (_jsx("div", { className: "w-full h-full flex flex-col", children: _jsxs(Tabs, { defaultValue: "chat", className: "w-full h-full flex flex-col", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 flex-shrink-0", children: [_jsx(TabsTrigger, { value: "chat", children: "Chat Assistant" }), showPreview && _jsx(TabsTrigger, { value: "preview", children: "Application Preview" })] }), _jsx(TabsContent, { value: "chat", className: "flex-1 mt-4 min-h-0", children: _jsxs(Card, { className: "h-full flex flex-col", children: [_jsxs(CardHeader, { className: "flex-shrink-0", children: [_jsxs("div", { className: "flex flex-row items-center justify-between", children: [logoUrl && (_jsx("img", { src: logoUrl, alt: "Company Logo", className: "w-20 h-auto" })), _jsx(CardTitle, { className: "flex items-center gap-2", children: "Loan Assistant" })] }), _jsx(CardDescription, { children: "Chat with our virtual assistant to complete your application" })] }), _jsxs(CardContent, { className: "flex-1 flex flex-col p-0 min-h-0", children: [_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsxs(MessageList, { children: [conversationState.messages.map((message) => (_jsx(Message, { role: message.role, content: message.content, timestamp: message.timestamp }, message.id))), conversationState.isTyping && (_jsx(Message, { role: "assistant", content: "", isTyping: true })), _jsx("div", { ref: messagesEndRef })] }) }), isFormComplete ? (_jsx(_Fragment, { children: _jsx("div", { className: "p-4 border-t flex-shrink-0", children: _jsx(Button, { onClick: handleSubmitApplication, className: "w-full", disabled: !isFormComplete || isSubmitting, children: isSubmitting ? "Submitting..." : "Submit Application" }) }) })) : (_jsx("div", { className: "flex-shrink-0", children: _jsx(ChatInput, { onSendMessage: handleSendMessage, disabled: conversationState.isTyping || !!isFormComplete, placeholder: "Type your message..." }) }))] })] }) }), showPreview && (_jsx(TabsContent, { value: "preview", className: "flex-1 mt-4 min-h-0", children: _jsxs(Card, { className: "h-full flex flex-col", children: [_jsxs(CardHeader, { className: "flex-shrink-0", children: [_jsx(CardTitle, { className: "flex items-center gap-2", children: "Form Preview" }), _jsx(CardDescription, { children: "Your information will be filled as we chat" })] }), _jsx(CardContent, { className: "flex-1 overflow-y-auto", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Loan Amount" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.loanAmount
                                                                ? `$${conversationState.formData.loanAmount.toLocaleString()}`
                                                                : "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanAmount && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Loan Type" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.loanType || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanType && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Full Name" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.name || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.name && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Email Address" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.email || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.email && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Phone Number" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.phone || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.phone && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Chat History" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.messages
                                                                .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                                                                .join("\n\n"), placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.messages && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] })] }) })] }) }))] }) }));
}
//# sourceMappingURL=ConversationalForm.js.map