/**
 * Generic CRM API Route
 *
 * Role in the architecture:
 * - Acts as the HTTP gateway for CRM-related operations
 * - Coordinates the two core services:
 *   - lead-processor.ts → business rules, validation and data transformation
 *   - salesforce.ts → direct Salesforce (SOQL/REST) operations
 * - Does NOT implement business rules or Salesforce calls itself
 *
 * Focus: HTTP handling, light request validation, orchestration, and response formatting.
 */

/**
 * Route Design:
 *
 * The API follows REST principles and provides generic endpoints for
 * common CRM operations. This approach allows for:
 * 1. **Flexibility**: Handle different types of CRM operations
 * 2. **Reusability**: Same endpoints for different business processes
 * 3. **Maintainability**: Centralized CRM logic
 * 4. **Scalability**: Easy to extend for new requirements
 * 5. **Security**: Authentication, token and rate limiting
 * 6. **Data transformation**: Transform data to match the Salesforce schema
 */

/**
 * API Endpoints Structure:
 *
 * POST /api/crm
 * - Receives a request (e.g., to create a lead)
 * - Uses lead-processor.ts to validate/transform the payload
 * - Uses salesforce.ts to search/create Account and create Lead
 * - Returns a concise result (e.g., accountId, leadId)
 */

/**
 * How this file manages lead-processor.ts and salesforce.ts:
 * 1. The API route (route.ts) calls lead-processor.ts first to prepare data
 * 2. Then the API route passes that prepared data into salesforce.ts methods
 *
 * 2.1. **Account Search Logic**:
 *    - Search for a combination of name and email
 *    - Return the matched account
 *
 * 2.2. **Duplicate Prevention**:
 *    - Check for exact email and name
 *
 * 2.3. IF no account is found -> **Account Creation**:
 *    - Validate all required fields
 *    - Set appropriate values for account fields
 *    - Perform account creation
 *
 * 2.4. **Lead creation**:
 *    - Create a new lead record
 *    - Set appropriate values for lead fields
 *    - Perform lead creation linked to the account (either existing or new)
 */

/**
 * Error Handling Strategy:
 *
 * 1. **Validation Errors**
 *    - Field-level validation failures
 *    - Missing required fields
 *    - Invalid data formats
 *
 * 2. **Authentication Errors**
 *    - Invalid API credentials
 *    - Expired authentication tokens
 *
 */
