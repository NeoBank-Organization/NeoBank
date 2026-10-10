/**
 * ============================================================================
 * COMPONENT: StatementsDashboard.tsx
 * DESCRIPTION: Account statement generation portal supporting custom date ranges and formats.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R06 - Sundaravadhanisekar
 * EMAIL: sundaravadhanisekar@gmail.com
 * ROLE: Scheduling & Statements feature owner
 * PRD REQUIREMENTS: BNK-FR-04 (Scheduled Transfers), BNK-FR-05 (Statements)
 * SPRINT DELIVERABLES: Sprint 1 (S1-20, S1-21, S1-22, S1-23) & Sprint 2 (S2-21, S2-22)
 * PRIMARY RESPONSIBILITIES: Scheduled transfers, date picker/recurrence, statement generation/view/download
 * ============================================================================
 */

import React, { useMemo, useState } from 'react';
import { StatementDateRangePicker } from './StatementDateRangePicker';
import { createStatement } from './StatementGenerator';
import type {
  GeneratedStatement,
  StatementRange,
  StatementTransaction,
} from './StatementGenerator';
import { StatementDownloadButton } from './StatementDownloadButton';
import { StatementPDFViewer } from './StatementPDFViewer';

interface StatementsDashboardProps {
  transactions?: StatementTransaction[];
  accountName?: string;
  accountNumber?: string;
  currency?: string;
}

const todayInputValue = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;
};

const offsetDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return todayInputValueFor(date);
};

const todayInputValueFor = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;

const DEMO_TRANSACTIONS: StatementTransaction[] = [
  { id: 'txn-1', date: offsetDate(3), description: 'Salary credit', amount: 68500, balance: 124850 },
  { id: 'txn-2', date: offsetDate(8), description: 'Grocery store', amount: -2845, balance: 56350 },
  { id: 'txn-3', date: offsetDate(15), description: 'Electricity bill', amount: -1930, balance: 59195 },
  { id: 'txn-4', date: offsetDate(22), description: 'Online shopping', amount: -4299, balance: 61125 },
  { id: 'txn-5', date: offsetDate(27), description: 'UPI transfer received', amount: 2500, balance: 65424 },
];

export const StatementsDashboard: React.FC<StatementsDashboardProps> = ({
  transactions,
  accountName = 'Aarav Mehta',
  accountNumber = '•••• 4582',
  currency = 'INR',
}) => {
  const statementTransactions = transactions ?? DEMO_TRANSACTIONS;
  const [range, setRange] = useState<StatementRange>({
    startDate: offsetDate(30),
    endDate: todayInputValue(),
  });
  const [statement, setStatement] = useState<GeneratedStatement | null>(null);
  const [statementError, setStatementError] = useState('');

  const transactionsInRange = useMemo(
    () =>
      statementTransactions.filter((transaction) => {
        const date = transaction.date.slice(0, 10);
        return (
          Boolean(range.startDate && range.endDate) &&
          date >= range.startDate &&
          date <= range.endDate
        );
      }),
    [statementTransactions, range],
  );

  const handleRangeChange = (nextRange: StatementRange) => {
    setRange(nextRange);
    setStatement(null);
    setStatementError('');
  };

  const submitStatement = () => {
    setStatementError('');
    try {
      setStatement(
        createStatement(
          range,
          transactionsInRange,
          accountName,
          accountNumber,
          currency,
        ),
      );
    } catch (error) {
      setStatementError(
        error instanceof Error
          ? error.message
          : 'The statement could not be generated. Please try again.',
      );
    }
  };

  return (
    <main
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      aria-labelledby="statements-dashboard-title"
    >
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-600">
            Banking · Documents
          </p>
          <h1
            id="statements-dashboard-title"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Statements
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            View your account activity, choose a date range, and download a statement.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Account</p>
          <p className="mt-1 font-semibold text-slate-900">{accountName}</p>
          <p className="text-sm text-slate-500">{accountNumber}</p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Transactions in selected period</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {transactionsInRange.length}
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-xl text-primary-700" aria-hidden="true">
              ↕
            </span>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Statement period</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {range.startDate} – {range.endDate}
              </p>
              <p className="mt-1 text-sm text-slate-500">Choose a preset or custom dates below</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700" aria-hidden="true">
              ✓
            </span>
          </div>
        </article>
      </section>

      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <StatementDateRangePicker
            value={range}
            onChange={handleRangeChange}
            onSubmit={submitStatement}
          />
        </div>
        <div className="min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <StatementPDFViewer statement={statement} />
          <StatementDownloadButton statement={statement} />
          {statementError && (
            <p
              className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
              role="alert"
            >
              {statementError}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};
