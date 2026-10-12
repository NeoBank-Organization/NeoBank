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

export type AdminMetric = "accounts" | "loans" | "approved";

interface AdminSummaryCardsProps {
  selectedMetric: AdminMetric | null;
  onSelectMetric: (metric: AdminMetric) => void;
}

const AdminSummaryCards: React.FC<AdminSummaryCardsProps> = ({
  selectedMetric,
  onSelectMetric,
}) => {
  const stats = [
    { key: "accounts" as const, title: "Pending Accounts", count: 2, accent: "text-blue-700", icon: "♙" },
    { key: "loans" as const, title: "Pending Loans", count: 2, accent: "text-violet-700", icon: "♜" },
    { key: "approved" as const, title: "Approved Today", count: 1, accent: "text-emerald-700", icon: "✓" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <button
          key={stat.key}
          type="button"
          aria-pressed={selectedMetric === stat.key}
          onClick={() => onSelectMetric(stat.key)}
          className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            selectedMetric === stat.key
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-slate-200"
          }`}
        >
          <span className="flex items-start justify-between">
            <span className="text-sm font-medium text-slate-600">{stat.title}</span>
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-lg ${stat.accent}`}>
              {stat.icon}
            </span>
          </span>
          <span className={`mt-4 block text-3xl font-bold ${stat.accent}`}>{stat.count}</span>
          <span className="mt-2 block text-xs text-slate-500">Click to view details</span>
        </button>
      ))}
    </div>
  );
};

export default AdminSummaryCards;
