/**
 * ============================================================================
 * COMPONENT: ApproveRejectActions.tsx
 * DESCRIPTION: Officer approval and rejection action buttons with reason modal trigger.
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
import RejectionReasonModal from "./RejectionReasonModal";

export type ReviewStatus = "Approved" | "Rejected";

interface ApproveRejectActionsProps {
  status?: ReviewStatus;
  rejectionReason?: string;
  onDecision: (status: ReviewStatus, reason: string) => void;
}

const ApproveRejectActions: React.FC<ApproveRejectActionsProps> = ({
  status,
  rejectionReason,
  onDecision,
}) => {
  const [showReject, setShowReject] = useState(false);

  const handleApprove = () => {
    onDecision("Approved", "");
  };

  if (status) {
    return (
      <div
        className={`mt-4 rounded-lg p-3 text-sm ${
          status === "Approved"
            ? "bg-emerald-50 text-emerald-800"
            : "bg-red-50 text-red-800"
        }`}
        role="status"
      >
        <p className="font-semibold">Application {status.toLowerCase()}.</p>
        {status === "Rejected" && rejectionReason && (
          <p className="mt-1">Reason: {rejectionReason}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
        onClick={handleApprove}
      >
        Approve
      </button>
      <button
        type="button"
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
        onClick={() => setShowReject(true)}
      >
        Reject
      </button>
      {showReject && (
        <RejectionReasonModal
          onClose={() => setShowReject(false)}
          onConfirm={(reason) => {
            onDecision("Rejected", reason);
            setShowReject(false);
          }}
        />
      )}
    </div>
  );
};

export default ApproveRejectActions;
