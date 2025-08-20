export interface ExtractedData {
    loanAmount?: number;
    loanType?: string;
    name?: string;
    email?: string;
    phone?: string;
    chatHistory?: string;
}
export declare const extractAllData: (text: string) => ExtractedData;
export declare const parseAIResponse: (aiResponse: string) => ExtractedData;
