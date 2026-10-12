/**
 * ============================================================================
 * COMPONENT: StatementDateRangePicker.tsx
 * DESCRIPTION: Date selector component for past 3 months, 6 months, financial year, or custom range.
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
import type { StatementRange } from './StatementGenerator';

interface StatementDateRangePickerProps {
  value?: StatementRange;
  onChange?: (range: StatementRange) => void;
  onSubmit?: () => void;
  maxDate?: string;
}

const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const subtractMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() - months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
};

export const StatementDateRangePicker: React.FC<StatementDateRangePickerProps> = ({
  value,
  onChange,
  onSubmit,
  maxDate = toDateInputValue(new Date()),
}) => {
  const [range, setRange] = useState<StatementRange>(
    value ?? { startDate: '', endDate: maxDate },
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (value) setRange(value);
  }, [value]);

  const updateRange = (nextRange: StatementRange) => {
    setRange(nextRange);
    if (!nextRange.startDate || !nextRange.endDate) {
      setError('');
      onChange?.(nextRange);
      return;
    }
    if (nextRange.startDate > nextRange.endDate) {
      setError('Start date must be on or before the end date.');
      onChange?.(nextRange);
      return;
    }
    if (nextRange.endDate > maxDate) {
      setError('End date cannot be in the future.');
      onChange?.(nextRange);
      return;
    }
    setError('');
    onChange?.(nextRange);
  };

  const setPreset = (months: number | 'financial-year') => {
    const endDate = maxDate;
    const end = new Date(`${endDate}T12:00:00`);
    let start: Date;
    if (months === 'financial-year') {
      const financialYearStart = end.getMonth() >= 3 ? end.getFullYear() : end.getFullYear() - 1;
      start = new Date(financialYearStart, 3, 1);
    } else {
      start = subtractMonths(end, months);
    }
    updateRange({ startDate: toDateInputValue(start), endDate });
  };

  const submitRange = () => {
    if (!range.startDate || !range.endDate) {
      setError('Choose both a start date and an end date.');
      return;
    }
    if (range.startDate > range.endDate) {
      setError('Start date must be on or before the end date.');
      return;
    }
    if (range.endDate > maxDate) {
      setError('End date cannot be in the future.');
      return;
    }
    setError('');
    onSubmit?.();
  };

  return (
    <fieldset className="min-w-0">
      <legend className="text-base font-semibold text-slate-900">Statement date range</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
          type="button"
          onClick={() => setPreset(3)}
        >
          Past 3 months
        </button>
        <button
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
          type="button"
          onClick={() => setPreset(6)}
        >
          Past 6 months
        </button>
        <button
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
          type="button"
          onClick={() => setPreset('financial-year')}
        >
          Financial year
        </button>
      </div>
      <div className="mt-4 grid w-full grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <div className="min-w-0 space-y-1.5">
          <label className="block text-sm font-medium text-slate-700" htmlFor="statement-start-date">
            From
          </label>
          <input
            className="block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            id="statement-start-date"
            type="date"
            value={range.startDate}
            max={range.endDate || maxDate}
            onChange={(event) =>
              updateRange({ ...range, startDate: event.target.value })
            }
          />
        </div>
        <div className="min-w-0 space-y-1.5">
          <label className="block text-sm font-medium text-slate-700" htmlFor="statement-end-date">
            To
          </label>
          <input
            className="block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            id="statement-end-date"
            type="date"
            value={range.endDate}
            min={range.startDate || undefined}
            max={maxDate}
            onChange={(event) =>
              updateRange({ ...range, endDate: event.target.value })
            }
          />
        </div>
        <button
          className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-span-2 sm:w-auto lg:col-span-1"
          type="button"
          onClick={submitRange}
        >
          Submit date range
        </button>
      </div>
      {error && (
        <p
          className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
};
