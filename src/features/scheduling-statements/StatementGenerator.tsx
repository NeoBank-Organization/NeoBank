/**
 * ============================================================================
 * COMPONENT: StatementGenerator.tsx
 * DESCRIPTION: State component handling async statement generation and download links.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R06 - Sundaravadhanisekar
 * EMAIL: sundaravadhanisekar@gmail.com
 * ROLE: Scheduling & Statements feature owner
 * PRD REQUIREMENTS: BNK-FR-04 (Scheduled Transfers), BNK-FR-05 (Statements)
 * SPRINT DELIVERABLES: Sprint 1 (S1-20, S1-21, S1-22, S1-23) & Sprint 2 (S2-21, S2-22)
 * PRIMARY RESPONSIBILITIES: Scheduled transfers, date picker/recurrence, statement generation/view/download
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';

export interface StatementRange {
  startDate: string;
  endDate: string;
}

export interface StatementTransaction {
  id?: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
}

export interface GeneratedStatement {
  fileName: string;
  html: string;
  csv: string;
  range: StatementRange;
  transactionCount: number;
  generatedAt: string;
}

interface StatementGeneratorProps {
  startDate: string;
  endDate: string;
  transactions?: StatementTransaction[];
  accountName?: string;
  accountNumber?: string;
  currency?: string;
  onGenerated?: (statement: GeneratedStatement) => void | Promise<void>;
}

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

const csvCell = (value: string | number): string =>
  `"${String(value).replace(/"/g, '""')}"`;

const formatAmount = (amount: number, currency: string): string =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);

export const createStatement = (
  range: StatementRange,
  transactions: StatementTransaction[],
  accountName: string,
  accountNumber: string,
  currency: string,
): GeneratedStatement => {
  const sortedTransactions = [...transactions].sort((first, second) =>
    first.date.localeCompare(second.date),
  );
  const rows = sortedTransactions
    .map(
      (transaction) =>
        `<tr><td>${escapeHtml(transaction.date)}</td><td>${escapeHtml(transaction.description)}</td><td>${escapeHtml(formatAmount(transaction.amount, currency))}</td><td>${transaction.balance === undefined ? '' : escapeHtml(formatAmount(transaction.balance, currency))}</td></tr>`,
    )
    .join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Account statement</title><style>body{font:14px Arial,sans-serif;color:#17212b;margin:32px}h1{margin-bottom:4px}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border-bottom:1px solid #d8dee5;padding:10px;text-align:left}th{background:#f3f6f8}.muted{color:#5c6874}@media print{body{margin:12mm}}</style></head><body><h1>Account statement</h1><p class="muted">${escapeHtml(accountName)}${accountNumber ? ` · ${escapeHtml(accountNumber)}` : ''}</p><p>Period: ${escapeHtml(range.startDate)} to ${escapeHtml(range.endDate)}</p><table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Balance</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No transactions in this period.</td></tr>'}</tbody></table></body></html>`;
  const csv = [
    ['Date', 'Description', 'Amount', 'Balance'].map(csvCell).join(','),
    ...sortedTransactions.map((transaction) =>
      [
        transaction.date,
        transaction.description,
        formatAmount(transaction.amount, currency),
        transaction.balance === undefined ? '' : formatAmount(transaction.balance, currency),
      ]
        .map(csvCell)
        .join(','),
    ),
  ].join('\r\n');
  const fileStart = range.startDate.replace(/[^0-9-]/g, '');
  const fileEnd = range.endDate.replace(/[^0-9-]/g, '');

  return {
    fileName: `statement-${fileStart}-to-${fileEnd}`,
    html,
    csv,
    range,
    transactionCount: sortedTransactions.length,
    generatedAt: new Date().toISOString(),
  };
};

export const StatementGenerator: React.FC<StatementGeneratorProps> = ({
  startDate,
  endDate,
  transactions = [],
  accountName = 'Account holder',
  accountNumber = '',
  currency = 'USD',
  onGenerated,
}) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setGenerated(false);
    setError('');
  }, [startDate, endDate, transactions]);

  const generateStatement = async () => {
    setError('');
    setGenerated(false);
    if (!validRange) {
      setError('Choose a valid date range that ends today or earlier.');
      return;
    }

    setGenerating(true);
    try {
      const statement = createStatement(
        { startDate, endDate },
        transactions,
        accountName,
        accountNumber,
        currency,
      );
      await onGenerated?.(statement);
      setGenerated(true);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'The statement could not be generated. Please try again.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const today = new Date();
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;
  const validRange =
    Boolean(startDate && endDate) &&
    !Number.isNaN(Date.parse(startDate)) &&
    !Number.isNaN(Date.parse(endDate)) &&
    startDate <= endDate &&
    endDate <= todayValue;

  return (
    <section aria-labelledby="statement-generator-title">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-lg text-primary-700" aria-hidden="true">
          ⇩
        </span>
        <div>
          <h2 id="statement-generator-title" className="text-lg font-semibold text-slate-900">
            Generate statement
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            Create an account statement for the selected date range.
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-white/80 bg-white/80 px-3 py-2 text-sm text-slate-600">
        <span className="font-medium text-slate-800">Period: </span>
        {startDate || 'Choose a start date'} to {endDate || 'choose an end date'}
      </div>
      <button
        className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-bold text-white opacity-100 shadow-md transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-wait disabled:bg-slate-400 sm:w-auto"
        style={{
          display: 'flex',
          visibility: 'visible',
          opacity: 1,
          backgroundColor: '#2563eb',
          color: '#ffffff',
        }}
        type="button"
        onClick={generateStatement}
        disabled={generating}
      >
        {generating ? 'Generating statement…' : 'Generate statement'}
      </button>
      {generated && (
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700" role="status">
          <span aria-hidden="true">✓</span>
          Statement ready · {transactions.length} transaction
          {transactions.length === 1 ? '' : 's'}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};
