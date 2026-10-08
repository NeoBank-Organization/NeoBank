/**
 * ============================================================================
 * COMPONENT: BranchAdminDashboard.tsx
 * DESCRIPTION: Branch Officer administrative dashboard managing pending account and loan approvals.
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
import AdminSummaryCards from "./AdminSummaryCards";
import PendingAccountsList from "./PendingAccountsList";
import PendingLoansList from "./PendingLoansList";
import AdminAuditTrail from "./AdminAuditTrail";

const BranchAdminDashboard: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-700">Operations</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Branch admin dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review pending customer accounts and loan applications.
          </p>
        </div>
        <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
          Demo data
        </span>
      </header>

      <AdminSummaryCards />

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <PendingAccountsList />
        </div>
        <div>
          <PendingLoansList />
        </div>
      </div>

      <AdminAuditTrail />
    </section>
  );
};

export default BranchAdminDashboard;
