/**
 * ============================================================================
 * COMPONENT: AdminAuditTrail.tsx
 * DESCRIPTION: Immutable administrative decision audit log recording officer timestamped actions.
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

const AdminAuditTrail: React.FC = () => {
  const logs = [
    { id: 1, action: "Approved Account - John Doe", time: "10:30 AM" },
    { id: 2, action: "Rejected Loan - Bob", time: "11:00 AM" },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Recent activity</h2>
      <p className="mt-1 text-sm text-slate-500">Example administrative activity.</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {logs.map(log => (
          <li key={log.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-700">{log.action}</span>
            <time className="text-xs text-slate-500">{log.time}</time>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminAuditTrail;
