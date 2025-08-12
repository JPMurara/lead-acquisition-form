// Data extraction utilities for parsing AI responses

export interface ExtractedData {
  loanAmount?: number;
  loanType?: string;
  name?: string;
  email?: string;
  phone?: string;
  chatHistory?: string; // Add this field
}

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
