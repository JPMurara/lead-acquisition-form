/**
 * Salesforce Integration
 *
 * This file handles direct Salesforce CRM operations: Salesforce connection, authentication, and CRUD operations.
 */

/**
 * Responsibilities:
 *
 * 1. **Salesforce API Connection**: Handle Salesforce authentication and sessions
 * 2. **Account Operations**: Find and create Account records
 * 3. **Lead Operations**: Create Lead records
 * 4. **SOQL Queries**: Execute Salesforce SOQL queries
 * 5. **Error Handling**: Handle Salesforce-specific errors
 * 6. **Authentication**: Authentication with security token
 */

/**
 * 1. Account Search:
 * - SOQL query to find existing accounts by name and email, I also consider phone number as additional matching criteria
 * - Returns account details if found, null if not found
 *
 * 2. Account Creation:
 * IF account is not found, creates a new account
 * - Creates new Account record in Salesforce
 * - Sets required fields
 * - Returns created account with Salesforce ID
 *
 * 3. Lead Creation:
 * - Creates new Lead record in Salesforce
 * - Links lead to existing or newly created accounts (from previous step)
 * - Sets all required fields
 * - Returns created lead with Salesforce ID
 */

/**
 * Salesforce Error Handling:
 * - API rate limiting and retry logic
 * - Validation error handling
 * - Connection timeout handling
 * - Salesforce-specific error codes
 */
