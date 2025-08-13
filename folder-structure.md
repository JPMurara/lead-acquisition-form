## Repository folder structure and rationale

This project uses Next.js with Server Actions. The structure separates UI, server entrypoints, business logic, and external integrations for clarity, testability, and security.

### app/

- Purpose: Next.js routing, layouts, and pages.
- Characteristics:
  - Server Components by default for performance and security. They stream HTML, keep secrets and heavy work on the server, reduce JS shipped to the browser, and improve TTFB/SEO by default.
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
  - Start with "use server".
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
  - Encapsulates vendor-specific details, auth, retries, and data mapping.
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
