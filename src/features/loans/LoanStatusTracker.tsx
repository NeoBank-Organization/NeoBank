/**
 * ============================================================================
 * COMPONENT: LoanStatusTracker.tsx
 * DESCRIPTION: S1-26 & S2-23 Post-submission lifecycle status tracker
 * ============================================================================
 */

import React from "react";

export interface LoanStatusTrackerProps {
  applicationNumber: string;
  currentStep?: 1 | 2 | 3 | 4;
}

export const LoanStatusTracker: React.FC<LoanStatusTrackerProps> = ({
  applicationNumber,
  currentStep = 3,
}) => {
  const steps = [
    { label: "Submitted", desc: "Application received" },
    { label: "AI Pre-Check", desc: "Advisory score verified" },
    { label: "Officer Review", desc: "Underwriting in progress" },
    { label: "Final Decision", desc: "Sanction / Rejection" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <p className="text-xs text-slate-400 font-mono">{applicationNumber}</p>
          <h3 className="text-base font-bold text-slate-900">Application Lifecycle</h3>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          In Review
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {steps.map((st, i) => {
          const isDone = i + 1 < currentStep;
          const isCurrent = i + 1 === currentStep;
          return (
            <div
              key={st.label}
              className={`rounded-xl p-3 border text-xs ${
                isDone
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : isCurrent
                  ? "border-blue-300 bg-blue-50 text-blue-900 font-semibold"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <p className="font-bold">{isDone ? "✓ " : isCurrent ? "● " : "○ "}{st.label}</p>
              <p className="text-[11px] opacity-80 mt-0.5">{st.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoanStatusTracker;