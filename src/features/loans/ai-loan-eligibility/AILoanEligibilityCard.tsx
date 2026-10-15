/**
 * ============================================================================
 * COMPONENT: AILoanEligibilityCard.tsx
 * DESCRIPTION: BNK-AI-03: AI advisory pre-assessment result widget calculating pre-approved amount.
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
import { CheckCircle2, AlertCircle } from "lucide-react";
import { AIAdvisoryDisclaimer } from "./AIAdvisoryDisclaimer";

export interface AIResult {
  eligibilityStatus: "Eligible" | "Review Required" | "High Risk";
  maxSuggestedAmount: number;
  recommendedTenureMonths: number;
  confidenceScore: number;
  debtToIncomeRatio: number;
  reasons: string[];
}

interface AILoanEligibilityCardProps {
  result: AIResult;
  onModifyInputs?: () => void;
  onProceedToSubmit?: () => void;
}

export const AILoanEligibilityCard: React.FC<AILoanEligibilityCardProps> = ({
  result,
  onModifyInputs,
  onProceedToSubmit,
}) => {
  const formatINR = (amt: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            AI Pre-Assessment
          </span>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Eligibility Scorecard</h3>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
          {result.eligibilityStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">Indicative Max Limit</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {formatINR(result.maxSuggestedAmount)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">Model Confidence</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {result.confidenceScore}%
          </p>
        </div>
      </div>

      {/* Reasons List */}
      <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-2">
        <p className="font-semibold text-slate-700">Underwriting Positive Signals:</p>
        <ul className="space-y-1.5 text-slate-600">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <AIAdvisoryDisclaimer />

      <div className="flex justify-end gap-3 pt-2">
        {onModifyInputs && (
          <button
            onClick={onModifyInputs}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Adjust amount / tenure
          </button>
        )}
        {onProceedToSubmit && (
          <button
            onClick={onProceedToSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            Submit for Officer Review &rarr;
          </button>
        )}
      </div>
    </div>
  );
};

export default AILoanEligibilityCard;
