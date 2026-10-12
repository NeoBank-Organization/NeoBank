/**
 * ============================================================================
 * COMPONENT: PendingAccountsList.tsx
 * DESCRIPTION: Queue of customer account opening requests awaiting officer verification.
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
import AccountApprovalDetail from "./AccountApprovalDetail";
import type { ReviewStatus } from "./ApproveRejectActions";

interface AccountApplication {
  id: number;
  name: string;
  type: string;
  branch: string;
  submittedAt: string;
  risk: "Low" | "Medium" | "High";
  status?: ReviewStatus;
  rejectionReason?: string;
}

const PendingAccountsList: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountApplication[]>([
    {
      id: 1,
      name: "John Doe",
      type: "Savings",
      branch: "Aundh Branch",
      submittedAt: "Today, 09:40 AM",
      risk: "Low",
    },
    {
      id: 2,
      name: "Jane Smith",
      type: "Current",
      branch: "Koramangala Branch",
      submittedAt: "Today, 11:10 AM",
      risk: "Medium",
    },
  ]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = accounts.find((account) => account.id === selectedId) ?? null;

  const handleDecision = (status: ReviewStatus, reason: string) => {
    if (selectedId === null) return;
    setAccounts((current) =>
      current.map((account) =>
        account.id === selectedId
          ? { ...account, status, rejectionReason: reason || undefined }
          : account
      )
    );
  };

  const pendingCount = accounts.filter((account) => !account.status).length;

  return (
    <section className="rounded-xl border my-6 border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Pending accounts</h2>
          <p className="mt-1 text-sm text-slate-500">Select an application to review.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          {pendingCount} queued
        </span>
      </div>

      <ul className="mt-4 divide-y divide-slate-100">
        {accounts.map((acc) => (
          <li key={acc.id} className="py-1">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
              aria-expanded={selectedId === acc.id}
              onClick={() => setSelectedId((current) => (current === acc.id ? null : acc.id))}
            >
              <span>
                <span className="block text-sm font-medium text-slate-800">{acc.name}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {acc.type} account • {acc.branch}
                </span>
              </span>
              <span className="flex items-center gap-2">
                {acc.status && (
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      acc.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {acc.status}
                  </span>
                )}
                <span className="text-xs font-medium text-blue-700">
                  {selectedId === acc.id ? "Hide" : "Review"} →
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <AccountApprovalDetail item={selected} onDecision={handleDecision} />
      )}
    </section>
  );
};

export default PendingAccountsList;
