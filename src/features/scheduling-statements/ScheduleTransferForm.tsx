/**
 * ============================================================================
 * COMPONENT: ScheduleTransferForm.tsx
 * DESCRIPTION: Form to set up future-dated or recurring payment schedules.
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
import type { FormEvent } from 'react';
import { RecurrencePicker } from './RecurrencePicker';
import type { RecurrenceFrequency } from './RecurrencePicker';

export type ScheduleStatus = 'scheduled' | 'paused' | 'completed' | 'cancelled';

export interface ScheduledTransferDraft {
  recipient: string;
  amount: number;
  scheduledDate: string;
  recurrence: RecurrenceFrequency;
  endDate?: string;
  note?: string;
}

export interface ScheduledTransfer extends ScheduledTransferDraft {
  id: string;
  status: ScheduleStatus;
}

interface ScheduleTransferFormProps {
  onSubmit: (transfer: ScheduledTransferDraft) => void | Promise<void>;
  initialValue?: Partial<ScheduledTransferDraft>;
  submitLabel?: string;
}

const tomorrowInputValue = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(
    tomorrow.getDate(),
  ).padStart(2, '0')}`;
};

export const ScheduleTransferForm: React.FC<ScheduleTransferFormProps> = ({
  onSubmit,
  initialValue,
  submitLabel = 'Schedule transfer',
}) => {
  const [recipient, setRecipient] = useState(initialValue?.recipient ?? '');
  const [amount, setAmount] = useState(
    initialValue?.amount === undefined ? '' : String(initialValue.amount),
  );
  const [scheduledDate, setScheduledDate] = useState(initialValue?.scheduledDate ?? '');
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>(
    initialValue?.recurrence ?? 'one-time',
  );
  const [endDate, setEndDate] = useState(initialValue?.endDate ?? '');
  const [note, setNote] = useState(initialValue?.note ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const parsedAmount = Number(amount);
    if (!recipient.trim()) {
      setError('Enter the recipient name.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    if (!scheduledDate || scheduledDate < tomorrowInputValue()) {
      setError('Choose a future date for the transfer.');
      return;
    }
    if (recurrence !== 'one-time' && endDate && endDate < scheduledDate) {
      setError('The recurrence end date must be on or after the first transfer date.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        recipient: recipient.trim(),
        amount: parsedAmount,
        scheduledDate,
        recurrence,
        ...(recurrence !== 'one-time' && endDate ? { endDate } : {}),
        ...(note.trim() ? { note: note.trim() } : {}),
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'The transfer could not be scheduled. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      onSubmit={submit}
      noValidate
    >
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-600">
          Transfers
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Schedule a transfer</h2>
        <p className="mt-1 text-sm text-slate-500">
          Set a future date or choose a recurring schedule.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="scheduled-recipient"
          >
            Recipient
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            id="scheduled-recipient"
            name="recipient"
            autoComplete="name"
            placeholder="e.g. Priya Sharma"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="scheduled-amount"
          >
            Amount
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            id="scheduled-amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="scheduled-date"
          >
            First transfer date
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            id="scheduled-date"
            name="scheduledDate"
            type="date"
            min={tomorrowInputValue()}
            value={scheduledDate}
            onChange={(event) => setScheduledDate(event.target.value)}
            required
          />
        </div>
        <RecurrencePicker value={recurrence} onChange={setRecurrence} />
        {recurrence !== 'one-time' && (
          <div className="space-y-1.5">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="scheduled-end-date"
            >
              Repeat until (optional)
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              id="scheduled-end-date"
              name="endDate"
              type="date"
              min={scheduledDate || tomorrowInputValue()}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        )}
        <div className="space-y-1.5 sm:col-span-2">
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="scheduled-note"
          >
            Note (optional)
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            id="scheduled-note"
            name="note"
            placeholder="Add a note for this transfer"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </div>
      <button
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Scheduling…' : submitLabel}
      </button>
      {error && (
        <p
          className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
};
