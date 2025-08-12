import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../ui/card";
import { Message, MessageList } from "../ui/message";
import { ChatInput } from "../ui/chat-input";
import { CheckCircle, User, Bot } from "lucide-react";
import { parseAIResponse, determineNextStep, shouldShowSubmitButton, } from "../lib/data-extraction";
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
        .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, "Please enter a valid phone number"),
    chatHistory: z.string().optional(), // Hidden field for chat history
});
export function ConversationalForm({ apiEndpoint = "/api/chat", onFormSubmit, onFormError, } = {}) {
    var _a;
    const [conversationState, setConversationState] = useState({
        currentStep: "loan_amount",
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
                const submissionData = Object.assign(Object.assign({}, value), { chatHistory: formattedChatHistory });
                const validatedData = conversationalFormSchema.parse(submissionData);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Form submitted:", validatedData);
                if (onFormSubmit) {
                    onFormSubmit(validatedData);
                }
                setIsSubmitted(true);
            }
            catch (error) {
                console.error("Error submitting form:", error);
                if (onFormError) {
                    onFormError(error);
                }
            }
            finally {
                setIsSubmitting(false);
            }
        },
    });
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [conversationState.messages]);
    // Update the useEffect to also handle chatHistory updates
    useEffect(() => {
        console.log("useEffect triggered with formData:", conversationState.formData);
        // Create a complete form data object including chat history
        const completeFormData = Object.assign(Object.assign({}, conversationState.formData), { chatHistory: conversationState.messages
                .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                .join("\n\n") });
        Object.entries(completeFormData).forEach(([field, value]) => {
            console.log(`Processing field: ${field}, value: ${value}`);
            if (value !== undefined && value !== null && value !== "") {
                console.log(`Setting field: ${field} to value: ${value}`);
                try {
                    // Convert loanAmount to string for the form
                    const formValue = field === "loanAmount" && typeof value === "number"
                        ? value.toString()
                        : value;
                    form.setFieldValue(field, String(formValue));
                    console.log(`Successfully set ${field} to ${formValue}`);
                }
                catch (error) {
                    console.error(`Error setting field ${field}:`, error);
                }
            }
            else {
                console.log(`Skipping field ${field} - value is falsy: ${value}`);
            }
        });
    }, [conversationState.formData, conversationState.messages]); // Add messages to dependency
    const handleSendMessage = async (userMessage) => {
        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content: userMessage,
            timestamp: new Date(),
        };
        setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, userMsg], isTyping: true })));
        try {
            const response = await fetch(apiEndpoint, {
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
            const extractedData = parseAIResponse(data.response, conversationState.currentStep);
            const updatedFormData = Object.assign(Object.assign({}, conversationState.formData), extractedData);
            const nextStep = determineNextStep(conversationState.currentStep, updatedFormData);
            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            };
            setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, assistantMsg], formData: updatedFormData, currentStep: nextStep, isTyping: false })));
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
    // Add function to handle chat submission
    const handleChatSubmission = async () => {
        if (isFormComplete) {
            await form.handleSubmit();
        }
    };
    const getStepProgress = () => {
        const steps = ["loan_amount", "loan_type", "personal_details"];
        const currentIndex = steps.indexOf(conversationState.currentStep);
        return Math.max(0, currentIndex);
    };
    const isFormComplete = conversationState.formData.name &&
        conversationState.formData.email &&
        conversationState.formData.phone &&
        conversationState.formData.loanAmount &&
        conversationState.formData.loanType;
    if (isSubmitted) {
        return (_jsx(Card, { className: "w-full max-w-4xl mx-auto", children: _jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-green-600 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-6 w-6" }), "Thank You!"] }), _jsx(CardDescription, { children: "Your loan application has been submitted successfully. We'll be in touch soon!" })] }) }));
    }
    return (_jsxs("div", { className: "w-full max-w-4xl mx-auto space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-lg", children: "Loan Application Progress" }), _jsxs(CardDescription, { children: ["Step ", getStepProgress() + 1, " of 3:", " ", conversationState.currentStep === "loan_amount"
                                        ? "Loan Amount"
                                        : conversationState.currentStep === "loan_type"
                                            ? "Loan Type"
                                            : conversationState.currentStep === "personal_details"
                                                ? "Personal Details"
                                                : "Complete"] })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex space-x-2", children: ["loan_amount", "loan_type", "personal_details"].map((step, index) => {
                                const isCompleted = conversationState.formData[step === "loan_amount"
                                    ? "loanAmount"
                                    : step === "loan_type"
                                        ? "loanType"
                                        : "name"];
                                const isCurrent = conversationState.currentStep === step;
                                return (_jsx("div", { className: `flex-1 h-2 rounded-full ${isCompleted
                                        ? "bg-green-500"
                                        : isCurrent
                                            ? "bg-blue-500"
                                            : "bg-gray-200"}` }, step));
                            }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "h-[600px] flex flex-col", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Bot, { className: "h-5 w-5" }), "Loan Assistant"] }), _jsx(CardDescription, { children: "Chat with our AI assistant to complete your application" })] }), _jsxs(CardContent, { className: "flex-1 flex flex-col p-0 overflow-y-auto", children: [_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsxs(MessageList, { children: [conversationState.messages.map((message) => (_jsx(Message, { role: message.role, content: message.content, timestamp: message.timestamp }, message.id))), conversationState.isTyping && (_jsx(Message, { role: "assistant", content: "", isTyping: true })), _jsx("div", { ref: messagesEndRef })] }) }), shouldShowSubmitButton(((_a = conversationState.messages[conversationState.messages.length - 1]) === null || _a === void 0 ? void 0 : _a.content) || "", conversationState.formData, conversationState.currentStep) ? (_jsx("div", { className: "p-4 border-t", children: _jsx(Button, { onClick: handleChatSubmission, disabled: isSubmitting, className: "w-full h-12 text-lg font-semibold", children: isSubmitting ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), "Submitting Application..."] })) : ("Submit Application") }) })) : (_jsx(ChatInput, { onSendMessage: handleSendMessage, disabled: Boolean(conversationState.isTyping || isFormComplete), placeholder: conversationState.currentStep === "loan_amount"
                                            ? "Enter loan amount..."
                                            : conversationState.currentStep === "loan_type"
                                                ? "Choose loan type..."
                                                : "Provide your details..." }))] })] }), _jsxs(Card, { className: "h-[600px] flex flex-col", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(User, { className: "h-5 w-5" }), "Application Summary"] }), _jsx(CardDescription, { children: "Your information will be filled as we chat" })] }), _jsxs(CardContent, { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Loan Amount" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.loanAmount
                                                                    ? `$${conversationState.formData.loanAmount.toLocaleString()}`
                                                                    : "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanAmount && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Loan Type" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.loanType || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanType && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Full Name" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.name || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.name && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Email Address" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.email || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.email && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Phone Number" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: conversationState.formData.phone || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.phone && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }))] })] })] }), _jsx("div", { className: "pt-4 border-t", children: _jsx(Button, { onClick: () => form.handleSubmit(), className: "w-full", disabled: !isFormComplete || isSubmitting, children: isSubmitting ? "Submitting..." : "Submit Application" }) })] })] })] })] }));
}
//# sourceMappingURL=ConversationalForm.js.map