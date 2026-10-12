/**
 * ============================================================================
 * COMPONENT: OTPVerificationModal.tsx
 * DESCRIPTION: Demo OTP verification modal displayed after transfer confirmation.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S1-16, S1-17, S1-18, S1-19, S2-18, S2-19, S2-20
 * ============================================================================
 */

import { useEffect, useState, type FormEvent } from "react";

interface OTPVerificationModalProps {
  open: boolean;
  recipient?: string;
  error?: string;
  attemptsRemaining?: number;
  isVerifying?: boolean;
  onVerify: (otp: string) => void;
  onCancel: () => void;
  onResend?: () => void;
}

export const OTPVerificationModal = ({
  open,
  recipient,
  error,
  attemptsRemaining,
  isVerifying = false,
  onVerify,
  onCancel,
  onResend,
}: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!open) setOtp("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp) || isVerifying) return;

    onVerify(otp);
  };

  const handleCancel = () => {
    setOtp("");
    onCancel();
  };

  const handleResend = () => {
    setOtp("");
    onResend?.();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-verification-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-700">
            <span className="text-xl" aria-hidden="true">🔒</span>
          </div>

          <div>
            <h2
              id="otp-verification-title"
              className="text-lg font-bold text-slate-900"
            >
              OTP verification
            </h2>
            <p className="text-sm text-slate-500">
              Verify this simulated transfer to continue.
            </p>
          </div>
        </div>

        {recipient && (
          <p className="mb-4 break-all text-sm text-slate-600">
            Recipient: <span className="font-semibold">{recipient}</span>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="transfer-otp"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Enter 6-digit demo OTP
          </label>

          <input
            id="transfer-otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter OTP"
            required
            disabled={isVerifying}
            aria-describedby="otp-help otp-error"
            className="h-12 w-full rounded-xl border border-slate-300 px-4 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />

          <p id="otp-help" className="mt-2 text-xs text-slate-500">
            Demo OTP: <strong>123456</strong>
          </p>

          {error && (
            <p
              id="otp-error"
              role="alert"
              className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {attemptsRemaining !== undefined && (
            <p className="mt-2 text-xs text-slate-500">
              Attempts remaining: {attemptsRemaining}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isVerifying}
              className="h-11 flex-1 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={otp.length !== 6 || isVerifying}
              className="h-11 flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>

        {onResend && (
          <button
            type="button"
            onClick={handleResend}
            disabled={isVerifying}
            className="mt-4 w-full text-sm font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-50"
          >
            Resend demo OTP
          </button>
        )}

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Simulated verification only. This does not send a real OTP or
          authenticate a real banking transaction.
        </p>
      </section>
    </div>
  );
};

export default OTPVerificationModal;