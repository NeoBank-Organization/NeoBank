/**
 * ============================================================================
 * COMPONENT: TransactionResult.tsx
 * DESCRIPTION: Displays SUCCESS, FAILED, or HELD transaction outcomes.
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S1-16, S1-17, S1-18, S1-19, S2-18, S2-19, S2-20
 * ============================================================================
 */

import { TransactionReceipt, type TransactionReceiptData } from "./TransactionReceipt";

export type TransactionStatus = "SUCCESS" | "FAILED" | "HELD";
export type TransactionResultData = TransactionReceiptData;

interface TransactionResultProps {
  status: TransactionStatus;
  transaction: TransactionResultData;
  onNewTransfer: () => void;
  onRetry?: () => void;
}

const statusContent: Record<
  TransactionStatus,
  { title: string; description: string; icon: string; style: string }
> = {
  SUCCESS: {
    title: "Transfer successful",
    description: "The demo transfer completed successfully.",
    icon: "✓",
    style: "bg-emerald-50 text-emerald-700",
  },
  FAILED: {
    title: "Transfer failed",
    description: "The demo transfer could not be completed.",
    icon: "!",
    style: "bg-red-50 text-red-700",
  },
  HELD: {
    title: "Transfer on hold",
    description: "The simulated security check has held this transfer.",
    icon: "⏸",
    style: "bg-amber-50 text-amber-800",
  },
};

export const TransactionResult = ({
  status,
  transaction,
  onNewTransfer,
  onRetry,
}: TransactionResultProps) => {
  const content = statusContent[status];

  return (
    <div className="mx-auto w-full max-w-lg space-y-5">
      <section className={`rounded-2xl p-6 text-center ${content.style}`}>
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white text-3xl font-bold">
          {content.icon}
        </div>
        <h2 className="text-xl font-bold">{content.title}</h2>
        <p className="mt-2 text-sm">{content.description}</p>
      </section>

      <TransactionReceipt transaction={transaction} />

      <div className="flex flex-col gap-3 sm:flex-row">
        {status === "FAILED" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="h-11 flex-1 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Try again
          </button>
        )}
        <button
          type="button"
          onClick={onNewTransfer}
          className="h-11 flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
        >
          New transfer
        </button>
      </div>

      <p className="text-center text-xs text-slate-400">
        No real funds were transferred.
      </p>
    </div>
  );
};

export default TransactionResult;