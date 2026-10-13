/**
 * ============================================================================
 * COMPONENT: LoanApprovalDetail.tsx
 * DESCRIPTION: Loan review screen showing applicant details, AI advisory note, and approve/reject.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R08 - Alcious
 * EMAIL: alciousalcious852@gmail.com
 * ROLE: Branch Admin feature owner
 * PRD REQUIREMENTS: BNK-FR-08 (Branch Admin Portal)
 * SPRINT DELIVERABLES: Sprint 1 (S1-28, S1-29, S1-30) & Sprint 2 (S2-24, S2-25)
 * PRIMARY RESPONSIBILITIES: Admin dashboard, pending accounts/loans, approve/reject workflows
 * ============================================================================
 */

import React from "react";
import ApproveRejectActions from "./ApproveRejectActions";
import type { ReviewStatus } from "./ApproveRejectActions";

interface Props {
  item: {
    applicant: string;
    loanType?: string;
    amount: number;
    purpose: string;
    tenure: string;
    submittedAt: string;
    monthlyIncome?: number;
    status?: ReviewStatus;
    rejectionReason?: string;
  };
  onDecision: (status: ReviewStatus, reason: string) => void;
}

export const LoanApprovalDetail: React.FC<Props> = ({ item, onDecision }) => {
  return (
    <div className="mt-6 rounded-lg border border-violet-100 bg-violet-50/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Loan application details
          </h3>
          <p className="mt-2 text-sm text-slate-700">
            {item.applicant} — ₹{item.amount.toLocaleString("en-IN")} loan
          </p>
          {item.loanType && (
            <p className="mt-1 text-sm text-slate-600">{item.loanType} loan</p>
          )}
        </div>
        <span className="w-fit rounded-full bg-white px-2.5 py-1 text-xs font-medium text-violet-700">
          {item.tenure}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <div className="rounded-md bg-white/70 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Purpose</dt>
          <dd className="mt-1 font-medium text-slate-800">{item.purpose}</dd>
        </div>
        <div className="rounded-md bg-white/70 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Submitted</dt>
          <dd className="mt-1 font-medium text-slate-800">{item.submittedAt}</dd>
        </div>
        <div className="rounded-md bg-white/70 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Eligibility</dt>
          <dd className="mt-1 font-medium text-slate-800">
            {item.monthlyIncome
              ? `Monthly income: ₹${item.monthlyIncome.toLocaleString("en-IN")}`
              : "Pending verification"}
          </dd>
        </div>
      </dl>

      <ApproveRejectActions
        status={item.status}
        rejectionReason={item.rejectionReason}
        onDecision={onDecision}
      />
    </div>
  );
};

export default LoanApprovalDetail;
