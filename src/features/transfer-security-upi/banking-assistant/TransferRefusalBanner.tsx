/**
 * ============================================================================
 * COMPONENT: TransferRefusalBanner.tsx
 * DESCRIPTION: BNK-AI-05: Strict policy banner ensuring AI NEVER initiates or completes money transfers.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03 (Transfer Security/OTP/UPI), BNK-AI-05 (Banking Assistant)
 * SPRINT DELIVERABLES: Sprint 1 (S1-16, S1-17, S1-18, S1-19) & Sprint 2 (S2-18, S2-19, S2-20)
 * PRIMARY RESPONSIBILITIES: Mock UPI, confirmation dialog, OTP modal/states, transaction result, banking assistant AI
 * ============================================================================
 */


import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface TransferRefusalBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const TransferRefusalBanner: React.FC<
  TransferRefusalBannerProps
> = ({ message, onDismiss }) => {
  return (
    <div
      role="alert"
      className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle
          size={18}
          className="mt-0.5 shrink-0 text-amber-700"
        />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-amber-900">
            Security restriction
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-800">
            {message}
          </p>

          <div className="mt-2 flex items-start gap-1.5 text-[10px] leading-4 text-amber-800">
            <ShieldCheck size={12} className="mt-0.5 shrink-0" />
            Your existing transfer verification process remains in control.
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss security message"
            className="rounded p-1 text-amber-800 hover:bg-amber-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

