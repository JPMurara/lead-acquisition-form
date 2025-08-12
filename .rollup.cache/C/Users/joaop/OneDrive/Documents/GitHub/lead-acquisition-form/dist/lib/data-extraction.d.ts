export interface ExtractedData {
    loanAmount?: number;
    loanType?: string;
    name?: string;
    email?: string;
    phone?: string;
    chatHistory?: string;
}
export declare const extractAmount: (text: string) => number | null;
export declare const extractLoanType: (text: string) => string | null;
export declare const extractName: (text: string) => string | null;
export declare const extractEmail: (text: string) => string | null;
export declare const extractPhone: (text: string) => string | null;
export declare const extractAllData: (text: string) => ExtractedData;
export declare const parseAIResponse: (aiResponse: string, currentStep: string) => ExtractedData;
export declare const determineNextStep: (currentStep: string, formData: ExtractedData) => string;
export declare const shouldShowSubmitButton: (aiResponse: string, formData: ExtractedData, currentStep: string) => boolean;
