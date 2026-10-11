/**
 * ============================================================================
 * COMPONENT: StatementPDFViewer.tsx
 * DESCRIPTION: Previews a generated statement and opens its print-ready view in a new tab.
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

interface StatementPDFViewerProps {
  statement?: GeneratedStatement | null;
}

export const StatementPDFViewer: React.FC<StatementPDFViewerProps> = ({ statement }) => {
  const [error, setError] = useState('');

  const openPrintView = () => {
    if (!statement) return;
    setError('');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError('The statement tab was blocked. Allow pop-ups and try again.');
      return;
    }
    try {
      printWindow.opener = null;
      printWindow.document.open();
      printWindow.document.write(statement.html);
      printWindow.document.close();
      printWindow.document.title = `${statement.fileName} - Statement`;
    } catch (openError) {
      printWindow.close();
      setError(
        openError instanceof Error
          ? openError.message
          : 'The statement could not be opened. Please try again.',
      );
    }
  };

  if (!statement) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center sm:min-h-80">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-2xl text-primary-600" aria-hidden="true">
          ▤
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-900">Statement preview</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Your statement preview will appear here after you choose a date range and generate it.
        </p>
      </div>
    );
  }

  return (
    <section className="min-w-0" aria-labelledby="statement-preview-title">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 id="statement-preview-title" className="text-lg font-semibold text-slate-900">
            Statement preview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {statement.range.startDate} to {statement.range.endDate} ·{' '}
            {statement.transactionCount} transaction
            {statement.transactionCount === 1 ? '' : 's'}
          </p>
        </div>
        <button
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          type="button"
          onClick={openPrintView}
        >
          <span aria-hidden="true">↗</span>
          Open in new tab
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <iframe
          className="h-[28rem] w-full bg-white sm:h-[34rem]"
          title="Account statement preview"
          srcDoc={statement.html}
          sandbox=""
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Use your browser’s print dialog to print or save the statement as a PDF.
      </p>
      {error && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};
