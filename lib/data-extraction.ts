// Data extraction utilities for parsing AI responses

export interface ExtractedData {
  loanAmount?: number;
  loanType?: string;
  name?: string;
  email?: string;
  phone?: string;
  chatHistory?: string; // Add this field
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
  // Look for AI acknowledgments like "Thank you Kate!" or "Great, Kate!"
  const namePatterns = [
    /(?:thank you|great|perfect|excellent|awesome|thanks)\s+([a-zA-Z]+)/i, // AI acknowledgments
    /(?:thank you|great|perfect|excellent|awesome|thanks),?\s+([a-zA-Z]+)/i, // With optional comma
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

export const extractAllData = (text: string): ExtractedData => {
  const extracted: ExtractedData = {};

  // Extract from the specific AI template format
  const nameMatch = text.match(/Thank you (\[name\]|[a-zA-Z\s]+)\./i);
  const loanTypeMatch = text.match(
    /applying for a (\[loan type\]|[a-zA-Z\s]+) in the amount/
  );
  const amountMatch = text.match(/amount of (\[loan amount\]|\$?[0-9,]+)/i);
  const phoneMatch = text.match(
    /phone number as (\[phone number\]|[0-9\s\-\(\)\+]+)/i
  );
  const emailMatch = text.match(
    /email as (\[email\]|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  );

  if (nameMatch && nameMatch[1] !== "[name]") {
    extracted.name = nameMatch[1].trim();
  }

  if (loanTypeMatch && loanTypeMatch[1] !== "[loan type]") {
    extracted.loanType = loanTypeMatch[1].trim();
  }

  if (amountMatch && amountMatch[1] !== "[loan amount]") {
    const amount = parseFloat(amountMatch[1].replace(/[$,]/g, ""));
    if (!isNaN(amount)) {
      extracted.loanAmount = amount;
    }
  }

  if (phoneMatch && phoneMatch[1] !== "[phone number]") {
    extracted.phone = phoneMatch[1].trim();
  }

  if (emailMatch && emailMatch[1] !== "[email]") {
    extracted.email = emailMatch[1].trim();
  }

  return extracted;
};

// Update parseAIResponse to detect this specific template
export const parseAIResponse = (
  aiResponse: string,
  currentStep: string
): ExtractedData => {
  // Check if this is the final confirmation template
  const isFinalConfirmation =
    aiResponse.includes("Thank you") &&
    aiResponse.includes("applying for a") &&
    aiResponse.includes("amount of") &&
    aiResponse.includes("phone number as") &&
    aiResponse.includes("email as");

  if (isFinalConfirmation) {
    console.log("Detected final confirmation template, extracting all data");
    return extractAllData(aiResponse);
  }

  // For all other messages, return empty object
  return {};
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
