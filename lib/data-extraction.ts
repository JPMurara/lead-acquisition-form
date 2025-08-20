export interface ExtractedData {
  loanAmount?: number;
  loanType?: string;
  name?: string;
  email?: string;
  phone?: string;
  chatHistory?: string;
}

export const extractAllData = (text: string): ExtractedData => {
  const extracted: ExtractedData = {};

  const nameMatch = text.match(/Name: (\[name\]|[a-zA-Z\s]+)\.?$/im);
  const loanTypeMatch = text.match(
    /Loan type:\s*(\[loan type\]|[^\r\n]+?)\.?\s*$/im
  );

  const amountMatch = text.match(
    /Loan amount:\s*(\[loan amount\]|\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*$/im
  );

  const phoneMatch = text.match(
    /Phone:\s*(\[phone number\]|[0-9 ()+\-]+)\s*$/im
  );

  const emailMatch = text.match(
    /Email:\s*(\[email\]|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,})\s*$/im
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

export const parseAIResponse = (aiResponse: string): ExtractedData => {
  // Check if this is the final confirmation template
  const isFinalConfirmation =
    aiResponse.includes("Thank") &&
    aiResponse.includes("submit button") &&
    aiResponse.includes("Loan type") &&
    aiResponse.includes("Name") &&
    aiResponse.includes("Phone") &&
    aiResponse.includes("Email");

  if (isFinalConfirmation) {
    // returns the extracted data for the form data
    return extractAllData(aiResponse);
  }
  // For all other messages, return empty object
  return {};
};
