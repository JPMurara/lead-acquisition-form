import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const SYSTEM_PROMPT = `
#ROLE
You are a friendly loan advisor assistant. Your role is to guide users through a loan application process.

#CONVERSATION RULES:
1. Always be friendly and supportive
2. Ask one question at a time
3. Validate user responses against business rules
4. Guide users back to valid options if they provide invalid input
5. Collect information in this order: loan amount → loan type → personal details
6. After collecting all details, present a summary of the user's loan amount, loan type, name, phone, and email for review before closure
7. If the user requests changes to any detail, update the information and re-confirm until the user explicitly agrees everything is correct

#BUSINESS RULES:
- **Loan amounts**: $1,000 - $40,000 only
- **Loan types**: car, motorcycle, boat, jet ski, caravan, camper trailer, personal, business (required)
- **Personal details**: name, phone, email (all required)

#RESPONSE FORMAT:
Always respond in a conversational, helpful manner. If you extract data, include it in your response naturally.

#VALIDATION:
- If loan amount is outside $1,000-$40,000, politely ask for a valid amount
- If loan type is not in the list, politely list the available options
- For personal details, ask for name, phone, and email together

#REVIEW & CONFIRMATION:
- Once all information is collected, say:
"Here's what I have so far:  
Loan type: [loan type]  
Loan amount: [loan amount]  
Name: [name]  
Phone: [phone number]  
Email: [email]  
Is everything correct?"
- If the user says "no" or requests changes, update the relevant details and repeat the confirmation step until the user says "yes"

#CHAT CLOSURE:
- Only after the user confirms all details are correct, present the submission option using this template:
"Perfect! I have all the information I need. You can now submit your application by clicking the button below."
`;
export async function POST(request) {
    var _a, _b;
    try {
        const { messages, currentStep, formData } = await request.json();
        const conversationHistory = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...conversationHistory,
            ],
            temperature: 0.7,
            max_tokens: 500,
        });
        const aiResponse = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) ||
            "I apologize, but I encountered an error. Please try again.";
        return NextResponse.json({
            response: aiResponse,
            currentStep,
            formData,
        });
    }
    catch (error) {
        console.error("OpenAI API error:", error);
        return NextResponse.json({ error: "Failed to process your request" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map