/**
 * ============================================================================
 * COMPONENT: RejectionReasonModal.tsx
 * DESCRIPTION: Modal collecting mandatory rejection reason and comments from officer.
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

const RejectionReasonModal: React.FC<{ item: any; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    alert(`Rejected: ${JSON.stringify(item)}\nReason: ${reason}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rejection-reason-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="rejection-reason-title" className="text-lg font-semibold text-slate-900">
          Rejection reason
        </h2>
        <textarea
          aria-label="Rejection reason"
          className="mt-4 min-h-28 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            onClick={handleReject}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal;
