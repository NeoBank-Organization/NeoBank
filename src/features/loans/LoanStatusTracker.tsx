/**
 * ============================================================================
 * COMPONENT: LoanStatusTracker.tsx
 * DESCRIPTION: Displays the current loan application review status.
 * ============================================================================
 */

import React from "react";
import type { LoanApplicationStatus } from "./loanService";

interface LoanStatusTrackerProps {
  status: LoanApplicationStatus;
  rejectionReason?: string;
}

const steps: Array<{ status: LoanApplicationStatus; label: string }> = [
  { status: "SUBMITTED", label: "Submitted" },
  { status: "UNDER_REVIEW", label: "Under review" },
  { status: "APPROVED", label: "Approved" },
];

export const LoanStatusTracker: React.FC<LoanStatusTrackerProps> = ({
  status,
  rejectionReason,
}) => {
  if (status === "REJECTED") {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-5" aria-live="polite">
        <h2 className="font-semibold text-red-900">Application rejected</h2>
        <p className="mt-1 text-sm text-red-800">
          The application was reviewed and could not be approved.
        </p>
        {rejectionReason && (
          <p className="mt-3 text-sm text-red-800">
            <span className="font-medium">Reason:</span> {rejectionReason}
          </p>
        )}
      </section>
    );
  }

  const currentStep = steps.findIndex((step) => step.status === status);

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label={`Loan application status: ${status.toLowerCase().replace("_", " ")}`}
    >
      <h2 className="font-semibold text-slate-900">Application status</h2>
      <ol className="mt-5 grid grid-cols-3 gap-2">
        {steps.map((step, index) => {
          const isComplete = index <= currentStep;
          return (
            <li key={step.status} className="text-center">
              <span
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isComplete
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`mt-2 block text-xs sm:text-sm ${
                  index === currentStep
                    ? "font-semibold text-blue-800"
                    : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
