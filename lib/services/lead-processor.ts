import "server-only";

/**
 * Lead Processing
 *
 * This file contains the business logic, data transformation lead processing workflow.
 */

/**
 * Lead Processing Logic:
 *
 * This component manages the complete lead processing workflow by:
 * 1. **Data Validation & Transformation**: Prepares data and returns a structured, CRM-ready payload
 * 2. **Account Management**: Calls account search and creation (via salesforce.ts)
 * 3. **Lead Creation**: Calls lead creation and linking (via salesforce.ts)
 * 4. **Response Handling**: Format results and handle business logic errors
 */

/**
 * Business Rules:
 *
 * 1. **Duplicate Prevention**: Check for existing accounts before creating new ones
 * 2. **Data Validation Rules**: Validate business-specific requirements (e.g. email format, phone number format,...)
 * 3. **Lead Scoring**: Apply business rules for lead prioritization (e.g. lead scoring, lead qualification,...)
 */

/**
 * Data Transformation:
 *
 * 1. **Name**: Split full name into first/last name components
 * 2. **Phone Number Formatting**: Standardize phone number format
 * 3. **Loan Type Mapping**: Map form values to Salesforce picklist values (car loan, home loan,...)
 */

/**
 * Business Logic Error Handling:
 *
 * 1. **Validation Errors**: Data and business rule violations
 * 2. **CRM Integration Errors**: Errors from salesforce.ts operations
 * 3. **Workflow Errors**: Failed business process steps
 */
