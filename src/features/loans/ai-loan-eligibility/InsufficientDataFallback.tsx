/**
 * ============================================================================
 * COMPONENT: InsufficientDataFallback.tsx
 * DESCRIPTION: BNK-AI-03: Fallback state when applicant credit history is insufficient for AI calculation.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * EMAIL: aishwaryahonawad7@gmail.com
 * ROLE: Loans feature owner
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility)
 * SPRINT DELIVERABLES: Sprint 1 (S1-24, S1-25, S1-26, S1-27) & Sprint 2 (S2-15, S2-16, S2-17, S2-23)
 * PRIMARY RESPONSIBILITIES: Loan application, EMI calculator, slider interaction, loan status and AI loan integration
 * ============================================================================
 */



import React from "react";
import { AlertTriangle } from "lucide-react";

interface InsufficientDataFallbackProps {
  onRetry?: () => void;
  onProceedManual?: () => void;
}

export const InsufficientDataFallback: React.FC<InsufficientDataFallbackProps> = ({
  onRetry,
  onProceedManual,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        Insufficient Data for Automated Assessment
      </h3>
      <p className="mx-auto max-w-md text-xs text-slate-500 leading-relaxed">
        The model could not detect sufficient credit transaction history to generate an automated
        pre-assessment. Your application will proceed directly to manual underwriting by your Loan Officer.
      </p>

      <div className="flex justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Retry Check
          </button>
        )}
        {onProceedManual && (
          <button
            onClick={onProceedManual}
            className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Proceed to Officer Review
          </button>
        )}
      </div>
    </div>
  );
};

export default InsufficientDataFallback;
