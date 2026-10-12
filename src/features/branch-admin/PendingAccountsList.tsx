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
import LoanApprovalDetail from "./LoanApprovalDetail";

const PendingAccountsList: React.FC = () => {
  const [selected, setSelected] = useState<any | null>(null);

  const accounts = [
    { id: 1, name: "John Doe", type: "Savings" },
    { id: 2, name: "Jane Smith", type: "Current" },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Pending accounts</h2>
      <p className="mt-1 text-sm text-slate-500">Select an application to review.</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {accounts.map(acc => (
          <li
            key={acc.id}
            className="py-1"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
              onClick={() => setSelected(acc)}
            >
              <span>
                <span className="block text-sm font-medium text-slate-800">{acc.name}</span>
                <span className="mt-1 block text-xs text-slate-500">{acc.type} account</span>
              </span>
              <span className="text-xs font-medium text-blue-700">Review →</span>
            </button>
          </li>
        ))}
      </ul>
      {selected && <LoanApprovalDetail item={selected} type="account" />}
    </section>
  );
};

export default PendingAccountsList;
