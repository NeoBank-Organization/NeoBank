/**
 * ============================================================================
 * COMPONENT: AIAdvisoryDisclaimer.tsx
 * DESCRIPTION: BNK-AI-03: Mandatory legal disclaimer specifying AI output is purely advisory and non-binding.
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
import { ShieldAlert } from "lucide-react";

export const AIAdvisoryDisclaimer: React.FC = () => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <div>
        <p className="font-semibold">Regulatory Pre-Assessment Advisory</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
          This AI score is indicative only and does not constitute formal credit approval.
          The Bank Loan Officer retains full final authority for underwriting and sanction decisions.
        </p>
      </div>
    </div>
  );
};

export default AIAdvisoryDisclaimer;