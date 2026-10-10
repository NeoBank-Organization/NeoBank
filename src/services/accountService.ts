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

import { AccountSummary, ApiResponse, TransactionItem } from '../types/account.types';
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