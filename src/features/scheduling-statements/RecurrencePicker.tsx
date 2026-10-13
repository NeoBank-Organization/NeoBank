/**
 * ============================================================================
 * COMPONENT: RecurrencePicker.tsx
 * DESCRIPTION: Recurrence frequency selector (One-Time, Weekly, Monthly, Quarterly).
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

export type RecurrenceFrequency = 'one-time' | 'weekly' | 'monthly' | 'quarterly';

interface RecurrencePickerProps {
  value?: RecurrenceFrequency;
  onChange?: (value: RecurrenceFrequency) => void;
  id?: string;
  disabled?: boolean;
}

const options: Array<{ value: RecurrenceFrequency; label: string }> = [
  { value: 'one-time', label: 'One time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

export const RecurrencePicker: React.FC<RecurrencePickerProps> = ({
  value = 'one-time',
  onChange,
  id = 'transfer-recurrence',
  disabled = false,
}) => (
  <div className="min-w-0">
    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={id}>
      Frequency
    </label>
    <select
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        const selected = options.find((option) => option.value === event.target.value);
        if (selected) onChange?.(selected.value);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
