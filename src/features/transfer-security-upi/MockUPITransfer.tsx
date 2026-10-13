/**
 * ============================================================================
 * COMPONENT: MockUPITransfer.tsx
 * DESCRIPTION: Standalone demo screen for a simulated UPI transfer.
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S1-16, S1-17, S1-18, S1-19, S2-18, S2-19, S2-20
 * ============================================================================
 */

import { useState, type FormEvent } from "react";
import OTPStateHandlers, { type TransferMethod } from "./OTPStateHandlers";

export const MockUPITransfer = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sourceAccount, setSourceAccount] = useState("NeoBank Savings •••• 4821");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<TransferMethod>("UPI");
  const [started, setStarted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!recipient.trim()) {
      setFormError("Enter a recipient.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("Enter an amount greater than zero.");
      return;
    }

    setFormError("");
    setStarted(true);
  };

  if (started) {
    return (
      <main className="mx-auto w-full max-w-2xl p-4 sm:p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900">
            Transfer security demo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Follow the confirmation and verification steps to see the result.
          </p>
        </div>

        <OTPStateHandlers
          recipient={recipient}
          amount={Number(amount)}
          sourceAccount={sourceAccount}
          note={note}
          method={method}
          onCancel={() => setStarted(false)}
        />

        <button
          type="button"
          onClick={() => setStarted(false)}
          className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          ← Back to transfer form
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-700">NEOBANK · DEMO</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Make a transfer
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter sample details to test the R05 security workflow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="demo-method" className="mb-2 block text-sm font-semibold text-slate-700">
              Transfer method
            </label>
            <select
              id="demo-method"
              value={method}
              onChange={(event) => setMethod(event.target.value as TransferMethod)}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3"
            >
              <option value="UPI">UPI transfer (PIN + OTP)</option>
              <option value="BANK">Bank transfer (OTP)</option>
              <option value="OWN_ACCOUNT">Own account transfer (OTP)</option>
            </select>
          </div>

          <div>
            <label htmlFor="demo-source" className="mb-2 block text-sm font-semibold text-slate-700">
              Source account
            </label>
            <input
              id="demo-source"
              value={sourceAccount}
              onChange={(event) => setSourceAccount(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-300 px-3"
              required
            />
          </div>

          <div>
            <label htmlFor="demo-recipient" className="mb-2 block text-sm font-semibold text-slate-700">
              Recipient / UPI ID
            </label>
            <input
              id="demo-recipient"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="example@upi or recipient name"
              className="h-11 w-full rounded-xl border border-slate-300 px-3"
              required
            />
          </div>

          <div>
            <label htmlFor="demo-amount" className="mb-2 block text-sm font-semibold text-slate-700">
              Amount (INR)
            </label>
            <input
              id="demo-amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              className="h-11 w-full rounded-xl border border-slate-300 px-3"
              required
            />
          </div>

          <div>
            <label htmlFor="demo-note" className="mb-2 block text-sm font-semibold text-slate-700">
              Note (optional)
            </label>
            <textarea
              id="demo-note"
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What is this transfer for?"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          {formError && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
          >
            Review transfer
          </button>
        </form>

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Demo environment only. Never enter a real banking PIN or OTP.
        </p>
      </section>
    </main>
  );
};

export default MockUPITransfer;