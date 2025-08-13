"use server";

// "DB insert" example
async function saveLeadToDB(input: {
  name: string;
  email: string;
  phone: string;
  loanAmount?: number;
  loanType?: string;
  chatHistory?: string;
}) {
  try {
    // 1) Check if account exists (by name + email)


    // 2) If not exists, create account; else reuse existing
    
    // 3) Create lead linked to that account
    
    // Error handling case account creation or lead creation fails
}
  catch (error) {
    console.error("Error creating lead or account:", error);
    
    // Handle specific database errors like duplicated keys, etc...
   
    return { success: false, error: "Failed to create lead" };
  }
}

export async function submitLeadAction(input: {
  name: string;
  email: string;
  phone: string;
  loanAmount?: number;
  loanType?: string;
  chatHistory?: string;
}): Promise<
  { success: true; message: string } | { success: false; error: string }
> {
  try {
    // Save to own DB
    // await saveLeadToDB(input);

    // Salesforce CRM integration
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1500)
    );

    // Return success response with user-friendly message
    return {
      success: true,
      message: `Thank you ${input.name}! Your loan application  has been submitted successfully.`,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unexpected error occurred" };
  }
}
