/**
 * ============================================================================
 * COMPONENT: LoanApplicationDetails.tsx
 * DESCRIPTION: Loan Officer Underwriting & Review Modal / Details Drawer
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * PRD REQUIREMENTS: BNK-FR-08 (Approval Workflow), BNK-AI-03 (Advisory Handoff)
 * ============================================================================
 */

import React, { useState } from "react";
import { PendingApplication } from "./ai-loan-eligibility/LoanOfficerHandoff";
import { AIAdvisoryDisclaimer } from "./ai-loan-eligibility/AIAdvisoryDisclaimer";

interface LoanApplicationDetailsProps {
  application: PendingApplication;
  onClose: () => void;
  onDecision: (id: string, decision: "APPROVED" | "REJECTED" | "ESCALATED", notes: string) => void;
}

export const LoanApplicationDetails: React.FC<LoanApplicationDetailsProps> = ({
  application,
  onClose,
  onDecision,
}) => {
  const [officerNotes, setOfficerNotes] = useState("");

  const formatINR = (amt: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
              {application.applicationNumber}
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Review: {application.applicantName}
            </h3>
            <p className="text-xs text-slate-500">
              {application.product} &bull; Requested {formatINR(application.amount)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Applicant Metrics */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-400 block">Monthly Income</span>
            <span className="text-sm font-bold text-slate-900">
              {formatINR(application.monthlyIncome || 85000)}
            </span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-400 block">AI Credit Pre-Score</span>
            <span className="text-sm font-bold text-blue-700">
              {application.score || 785} / 900
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 text-xs">
          <span className="text-slate-400 font-medium">Stated Purpose:</span>
          <p className="mt-0.5 font-semibold text-slate-700">
            {application.purpose || "General financial requirement"}
          </p>
        </div>

        {/* Mandatory Regulatory Disclaimer */}
        <AIAdvisoryDisclaimer />

        {/* Officer Remarks Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Officer Remarks / Reason
          </label>
          <textarea
            rows={2}
            value={officerNotes}
            onChange={(e) => setOfficerNotes(e.target.value)}
            placeholder="e.g. Salary credits verified. Recommended for immediate sanction."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onDecision(application.id, "REJECTED", officerNotes)}
            className="flex-1 rounded-xl bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
          >
            Reject
          </button>
          <button
            onClick={() => onDecision(application.id, "ESCALATED", officerNotes)}
            className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Escalate to Admin
          </button>
          <button
            onClick={() => onDecision(application.id, "APPROVED", officerNotes)}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition"
          >
            Approve Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationDetails;