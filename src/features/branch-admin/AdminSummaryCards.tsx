/**
 * ============================================================================
 * COMPONENT: AdminSummaryCards.tsx
 * DESCRIPTION: Key metrics cards displaying pending queue size, approvals today, and SLA metrics.
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

const AdminSummaryCards: React.FC = () => {
  const stats = [
    { title: "Pending Accounts", count: 12, accent: "text-blue-700", icon: "♙" },
    { title: "Pending Loans", count: 8, accent: "text-violet-700", icon: "♜" },
    { title: "Approved Today", count: 5, accent: "text-emerald-700", icon: "✓" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <article key={stat.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-lg ${stat.accent}`}>
              {stat.icon}
            </span>
          </div>
          <p className={`mt-4 text-3xl font-bold ${stat.accent}`}>{stat.count}</p>
        </article>
      ))}
    </div>
  );
};

export default AdminSummaryCards;
