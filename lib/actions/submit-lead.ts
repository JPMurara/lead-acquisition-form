"use server";

export async function submitLeadAction(input: {
  name: string;
  email: string;
  phone: string;
  loanAmount?: number;
  loanType?: string;
  chatHistory?: string;
}): Promise<
  | { success: true; leadId: string; accountId?: string }
  | { success: false; error: string }
> {
  if (!input.name || !input.email || !input.phone) {
    return { success: false, error: "Missing required fields" };
  }

  const leadId = `lead_${Date.now()}`;
  const accountId = `acct_${Date.now()}`;

  // TODO: Integrate with lib/lead-processor.ts and lib/salesforce.ts
  return { success: true, leadId, accountId };
}
