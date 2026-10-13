/**
 * ============================================================================
 * COMPONENT: TransferConfirmationDialog.tsx
 * DESCRIPTION: Reviews transfer details before the security verification flow.
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S1-16, S1-17, S1-18, S1-19, S2-18, S2-19, S2-20
 * ============================================================================
 */

import type { ReactNode } from "react";

interface TransferConfirmationDialogProps {
  open: boolean;
  recipient: string;
  amount: number;
  sourceAccount?: string;
  note?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export const TransferConfirmationDialog = ({
  open,
  recipient,
  amount,
  sourceAccount,
  note,
  onConfirm,
  onCancel,
  children,
}: TransferConfirmationDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-confirmation-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5">
          <h2
            id="transfer-confirmation-title"
            className="text-xl font-bold text-slate-900"
          >
            Confirm transfer
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Check the details carefully before continuing.
          </p>
        </div>

        <div className="space-y-4 rounded-xl bg-slate-50 p-4">
          <div>
            <p className="text-xs text-slate-500">Recipient</p>
            <p className="break-all font-semibold text-slate-900">{recipient}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Amount</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatINR(amount)}
            </p>
          </div>

          {sourceAccount && (
            <div>
              <p className="text-xs text-slate-500">From account</p>
              <p className="font-medium text-slate-800">{sourceAccount}</p>
            </div>
          )}

          {note && (
            <div>
              <p className="text-xs text-slate-500">Note</p>
              <p className="text-slate-800">{note}</p>
            </div>
          )}
        </div>

        {children}

        <p className="mt-4 text-xs leading-5 text-amber-700">
          Demo only: this confirmation does not move real money.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Go back
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-11 flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
          >
            Confirm transfer
          </button>
        </div>
      </section>
    </div>
  );
};

export default TransferConfirmationDialog;