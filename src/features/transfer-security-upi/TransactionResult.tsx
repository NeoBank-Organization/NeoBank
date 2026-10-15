/**
 * ============================================================================
 * COMPONENT: TransactionResult.tsx
 * DESCRIPTION: Displays SUCCESS, FAILED, or HELD transfer outcomes.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03
 * ============================================================================
 */

import {
  TransactionReceipt,
  type TransactionReceiptData,
} from "./TransactionReceipt";

export type TransactionStatus = "SUCCESS" | "FAILED" | "HELD";

export type TransactionResultData = TransactionReceiptData;

interface TransactionResultProps {
  status: TransactionStatus;
  transaction: TransactionResultData;
  onNewTransfer: () => void;
}

const statusContent: Record<
  TransactionStatus,
  {
    title: string;
    description: string;
    icon: string;
    style: string;
  }
> = {
  SUCCESS: {
    title: "Transfer successful",
    description:
      "The simulated transfer completed successfully. No real funds were moved.",
    icon: "✓",
    style: "bg-emerald-50 text-emerald-800",
  },
  FAILED: {
    title: "Transfer failed",
    description:
      "The simulated transfer could not be completed. No real funds were moved.",
    icon: "!",
    style: "bg-red-50 text-red-800",
  },
  HELD: {
    title: "Transfer on hold",
    description:
      "The simulated security check has held this transfer. No real funds were moved.",
    icon: "Ⅱ",
    style: "bg-amber-50 text-amber-900",
  },
};

export const TransactionResult = ({
  status,
  transaction,
  onNewTransfer,
}: TransactionResultProps) => {
  const content = statusContent[status];

  return (
    <main
      className="mx-auto w-full max-w-lg space-y-5"
      aria-labelledby="transaction-result-title"
    >
      <section
        role="status"
        className={`rounded-2xl p-6 text-center ${content.style}`}
      >
        <div
          className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white text-3xl font-bold"
          aria-hidden="true"
        >
          {content.icon}
        </div>

        <h2 id="transaction-result-title" className="text-xl font-bold">
          {content.title}
        </h2>

        <p className="mt-2 text-sm">{content.description}</p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wide">
          Demo transaction · {status}
        </p>
      </section>

      <TransactionReceipt transaction={transaction} />

      <button
        type="button"
        onClick={onNewTransfer}
        className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
      >
        Start another transfer
      </button>

      <p className="text-center text-xs text-slate-500">
        This is a frontend simulation. No real payment was initiated, and no
        real funds were transferred.
      </p>
    </main>
  );
};

export default TransactionResult;