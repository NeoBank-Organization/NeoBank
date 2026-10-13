/**
 * ============================================================================
 * COMPONENT: UPIPinModal.tsx
 * DESCRIPTION: Demo UPI PIN verification modal.
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S1-16, S1-17, S1-18, S1-19, S2-18, S2-19, S2-20
 * ============================================================================
 */

import { useState, type FormEvent } from "react";

interface UPIPinModalProps {
  open: boolean;
  error?: string;
  isVerifying?: boolean;
  onVerify: (pin: string) => void;
  onCancel: () => void;
}

export const UPIPinModal = ({
  open,
  error,
  isVerifying = false,
  onVerify,
  onCancel,
}: UPIPinModalProps) => {
  const [pin, setPin] = useState("");

  if (!open) return null;

  const submitPin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (/^\d{4}$/.test(pin) && !isVerifying) onVerify(pin);
  };

  const cancel = () => {
    setPin("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="upi-pin-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-2xl">
            🔐
          </div>
          <h2 id="upi-pin-title" className="text-xl font-bold text-slate-900">
            UPI PIN verification
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the four-digit demo PIN to continue.
          </p>
        </div>

        <form onSubmit={submitPin}>
          <label htmlFor="upi-pin" className="mb-2 block text-sm font-semibold">
            Demo UPI PIN
          </label>
          <input
            id="upi-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            pattern="[0-9]{4}"
            value={pin}
            onChange={(event) =>
              setPin(event.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="••••"
            required
            disabled={isVerifying}
            className="h-12 w-full rounded-xl border border-slate-300 text-center text-2xl tracking-[0.6em] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-2 text-xs text-slate-500">Demo PIN: 1234</p>

          {error && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={cancel}
              disabled={isVerifying}
              className="h-11 flex-1 rounded-xl border font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pin.length !== 4 || isVerifying}
              className="h-11 flex-1 rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50"
            >
              {isVerifying ? "Checking..." : "Verify PIN"}
            </button>
          </div>
        </form>

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          This is a simulated PIN check, not real UPI authentication.
        </p>
      </section>
    </div>
  );
};

export default UPIPinModal;