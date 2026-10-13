/**
 * ============================================================================
 * COMPONENT: LoanOfficerHandoff.tsx
 * DESCRIPTION: BNK-AI-03 / BNK-FR-08: Loan Officer & Branch Admin Approval Workspace
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * EMAIL: aishwaryahonawad7@gmail.com
 * ROLE: Loans feature owner
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility), BNK-FR-08 (Admin Approval)
 * SPRINT DELIVERABLES: Sprint 1 (S1-24, S1-25, S1-26, S1-27) & Sprint 2 (S2-15, S2-16, S2-17, S2-23)
 * ============================================================================
 */

import React from "react";
import { Plus, ShieldCheck } from "lucide-react";

export interface LoanOfficerHandoffProps {
  onCreateNew?: () => void;
}

export const LoanOfficerHandoff: React.FC<LoanOfficerHandoffProps> = ({ onCreateNew }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
            NEOBANK
          </p>
          <h1 className="mt-1 text-2xl font-normal text-slate-900 md:text-3xl">
            Approval workspace
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Review applications assigned to your authorized role.
          </p>
        </div>

        {/* Top Right Action Button */}
        <div>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create new
          </button>
        </div>
      </div>

      {/* Main Container Card: Everything is ready */}
      <div className="flex min-h-[440px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
        {/* Shield Icon Badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ShieldCheck className="h-7 w-7" strokeWidth={1.75} />
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-xl font-normal text-slate-900">
          Everything is ready
        </h2>

        {/* Subtext */}
        <p className="mt-2 max-w-md text-xs text-slate-500">
          Use the controls above to create, filter and manage your banking records.
        </p>

        {/* 4 Status Pills from Figma */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Success
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-800">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Needs attention
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-800">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Information
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoanOfficerHandoff;