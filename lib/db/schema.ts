// Drizzle ORM schema
import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

/**
 * ACCOUNTS TABLE SCHEMA
 *
 * This table stores customer account information.
 * It serves as the record for each customer and can be linked to multiple leads.
 */
export const accounts = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/**
 * LEADS TABLE SCHEMA
 *
 * This table stores individual loan application leads.
 * Each lead is linked to an account and represents a specific loan application.
 */
export const leads = pgTable("leads", {
  id: uuid().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  accountId: uuid("account_id"),
  loanAmount: integer("loan_amount"),
  loanType: text("loan_type"),
  chatHistory: text("chat_history"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
