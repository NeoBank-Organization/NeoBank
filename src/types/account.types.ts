/**
 * ============================================================================
 * MODULE: account.types.ts
 * DESCRIPTION: Canonical TypeScript interfaces for Account Domain & Spend Insights
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * ============================================================================
 */

export type AccountType = 'SAVINGS' | 'CURRENT' | 'FD';

export type AccountStatus = 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'MATURED';

export interface AccountSummary {
  accountId: string;
  customerId: string;
  accountNumber: string;
  maskedAccountNumber: string;
  accountName: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  availableBalance: number;
  ledgerBalance: number;
  currency: string;
  interestRate?: number;
  maturityDate?: string;
  fdTenureMonths?: number;
  branchName: string;
  ifscCode: string;
  isPrimary?: boolean;
  micrCode?: string;
  openedDate?: string;
  dailyTransferLimit?: number;
  usedDailyLimit?: number;
  upiDailyLimit?: number;
  atmLimit?: number;
  posLimit?: number;
  nomineeName?: string;
  nomineeRegistered?: boolean;
}

export type TransactionType = 'DEBIT' | 'CREDIT';

export type TransactionCategory =
  | 'FOOD'
  | 'TRAVEL'
  | 'BILLS'
  | 'SHOPPING'
  | 'TRANSFERS'
  | 'INVESTMENTS'
  | 'OTHERS'
  | 'UNCATEGORIZED';

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface TransactionItem {
  transactionId: string;
  accountId: string;
  transactionDate: string;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  status: TransactionStatus;
  referenceNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  correlationId: string;
}

export interface CategorySpendSummary {
  category: TransactionCategory;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
}

export interface SpendInsightResponse {
  month: string;
  totalSpend: number;
  currency: string;
  categories: CategorySpendSummary[];
  aiExplanation?: string;
  uncategorizedCount: number;
  isAiGenerated: boolean;
  disclaimer: string;
}
