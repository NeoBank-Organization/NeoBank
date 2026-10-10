/**
 * ============================================================================
 * COMPONENT: ScheduledTransfersList.tsx
 * DESCRIPTION: List of active, upcoming, and recurring scheduled transfers.
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
import { ScheduleActions } from './ScheduleActions';
import type { ScheduledTransfer } from './ScheduleTransferForm';

interface ScheduledTransfersListProps {
  transfers?: ScheduledTransfer[];
  currency?: string;
  onEdit?: (transfer: ScheduledTransfer) => void;
  onPause?: (transfer: ScheduledTransfer) => void;
  onResume?: (transfer: ScheduledTransfer) => void;
  onCancel?: (transfer: ScheduledTransfer) => void;
}

const dateFromToday = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

const DEMO_TRANSFERS: ScheduledTransfer[] = [
  {
    id: 'schedule-1',
    recipient: 'Priya Sharma',
    amount: 8500,
    scheduledDate: dateFromToday(2),
    recurrence: 'monthly',
    endDate: dateFromToday(182),
    note: 'Monthly rent',
    status: 'scheduled',
  },
  {
    id: 'schedule-2',
    recipient: 'Electricity Board',
    amount: 2140,
    scheduledDate: dateFromToday(6),
    recurrence: 'one-time',
    note: 'Bill payment',
    status: 'scheduled',
  },
  {
    id: 'schedule-3',
    recipient: 'Neha Kapoor',
    amount: 1200,
    scheduledDate: dateFromToday(9),
    recurrence: 'weekly',
    status: 'paused',
  },
];

const formatDate = (value: string): string => {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
};

const recurrenceLabel = (recurrence: ScheduledTransfer['recurrence']): string => {
  switch (recurrence) {
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    default:
      return 'One time';
  }
};

export const ScheduledTransfersList: React.FC<ScheduledTransfersListProps> = ({
  transfers = DEMO_TRANSFERS,
  currency = 'INR',
  onEdit,
  onPause,
  onResume,
  onCancel,
}) => {
  if (transfers.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="scheduled-transfers-title">
        <h2 id="scheduled-transfers-title" className="text-lg font-semibold text-slate-900">Scheduled transfers</h2>
        <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          No transfers are currently scheduled.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="scheduled-transfers-title">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="scheduled-transfers-title" className="text-lg font-semibold text-slate-900">Scheduled transfers</h2>
          <p className="mt-1 text-sm text-slate-500">Upcoming one-time and recurring payments</p>
        </div>
        <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {transfers.length} scheduled
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {transfers.map((transfer) => (
          <li className="py-4 first:pt-0 last:pb-0" key={transfer.id}>
            <article className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{transfer.recipient}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    transfer.status === 'scheduled'
                      ? 'bg-emerald-50 text-emerald-700'
                      : transfer.status === 'paused'
                        ? 'bg-amber-50 text-amber-700'
                        : transfer.status === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-rose-50 text-rose-700'
                  }`}>
                    {transfer.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {recurrenceLabel(transfer.recurrence)}
                  {transfer.recurrence !== 'one-time' && transfer.endDate
                    ? ` · until ${formatDate(transfer.endDate)}`
                    : ''}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Next transfer: {formatDate(transfer.scheduledDate)}
                </p>
                {transfer.note && (
                  <p className="mt-1 text-sm text-slate-500">{transfer.note}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                <p className="text-lg font-semibold tabular-nums text-slate-900">
                {new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency,
                }).format(transfer.amount)}
                </p>
                <ScheduleActions
                  transfer={transfer}
                  onEdit={onEdit}
                  onPause={onPause}
                  onResume={onResume}
                  onCancel={onCancel}
                />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
