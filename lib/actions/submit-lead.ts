"use server";

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
    // Simulate processing
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
