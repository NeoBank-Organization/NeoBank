/**
 * ============================================================================
 * COMPONENT: StaleRecordNotice.tsx
 * DESCRIPTION: Conflict resolution notice when a record was already actioned by another officer.
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

const StaleRecordNotice: React.FC = () => {
  return (
    <div className="alert alert-warning mt-3">
      ⚠️ Some records are stale. Please refresh the dashboard.
    </div>
  );
};

export default StaleRecordNotice;
