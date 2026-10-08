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

import React, { useState } from "react";
import ApproveRejectActions from "./ApproveRejectActions";

interface Props {
  item: any;
  type: "account" | "loan";
}

const LoanApprovalDetail: React.FC<Props> = ({ item, type }) => {
  return (
    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
      <h3 className="text-sm font-semibold text-slate-900">Application details</h3>
      <p className="mt-2 text-sm text-slate-700">
        {type === "account" ? `${item.name} — ${item.type} account` : `${item.applicant} — ₹${item.amount.toLocaleString("en-IN")} loan`}
      </p>
      <ApproveRejectActions item={item} />
    </div>
  );
};

export default LoanApprovalDetail;
