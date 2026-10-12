/**
 * ============================================================================
 * COMPONENT: StatementDownloadButton.tsx
 * DESCRIPTION: Downloads an Excel-compatible CSV statement.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R06 - Sundaravadhanisekar
 * EMAIL: sundaravadhanisekar@gmail.com
 * ROLE: Scheduling & Statements feature owner
 * PRD REQUIREMENTS: BNK-FR-04 (Scheduled Transfers), BNK-FR-05 (Statements)
 * SPRINT DELIVERABLES: Sprint 1 (S1-20, S1-21, S1-22, S1-23) & Sprint 2 (S2-21, S2-22)
 * PRIMARY RESPONSIBILITIES: Scheduled transfers, date picker/recurrence, statement generation/view/download
 * ============================================================================
 */

import React, { useState } from 'react';
import type { GeneratedStatement } from './StatementGenerator';

interface StatementDownloadButtonProps {
  statement?: GeneratedStatement | null;
  disabled?: boolean;
}

export const StatementDownloadButton: React.FC<StatementDownloadButtonProps> = ({
  statement,
  disabled = false,
}) => {
  const [error, setError] = useState('');

  const downloadCsv = () => {
    if (!statement) return;
    setError('');
    try {
      const blob = new Blob([`\uFEFF${statement.csv}`], {
        type: 'text/csv;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${statement.fileName}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'The statement download failed. Please try again.',
      );
    }
  };

  return (
    <div>
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-sm transition hover:border-primary-300 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 sm:w-auto"
        type="button"
        onClick={downloadCsv}
        disabled={disabled || !statement}
      >
        <span aria-hidden="true">↓</span>
        Download CSV
      </button>
      {error && (
        <p className="mt-2 text-sm font-medium text-rose-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
