/**
 * ============================================================================
 * COMPONENT: AccountsDashboard.tsx
 * DESCRIPTION: Primary customer accounts dashboard displaying Savings, Current, and Fixed Deposit balances.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React from 'react';

export const AccountsDashboard: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-sm font-medium text-blue-700">Your finances</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Accounts overview
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          View your accounts and balances in one place.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-700">
          ▣
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          No account details to display
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Your account information isn’t available yet. Once account data is
          connected, your balances and account details will appear here.
        </p>
      </div>
    </section>
  );
};
