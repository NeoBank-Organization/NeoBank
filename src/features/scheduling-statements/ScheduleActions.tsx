/**
 * ============================================================================
 * COMPONENT: ScheduleActions.tsx
 * DESCRIPTION: Action button handlers for editing, pausing, or cancelling a scheduled payment.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R06 - Sundaravadhanisekar
 * EMAIL: sundaravadhanisekar@gmail.com
 * ROLE: Scheduling & Statements feature owner
 * PRD REQUIREMENTS: BNK-FR-04 (Scheduled Transfers), BNK-FR-05 (Statements)
 * SPRINT DELIVERABLES: Sprint 1 (S1-20, S1-21, S1-22, S1-23) & Sprint 2 (S2-21, S2-22)
 * PRIMARY RESPONSIBILITIES: Scheduled transfers, date picker/recurrence, statement generation/view/download
 * ============================================================================
 */

import React from 'react';
import type { ScheduledTransfer } from './ScheduleTransferForm';

interface ScheduleActionsProps {
  transfer: ScheduledTransfer;
  onEdit?: (transfer: ScheduledTransfer) => void;
  onPause?: (transfer: ScheduledTransfer) => void;
  onResume?: (transfer: ScheduledTransfer) => void;
  onCancel?: (transfer: ScheduledTransfer) => void;
}

export const ScheduleActions: React.FC<ScheduleActionsProps> = ({
  transfer,
  onEdit,
  onPause,
  onResume,
  onCancel,
}) => {
  const cancellable = transfer.status === 'scheduled' || transfer.status === 'paused';
  if (!cancellable) return <span>No actions available</span>;

  const hasAction =
    Boolean(onEdit) ||
    (transfer.status === 'scheduled' && Boolean(onPause)) ||
    (transfer.status === 'paused' && Boolean(onResume)) ||
    Boolean(onCancel);
  if (!hasAction) return <span className="text-xs text-slate-400">Actions unavailable</span>;

  const cancel = () => {
    if (window.confirm(`Cancel the scheduled transfer to ${transfer.recipient}?`)) {
      onCancel?.(transfer);
    }
  };

  return (
    <div className="flex flex-wrap gap-2" aria-label={`Actions for transfer to ${transfer.recipient}`}>
      {onEdit && (
        <button
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
          type="button"
          onClick={() => onEdit(transfer)}
        >
          Edit
        </button>
      )}
      {transfer.status === 'scheduled' && onPause && (
        <button
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
          type="button"
          onClick={() => onPause(transfer)}
        >
          Pause
        </button>
      )}
      {transfer.status === 'paused' && onResume && (
        <button
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          type="button"
          onClick={() => onResume(transfer)}
        >
          Resume
        </button>
      )}
      {onCancel && (
        <button
          className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
          type="button"
          onClick={cancel}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
