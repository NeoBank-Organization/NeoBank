/**
 * ============================================================================
 * SERVICE: accountService.ts
 * DESCRIPTION: API integration and mock service layer for Customer Accounts & Spend Insights
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * ============================================================================
 */

import { 
  AccountSummary, 
  ApiResponse, 
  TransactionItem,
  CategorySpendSummary,
  SpendInsightResponse,
} from '../types/account.types';
import { accountsMock, mockTransactions } from '../data/accountsMock';

// Switch to false when backend services are live
const USE_MOCK = true;

const API_BASE_URL = 'http://localhost:8080/api/v1';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Correlation-Id': `CORR-${Date.now()}`
  };
};

/**
 * Fetch all accounts belonging to the authenticated customer
 * Microservice: customer-account-service -> GET /api/v1/accounts
 */
export const getAccounts = async (): Promise<AccountSummary[]> => {
  if (USE_MOCK) {
    await delay(600);
    return [...accountsMock];
  }

  const res = await fetch(`${API_BASE_URL}/accounts`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status}`);
  const body: ApiResponse<AccountSummary[]> = await res.json();
  return body.data;
};

/**
 * Fetch detailed summary of a specific account
 * Microservice: customer-account-service -> GET /api/v1/accounts/{accountId}/summary
 */
export const getAccountSummary = async (accountId: string): Promise<AccountSummary> => {
  if (USE_MOCK) {
    await delay(400);
    const item = accountsMock.find((a) => a.accountId === accountId);
    if (!item) throw new Error(`Account ${accountId} not found`);
    return item;
  }

  const res = await fetch(`${API_BASE_URL}/accounts/${accountId}/summary`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status}`);
  const body: ApiResponse<AccountSummary> = await res.json();
  return body.data;
};

/**
 * Fetch paginated transaction records for an account
 * Microservice: customer-account-service -> GET /api/v1/accounts/{accountId}/transactions
 */
export const getAccountTransactions = async (accountId: string): Promise<TransactionItem[]> => {
  if (USE_MOCK) {
    await delay(500);
    return mockTransactions[accountId] || [];
  }

  const res = await fetch(`${API_BASE_URL}/accounts/${accountId}/transactions?page=0&size=20&sort=transactionDate,desc`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status}`);
  const body: ApiResponse<TransactionItem[]> = await res.json();
  return body.data;
};
// Added by Prashanth
/**
 * Alias for getAccountSummary aligning with GET /api/v1/accounts/{accountId}
 */
export const getAccountById = getAccountSummary;

/**
 * Search transaction records for an account
 * Microservice: customer-account-service -> GET /api/v1/accounts/{accountId}/transactions/search
 */
export const searchAccountTransactions = async (
  accountId: string,
  query: string
): Promise<TransactionItem[]> => {
  if (USE_MOCK) {
    await delay(300);
    const all = mockTransactions[accountId] || [];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        tx.referenceNumber.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
    );
  }

  const res = await fetch(`${API_BASE_URL}/accounts/${accountId}/transactions/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status}`);
  const body: ApiResponse<TransactionItem[]> = await res.json();
  return body.data;
};

// Seed dataset for PRD BNK-AI-02 Monthly Spend Insights
const mockSpendInsightsByMonth: Record<string, SpendInsightResponse> = {
  '2026-10': {
    month: '2026-10',
    totalSpend: 48920,
    currency: 'INR',
    uncategorizedCount: 2,
    isAiGenerated: true,
    disclaimer: 'Spend Insights AI provides advisory analytics based on debited transactions. This does not constitute certified tax or audit advice.',
    aiExplanation: 'Your overall spend for October 2026 is ₹48,920.00. Food & Dining is your top expense at 37.7%, followed by utility bills.',
    categories: [
      {
        category: 'FOOD',
        categoryName: 'Food & Dining',
        amount: 18450,
        percentage: 37.7,
        transactionCount: 14,
        color: '#F97316',
      },
      {
        category: 'BILLS',
        categoryName: 'Bills & Utilities',
        amount: 12850,
        percentage: 26.3,
        transactionCount: 4,
        color: '#EAB308',
      },
      {
        category: 'TRAVEL',
        categoryName: 'Travel & Transport',
        amount: 7620,
        percentage: 15.6,
        transactionCount: 6,
        color: '#0284C7',
      },
      {
        category: 'SHOPPING',
        categoryName: 'Shopping & Retail',
        amount: 5400,
        percentage: 11.0,
        transactionCount: 3,
        color: '#EC4899',
      },
      {
        category: 'INVESTMENTS',
        categoryName: 'Investments',
        amount: 3000,
        percentage: 6.1,
        transactionCount: 1,
        color: '#8B5CF6',
      },
      {
        category: 'OTHERS',
        categoryName: 'Other Expenses',
        amount: 1600,
        percentage: 3.3,
        transactionCount: 2,
        color: '#64748B',
      },
    ],
  },
  '2026-09': {
    month: '2026-09',
    totalSpend: 53420,
    currency: 'INR',
    uncategorizedCount: 1,
    isAiGenerated: true,
    disclaimer: 'Spend Insights AI provides advisory analytics based on debited transactions. This does not constitute certified tax or audit advice.',
    aiExplanation: 'Your overall spend for September 2026 was ₹53,420.00. Bills & Utilities and Shopping accounted for the majority of the monthly expenditure.',
    categories: [
      {
        category: 'BILLS',
        categoryName: 'Bills & Utilities',
        amount: 16200,
        percentage: 30.3,
        transactionCount: 5,
        color: '#EAB308',
      },
      {
        category: 'FOOD',
        categoryName: 'Food & Dining',
        amount: 14800,
        percentage: 27.7,
        transactionCount: 16,
        color: '#F97316',
      },
      {
        category: 'SHOPPING',
        categoryName: 'Shopping & Retail',
        amount: 11200,
        percentage: 21.0,
        transactionCount: 5,
        color: '#EC4899',
      },
      {
        category: 'TRAVEL',
        categoryName: 'Travel & Transport',
        amount: 6420,
        percentage: 12.0,
        transactionCount: 5,
        color: '#0284C7',
      },
      {
        category: 'OTHERS',
        categoryName: 'Other Expenses',
        amount: 4800,
        percentage: 9.0,
        transactionCount: 3,
        color: '#64748B',
      },
    ],
  },
  '2026-08': {
    month: '2026-08',
    totalSpend: 42150,
    currency: 'INR',
    uncategorizedCount: 0,
    isAiGenerated: true,
    disclaimer: 'Spend Insights AI provides advisory analytics based on debited transactions. This does not constitute certified tax or audit advice.',
    aiExplanation: 'Your overall spend for August 2026 was ₹42,150.00. Dining and living utility bills remained well within the typical quarterly baseline.',
    categories: [
      {
        category: 'FOOD',
        categoryName: 'Food & Dining',
        amount: 15300,
        percentage: 36.3,
        transactionCount: 12,
        color: '#F97316',
      },
      {
        category: 'BILLS',
        categoryName: 'Bills & Utilities',
        amount: 11500,
        percentage: 27.3,
        transactionCount: 4,
        color: '#EAB308',
      },
      {
        category: 'SHOPPING',
        categoryName: 'Shopping & Retail',
        amount: 7850,
        percentage: 18.6,
        transactionCount: 4,
        color: '#EC4899',
      },
      {
        category: 'TRAVEL',
        categoryName: 'Travel & Transport',
        amount: 5500,
        percentage: 13.0,
        transactionCount: 4,
        color: '#0284C7',
      },
      {
        category: 'OTHERS',
        categoryName: 'Other Expenses',
        amount: 2000,
        percentage: 4.8,
        transactionCount: 2,
        color: '#64748B',
      },
    ],
  },
};

/**
 * Fetch monthly spend insights summary & categorized totals
 * Microservice: customer-account-service / spend-insights-service
 * Endpoint: GET /api/v1/spend-insights?month=YYYY-MM
 */
export const getSpendInsights = async (month: string): Promise<SpendInsightResponse> => {
  if (USE_MOCK) {
    await delay(450);
    const existing = mockSpendInsightsByMonth[month];
    if (existing) {
      return existing;
    }

    // Dynamic derivation for any other month
    const defaultData: SpendInsightResponse = {
      month,
      totalSpend: 36500,
      currency: 'INR',
      uncategorizedCount: 0,
      isAiGenerated: true,
      disclaimer: 'Spend Insights AI provides advisory analytics based on debited transactions. This does not constitute certified tax or audit advice.',
      aiExplanation: `Spend summary for ${month}: General expenditure across utility, food, and merchant categories.`,
      categories: [
        {
          category: 'FOOD',
          categoryName: 'Food & Dining',
          amount: 14000,
          percentage: 38.4,
          transactionCount: 11,
          color: '#F97316',
        },
        {
          category: 'BILLS',
          categoryName: 'Bills & Utilities',
          amount: 11500,
          percentage: 31.5,
          transactionCount: 4,
          color: '#EAB308',
        },
        {
          category: 'TRAVEL',
          categoryName: 'Travel & Transport',
          amount: 6000,
          percentage: 16.4,
          transactionCount: 4,
          color: '#0284C7',
        },
        {
          category: 'OTHERS',
          categoryName: 'Other Expenses',
          amount: 5000,
          percentage: 13.7,
          transactionCount: 2,
          color: '#64748B',
        },
      ],
    };
    return defaultData;
  }

  const res = await fetch(`${API_BASE_URL}/spend-insights?month=${encodeURIComponent(month)}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch spend insights: ${res.status}`);
  const body: ApiResponse<SpendInsightResponse> = await res.json();
  return body.data;
};

/**
 * Fetch monthly category breakdown array
 * Microservice: customer-account-service / spend-insights-service
 * Endpoint: GET /api/v1/spend-insights/{month}/categories
 */
export const getSpendCategories = async (
  month: string
): Promise<CategorySpendSummary[]> => {
  if (USE_MOCK) {
    const insight = await getSpendInsights(month);
    return insight.categories;
  }

  const res = await fetch(`${API_BASE_URL}/spend-insights/${encodeURIComponent(month)}/categories`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch category breakdown: ${res.status}`);
  const body: ApiResponse<CategorySpendSummary[]> = await res.json();
  return body.data;
};