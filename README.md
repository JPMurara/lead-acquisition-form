# Conversational Form

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager

### Installation

1. **Clone the repository** (if you haven't already):

2. **Install dependencies**: npm install

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the configuration below (that is my actual API key, so you can test in your local env, let me know once you are done testing and I will revoke the key)

   ```env
   OPENAI_API_KEY=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
   ```

4. **Start the development server**: npm run dev

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Overall Proposed Solution

The Conversational Form is an interactive form powered by OpenAI API (using GPT-4 model). It creates an engaging user experience when filling out forms, replacing the traditional static form input style with a dynamic conversation.

### Key Features

- **AI-Powered Interaction**: The assistant maintains clear boundaries within the loan application context while providing a natural conversational experience
- **Data Validation**: At the end of the conversation, the agent validates all collected information and allows users to review and update their responses before submission
- **User Control**: The actual submission is triggered by the user clicking the submit button, ensuring users maintain full control over their data

### Innovation Focus

This project demonstrates AI and innovation capabilities by leveraging large language models to transform traditional form interactions into engaging conversational experiences.

## Demo Videos

- **Quick Demo** (`quick-demo.webm`): Brief presentation of the Conversational Form.
- **Fun Demo** (`interesring-demo.webm`): Extended demonstration considering an interesting/fun loan application.

You can watch these videos directly from your IDE.

## Website Integration (Widget)

This application has been deployed as an embeddable script that can be integrated into any website's `<head>` and `<body>` sections, functioning as a widget.

- **Deployed Version**: The script is currently live but shows an older version of the application. Due to time constrains I couldn't update the embed script
- **LLM Integration**: Not functional in the deployed version due to missing server infrastructure for the LLM endpoint. However it is something somehow simple to achieve.
- **Testing**: You can test the widget functionality by embedding it in any website.

This deployment demonstrates the feasibility of creating a conversational form widget that can be easily integrated into existing websites, providing a foundation for future development with full LLM capabilities.

### Embed Script

#### Add to `<head>` section:

```html
<!-- Include React and React-DOM -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- JSX Runtime compatibility layer -->
<script>
  window.jsxRuntime = {
    jsx: React.createElement,
    jsxs: React.createElement,
    Fragment: React.Fragment,
  };
</script>

<!-- Include the widget -->
<script src="https://cdn.jsdelivr.net/npm/conversational-form-widget@1.0.0/dist/index.umd.js"></script>
```

#### Add to `<body>` section:

```html
<div id="conversational-form"></div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const { ConversationalFormWidget } = window.ConversationalFormWidget;

    const container = document.getElementById("conversational-form");
    const root = ReactDOM.createRoot(container);

    root.render(
      React.createElement(ConversationalFormWidget, {
        apiEndpoint: "https://your-api.com/api/chat",
        onFormSubmit: (data) => {
          console.log("Form submitted:", data);
          // Handle form submission
        },
        onFormError: (error) => {
          console.error("Form error:", error);
          // Handle errors
        },
      })
    );
  });
</script>
```

#### Configuration Options:

- **`apiEndpoint`**: Your server's chat API endpoint
- **`onFormSubmit`**: Callback function when form is submitted
- **`onFormError`**: Callback function for error handling

# Salesforce CRM API + Conversational Form Using OpenAI LLM Integration for Lead Acquisition Form

## Core Components

1. **SalesforceService** (`lib/salesforce.ts`)

   - Handles Salesforce connection and authentication
   - Implements SOQL queries for account search
   - Manages account and lead creation via REST API
   - Follows Interface Segregation Principle with separate interfaces for different concerns

2. **LeadProcessor** (`lib/lead-processor.ts`)

   - Orchestrates the lead processing workflow
   - Handles business logic for account/lead management
   - Provides data validation and error handling
   - Implements the Single Responsibility Principle

3. **API Endpoint** (`app/api/crm/route.ts`)
   - Generic CRM API for contact and lead management
   - Flexible request/response patterns
   - Comprehensive error handling and validation

## Data Flow

1. **Form Submission**: User completes the conversational form
2. **Validation**: Data is validated using Zod schemas
3. **Account Lookup**: System checks if account exists using SOQL query
4. **Account Creation**: If no account exists, creates new account
5. **Lead Creation**: Creates lead linked to the account
6. **Response**: Returns success/error response to client

## Salesforce Data Model

### Account Object

- **Name**: Full name of the customer
- **Email**: Customer email
- **Phone**: Customer phone number

### Lead Object

- **FirstName**: Customer first name
- **LastName**: Customer last name
- **Email**: Customer email
- **Phone**: Customer phone number
- **Company**: Customer name
- **Loan_Amount**: Requested loan amount
- **Loan_Type**: Type of loan requested
- **AccountId**: Link to associated account
- **Status**: Lead status (default: "New")

## Error Handling

The system implements comprehensive error handling:

1. **Validation Errors**: Input validation using Zod schemas
2. **Salesforce Errors**: Connection, authentication, and API errors
3. **Business Logic Errors**: Account/lead creation failures
4. **Network Errors**: Connection timeouts and network issues

## Concepts for reusability and scalability

- `SalesforceService`: Handles only Salesforce operations
- `LeadProcessor`: Manages only lead processing logic
- `CRM API Route`: Handles only HTTP request/response
- Extensive error handling and data validation

## Security Considerations

1. **Environment Variables**: Sensitive credentials stored in environment variables, such as OpenAI and Salesforce CRM API keys
2. **Input Validation**: All inputs validated using Zod schemas
3. **SQL Injection Prevention**: SOQL queries use parameterized inputs
4. **Error Information**: Limited error details exposed to clients

## Future Enhancements

1. **Database Integration**: Add local database, so we can keep track of Accounts and Leads and save to 'local' BD before CRM interaction.
2. **Webhook Support**: Real-time notifications for lead status changes
3. **Form Error**: Case form submission fails due to data types, the UI should present an form prefilled for the user who can edit any possible issues in the form input and retry to submit.
4. **Email triggers**: Submitting the loan application also triggers a email confirmation message to the client.

## Repository folder structure and rationale

This project uses Next.js with Server Actions. The structure separates UI, server entrypoints, business logic, and external integrations for clarity, testability, and security.

### app/

- Purpose: Next.js routing, layouts, and pages.
- Characteristics:
  - Server Components by default for performance and security. They stream HTML, keep secrets and heavy work on the server, reduce JS shipped to the browser, and improve SEO by default.
  - Client Components only where interactivity is needed.
- Notes: No data fetching logic here beyond small page-level composition. Complex work is delegated to actions/services.

### components/

- Purpose: Reusable UI building blocks and composite components.
- Characteristics:
  - Mark interactive components with "use client".
  - No secrets or server-only imports.
  - Accept data and callbacks via props; do not embed business logic.

### lib/

- Purpose: Application code shared across the app that is not a React component.

#### lib/actions/

- Purpose: Thin Server Action entrypoints invoked by the UI.
- Examples:
  - `lib/actions/chat.ts` → `chatAction`
  - `lib/actions/submit-lead.ts` → `submitLeadAction`
- Characteristics:
  - Parse/validate inputs, call a service, return results.
  - Keep small and transport-focused (no heavy business rules here).

#### lib/services/

- Purpose: Business rules, workflows, and orchestration that combine multiple operations.
- Example: `lib/services/lead-processor.ts`
- Characteristics:
  - Imported by actions; never by client components.
  - Add `import "server-only"` to prevent client bundling.
  - Easy to unit test by mocking integrations.

#### lib/integrations/

- Purpose: External API clients/adapters (e.g., Salesforce).
- Example: `lib/integrations/salesforce.ts`
- Characteristics:
  - Encapsulates Salesforce CRM details, auth, retries, and data mapping.
  - Add `import "server-only"` to prevent client bundling.
  - Replaceable (vendor swaps only touch this layer).

#### Other lib modules

- `lib/data-extraction.ts`: Pure client-safe helpers used by the UI for parsing/formatting.
- `lib/utils.ts`: Shared client-safe utilities (styling, helpers, etc.).

### Why this organization

- **Separation of concerns**: UI (components) vs. server entry (actions) vs. business logic (services) vs. vendors (integrations).
- **Server/client boundaries**: Actions and server-only modules keep secrets and heavy logic off the client; helpers remain client-safe.
- **Testability**: Services are testable with mocked integrations; actions remain thin and easy to reason about.
- **Scalability**: Add new features by creating a service and a small action. Swap external vendors in the integrations layer without touching the rest.
- **Next.js alignment**: Embraces Server Actions (no internal HTTP overhead), uses server-only guards, and keeps client components lean.

## State Management Strategy

This app uses a simple but effective approach to manage data and user interactions.

### How State is Organized

We use **4 types of state** to keep things organized:

1. **Server State** - Data that lives on the server (conversations, form submissions)
2. **Client State** - Using simple React hooks to manage data state that lives in the browser (current messages, loading states)
3. **Form State** - The conversation flow and collected information
4. **UI State** - Visual elements like dialogs, buttons, and animations
