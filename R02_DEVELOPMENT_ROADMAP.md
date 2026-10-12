# NeoBank Retail Portal — R02 Development Roadmap & Component Boundary Guidelines

**Project:** NeoBank Retail Internet Banking Portal  
**Document Classification:** Developer Execution Roadmap & Governance Guide  
**Source Baseline:** NeoBank PRD, React Two-Sprint Team Planning & Backend Microservices Catalogue  

---

## 1. Developer Profile & Role Definition

| Attribute | Details |
| :--- | :--- |
| **Resource Identifier** | **R02** |
| **Developer Name** | Sayeed Alam (Syd RJ) |
| **Email** | `sydrj116@gmail.com` |
| **Git Working Branch** | `feature/accounts` |
| **Primary Domain Ownership** | **Accounts Feature Owner & Spend Insights AI Lead** |
| **PRD Modules Owned** | **BNK-FR-01** (*Accounts Domain*) & **BNK-AI-02** (*Spend Insights AI*) |
| **Target Backend Microservices**| **`customer-account-service`** (*Service 02*) & **`ai-service`** (*Service 10B - Spend Insights*) |

---

## 2. Component Boundaries: "Never Touch Other Developers' Components"

To maintain modularity and avoid breaking teammates' code or encountering git merge conflicts, development must strictly obey the following isolation rules:

### 🟢 Permitted Scope (Files & Directories You Own and Modify):
* `src/features/accounts/`
  * `AccountsDashboard.tsx` (Main accounts screen)
  * `AccountsList.tsx` (Account list container)
  * `AccountCard.tsx` (Individual account widget)
  * `AccountDetails.tsx` (Detailed view screen)
  * `AccountTabs.tsx` (Tab bar for details)
  * `AccountMasking.tsx` (Mask/unmask number toggle)
  * `AccountsStateHandlers.tsx` (Loading, error, empty, refresh states)
  * `spend-insights/`
    * `SpendInsightsDashboard.tsx` (Monthly spend overview)
    * `CategoryBreakdown.tsx` (Category progress/chart)
    * `SpendExplanationCard.tsx` (AI-generated insight badge & text)
    * `SpendAIUnavailableFallback.tsx` (Safe fallback when AI service is down)
* `src/services/accountService.ts` (API client & mock toggle for Accounts & Spend Insights)
* `src/types/account.types.ts` (TypeScript interfaces for Accounts, Transactions, & Insights)
* `src/data/accountsMock.ts` (Mock fixtures for development)

### 🔴 Strict Off-Limits (Never Modify Other Developers' Code):
| Teammate | Resource ID | Component / Directory | Primary PRD Requirements |
| :--- | :--- | :--- | :--- |
| **Mubina HVR** | **R01** | `src/components/layout/`, `src/components/security/` | Shell, Session Timeout (`BNK-FR-07`), Virtual Keyboard |
| **Poorvi K** | **R03** | `src/features/beneficiaries/` | Beneficiaries (`BNK-FR-02`), KYC AI (`BNK-AI-04`) |
| **Prashanth K** | **R04** | `src/features/fund-transfer/` | Fund Transfer Forms (`BNK-FR-03`), Fraud AI (`BNK-AI-01`) |
| **Ramya N** | **R05** | `src/features/transfer-security-upi/` | Mock UPI, OTP Modal (`BNK-FR-03`), Assistant AI (`BNK-AI-05`) |
| **Sundaravadhanisekar** | **R06** | `src/features/scheduling-statements/` | Schedules (`BNK-FR-04`), Statements & PDF (`BNK-FR-05`) |
| **Aishwarya Honawad**| **R07** | `src/features/loans/` | Loan Application & EMI (`BNK-FR-06`), Loan AI (`BNK-AI-03`)|
| **Alcious** | **R08** | `src/features/branch-admin/` | Admin Dashboard & Approvals (`BNK-FR-08`) |
| **Thejashree Y K** | **R09** | `src/features/integration-uat/` | Integration Audit, UX States & UAT Scenarios |

*Rule:* If another developer needs your account data (e.g., R04 needing source accounts for transfer), export clean helper functions/hooks from `src/features/accounts/index.ts` rather than editing their files.

---

## 3. The Exactly 7 Development Steps

Your responsibilities are structured into **7 clearly partitioned development steps**:

```
[SPRINT 1: CORE ACCOUNTS FOUNDATION]
  Step 1 ──► S1-05: Accounts Dashboard, Cards & Balance Presentation
  Step 2 ──► S1-06: Tabbed Account Details & Number Masking
  Step 3 ──► S1-07: Lifecycle State Handlers (Loading, Empty, Error, Refresh)

[SPRINT 2: SPEND INSIGHTS AI CAPABILITIES]
  Step 4 ──► S2-05: Monthly Spend Summary & Visual Breakdown
  Step 5 ──► S2-06: Category Classification & Uncategorized Spending Handler
  Step 6 ──► S2-07: Plain-Language AI Insights & Advisory Disclaimers
  Step 7 ──► S2-08: AI Resiliency, Fallback States & Cross-Module Export
```

---

### Step 1: Multi-Account Overview & Balance Cards
* **Task ID:** `S1-05`
* **Effort:** 1.5 Days
* **PRD Requirement:** `BNK-FR-01` (Accounts)
* **Backend APIs:**
  * `GET /api/v1/accounts`
  * `GET /api/v1/accounts/{accountId}/summary`
* **Deliverables:**
  * Complete `AccountsDashboard.tsx` and `AccountsList.tsx`.
  * Implement `AccountCard.tsx` with dedicated badges and styles for **Savings**, **Current**, and **Fixed Deposit (FD)**.
  * Render **Available Balance**, **Ledger Balance**, and currency code (`INR / ₹`).
* **Exit Check:** Supported account types and balances are clearly displayed with zero layout shift.

---

### Step 2: Tabbed Account Details & Number Masking
* **Task ID:** `S1-06`
* **Effort:** 1.5 Days
* **PRD Requirement:** `BNK-FR-01` (Accounts)
* **Backend APIs:**
  * `GET /api/v1/accounts/{accountId}`
  * `GET /api/v1/accounts/{accountId}/transactions?page=0&size=20&sort=transactionDate,desc`
  * `GET /api/v1/accounts/{accountId}/transactions/search`
* **Deliverables:**
  * Build `AccountDetails.tsx` and `AccountTabs.tsx` with tabs: **Overview**, **Transactions**, and **Account Info/Limits**.
  * Implement `AccountMasking.tsx` to mask sensitive account numbers by default (e.g., `•••• •••• 4091`) with an interactive reveal toggle (👁️).
  * Render paginated transactions with debit (red) and credit (green) indicators.
* **Exit Check:** Tab switching works seamlessly; masking toggle works reliably; transactions reflect accurate amounts and dates.

---

### Step 3: Lifecycle State Handlers (Loading, Empty, Error, Refresh)
* **Task ID:** `S1-07`
* **Effort:** 1.0 Day
* **PRD Requirement:** `BNK-FR-01` (Accounts)
* **Backend APIs:** Error responses (`500 Internal Error`, `401 Unauthorized`, `404 Not Found`)
* **Deliverables:**
  * Build reusable state components in `AccountsStateHandlers.tsx`:
    * **Loading:** Polished skeleton loaders matching account card and transaction table geometries.
    * **Empty:** Informative state when no accounts or transactions are present.
    * **Error:** Friendly error banner with a manual "Try Again" retry trigger.
    * **Refresh:** One-click manual refresh button to re-fetch live account balances.
* **Exit Check:** All 4 states are fully demonstrable without broken layouts.

---

### Step 4: Monthly Spend Summary & Visual Breakdown
* **Task ID:** `S2-05`
* **Effort:** 1.5 Days
* **PRD Requirement:** `BNK-AI-02` (Spend Insights)
* **Backend APIs:**
  * `GET /api/v1/spend-insights?month=YYYY-MM`
  * `GET /api/v1/spend-insights/{month}/categories`
* **Deliverables:**
  * Implement `SpendInsightsDashboard.tsx` with a month/year selector.
  * Implement `CategoryBreakdown.tsx` with graphical breakdown (progress bars/donut chart) showing monthly category totals against overall expenditure.
* **Exit Check:** Total spend accurately reflects the sum of category breakdown values.

---

### Step 5: Category Classification & Uncategorized Spending Handler
* **Task ID:** `S2-06`
* **Effort:** 1.0 Day
* **PRD Requirement:** `BNK-AI-02` (Spend Insights)
* **Backend APIs:**
  * `GET /api/v1/spend-insights/{month}/categories`
  * `GET /api/v1/spend-insights/{month}/uncategorized`
  * `PATCH /api/v1/spend-insights/transactions/{transactionId}/category` *(Optional / TBD)*
* **Deliverables:**
  * Present supported PRD categories: **Food & Dining**, **Travel**, **Bills & Utilities**, and **Others**.
  * Provide an **Uncategorized Transactions** drawer/section allowing users to review debits awaiting classification.
  * Ensure no arbitrary categories outside the PRD specification are fabricated.
* **Exit Check:** Uncategorized debits are transparently highlighted without guessing or silent drops.

---

### Step 6: Plain-Language AI Insights & Advisory Disclaimers
* **Task ID:** `S2-07`
* **Effort:** 1.0 Day
* **PRD Requirement:** `BNK-AI-02` (Spend Insights)
* **Backend APIs:**
  * `GET /api/v1/spend-insights/{month}/explanation`
* **Deliverables:**
  * Implement `SpendExplanationCard.tsx` to render natural language AI commentary (e.g., *"Your dining expenses rose 14% this month"*).
  * Enforce the **Advisory Boundary**: display a clear badge stating **"AI-Generated Advisory — For Informational Purposes Only"**.
* **Exit Check:** Users can immediately distinguish between raw authoritative ledger data and AI-generated text.

---

### Step 7: AI Resiliency, Fallback States & Cross-Module Export
* **Task ID:** `S2-08`
* **Effort:** 0.5 Day
* **PRD Requirement:** `BNK-AI-02` (Spend Insights) & Team Handoff Protocol
* **Backend APIs:** Network timeout handling, empty insight responses
* **Deliverables:**
  * Implement `SpendAIUnavailableFallback.tsx` to display safe fallback messaging when the AI microservice is offline or data is insufficient, without inventing insights.
  * Export public interfaces in `src/features/accounts/index.ts` (e.g., `useAccounts`, `getActiveSourceAccounts()`) to supply source-account feeds to **R04 (Fund Transfer)** and **R06 (Statements)**.
* **Exit Check:** AI service outages fail gracefully with a safe fallback; teammate features consume account feeds cleanly via exports.

---

## 4. Backend Microservices Reference for R02

### Service 02: `customer-account-service`
* `GET /api/v1/accounts` — Fetch customer's account list
* `GET /api/v1/accounts/{accountId}` — Fetch account details
* `GET /api/v1/accounts/{accountId}/summary` — Fetch account summary & balances
* `GET /api/v1/accounts/{accountId}/balance` — Read-only balance check
* `GET /api/v1/accounts/{accountId}/transactions` — Paginated transactions
* `GET /api/v1/accounts/{accountId}/transactions/search` — Keyword & amount filtered transactions

### Service 10B: `ai-service` (Spend Insights APIs)
* `GET /api/v1/spend-insights?month=YYYY-MM` — Monthly expenditure overview
* `GET /api/v1/spend-insights/{month}/categories` — Category breakdown
* `GET /api/v1/spend-insights/{month}/explanation` — Plain-language AI summary
* `GET /api/v1/spend-insights/{month}/uncategorized` — Unclassified debits

---

## 5. Architectural Safety Constraints
1. **Simulation Only:** All financial data remains simulated; UI copy must never claim real banking settlement.
2. **Read-Only Account Boundary:** Account Service never updates account balance directly during fund transfers; balance mutations belong strictly to `transfer-service` and `ledger-service`.
3. **AI Safety Rule:** AI Spend Insights is purely advisory and must never fabricate missing transactions or block user actions.
