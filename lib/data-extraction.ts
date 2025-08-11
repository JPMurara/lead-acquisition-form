// Data extraction utilities for parsing AI responses

export interface ExtractedData {
  loanAmount?: number;
  loanType?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export const extractAmount = (text: string): number | null => {
  // Match amounts like $1,000, $1000, 1000, etc.
  const amountRegex = /\$?([0-9,]+(?:\.[0-9]{2})?)/g;
  const matches = text.match(amountRegex);

  if (matches) {
    // Take the first amount found and clean it
    const amount = matches[0].replace(/[$,]/g, "");
    const numAmount = parseFloat(amount);

    // Validate range
    if (numAmount >= 1000 && numAmount <= 40000) {
      return numAmount;
    }
  }

  return null;
};

export const extractLoanType = (text: string): string | null => {
  const validLoanTypes = [
    "car loan",
    "motorcycle loan",
    "boat loan",
    "jet ski loan",
    "caravan loan",
    "camper trailer loan",
    "personal loan",
    "business loan",
  ];

  const lowerText = text.toLowerCase();

  for (const loanType of validLoanTypes) {
    if (lowerText.includes(loanType)) {
      return loanType;
    }
  }

  return null;
};

export const extractName = (text: string): string | null => {
  // Look for patterns like "my name is John" or "I'm John" or "John Doe"
  const namePatterns = [
    /(?:my name is|i'm|i am|call me)\s+([a-zA-Z\s]+)/i,
    /^([a-zA-Z\s]+)$/i, // If the entire text looks like a name
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length >= 2 && name.length <= 50) {
        return name;
      }
    }
  }

  return null;
};

export const extractEmail = (text: string): string | null => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);

  if (matches && matches[0]) {
    return matches[0].toLowerCase();
  }

  return null;
};

export const extractPhone = (text: string): string | null => {
  // Match various phone formats
  const phoneRegex =
    /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const matches = text.match(phoneRegex);

  if (matches && matches[0]) {
    // Clean the phone number
    return matches[0].replace(/[^\d+]/g, "");
  }

  return null;
};

export const parseAIResponse = (
  aiResponse: string,
  currentStep: string
): ExtractedData => {
  const extracted: ExtractedData = {};

  switch (currentStep) {
    case "loan_amount":
      const amount = extractAmount(aiResponse);
      if (amount) extracted.loanAmount = amount;
      break;

    case "loan_type":
      const loanType = extractLoanType(aiResponse);
      if (loanType) extracted.loanType = loanType;
      break;

    case "personal_details":
      const name = extractName(aiResponse);
      const email = extractEmail(aiResponse);
      const phone = extractPhone(aiResponse);

      if (name) extracted.name = name;
      if (email) extracted.email = email;
      if (phone) extracted.phone = phone;
      break;
  }

  return extracted;
};

export const determineNextStep = (
  currentStep: string,
  formData: ExtractedData
): string => {
  switch (currentStep) {
    case "loan_amount":
      return formData.loanAmount ? "loan_type" : "loan_amount";
    case "loan_type":
      return formData.loanType ? "personal_details" : "loan_type";
    case "personal_details":
      return formData.name && formData.email && formData.phone
        ? "complete"
        : "personal_details";
    default:
      return "loan_amount";
  }
};
