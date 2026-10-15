/**
 * ============================================================================
 * COMPONENT: PendingLoansList.tsx
 * DESCRIPTION: Review queue for demo and customer-submitted loan applications.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import LoanApprovalDetail from "./LoanApprovalDetail";
import type { ReviewStatus } from "./ApproveRejectActions";
import {
  getLoanApplications,
  LoanApplication as SavedLoanApplication,
  updateLoanApplicationStatus,
} from "../loans/loanService";

interface LoanApplication {
  id: string;
  applicant: string;
  loanType?: string;
  amount: number;
  purpose: string;
  tenure: string;
  submittedAt: string;
  monthlyIncome?: number;
  status?: ReviewStatus;
  rejectionReason?: string;
  savedApplicationId?: string;
}

const demoLoans: LoanApplication[] = [
  {
    id: "DEMO-101",
    applicant: "Alice Johnson",
    loanType: "Home",
    amount: 50000,
    purpose: "Home renovation",
    tenure: "24 months",
    submittedAt: "Today, 08:15 AM",
  },
  {
    id: "DEMO-102",
    applicant: "Bob Martin",
    loanType: "Education",
    amount: 75000,
    purpose: "Education",
    tenure: "36 months",
    submittedAt: "Today, 10:55 AM",
  },
];

const toQueueLoan = (application: SavedLoanApplication): LoanApplication => ({
  id: application.id,
  savedApplicationId: application.id,
  applicant: application.applicant,
  loanType: application.loanType,
  amount: application.amount,
  purpose: application.purpose,
  tenure: `${application.tenureMonths} months`,
  submittedAt: new Date(application.submittedAt).toLocaleString("en-IN"),
  monthlyIncome: application.monthlyIncome,
  status:
    application.status === "APPROVED"
      ? "Approved"
      : application.status === "REJECTED"
        ? "Rejected"
        : undefined,
  rejectionReason: application.rejectionReason,
});

const PendingLoansList: React.FC = () => {
  const [loans, setLoans] = useState<LoanApplication[]>(demoLoans);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [storageRevision, setStorageRevision] = useState(0);

  useEffect(() => {
    try {
      setLoans([
        ...demoLoans,
        ...getLoanApplications().map(toQueueLoan),
      ]);
      setLoadError("");
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Saved loan applications could not be loaded."
      );
    }
  }, [storageRevision]);

  const selected = loans.find((loan) => loan.id === selectedId) ?? null;

  const handleSelect = (loan: LoanApplication) => {
    setActionError("");
    setSelectedId((current) => (current === loan.id ? null : loan.id));

    if (loan.savedApplicationId && !loan.status) {
      try {
        updateLoanApplicationStatus(loan.savedApplicationId, "UNDER_REVIEW");
        setStorageRevision((revision) => revision + 1);
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "The application status could not be updated."
        );
      }
    }
  };

  const handleDecision = (status: ReviewStatus, reason: string) => {
    if (!selected) return;
    setActionError("");

    if (selected.savedApplicationId) {
      try {
        updateLoanApplicationStatus(
          selected.savedApplicationId,
          status === "Approved" ? "APPROVED" : "REJECTED",
          reason || undefined
        );
        setStorageRevision((revision) => revision + 1);
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "The application decision could not be saved."
        );
        return;
      }
    }

    setLoans((current) =>
      current.map((loan) =>
        loan.id === selected.id
          ? { ...loan, status, rejectionReason: reason || undefined }
          : loan
      )
    );
  };

  const pendingCount = loans.filter((loan) => !loan.status).length;

  return (
    <section className="rounded-xl my-6 border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Pending loans</h2>
          <p className="mt-1 text-sm text-slate-500">
            Select an application to review.
          </p>
        </div>
        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
          {pendingCount} awaiting review
        </span>
      </div>

      {loadError && (
        <p className="mt-4 text-sm text-red-700" role="alert">{loadError}</p>
      )}
      {actionError && (
        <p className="mt-4 text-sm text-red-700" role="alert">{actionError}</p>
      )}

      <ul className="mt-4 divide-y divide-slate-100">
        {loans.map((loan) => (
          <li key={loan.id} className="py-1">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
              aria-expanded={selectedId === loan.id}
              onClick={() => handleSelect(loan)}
            >
              <span>
                <span className="block text-sm font-medium text-slate-800">
                  {loan.applicant}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Requested ₹{loan.amount.toLocaleString("en-IN")} • {loan.purpose}
                </span>
              </span>
              <span className="flex items-center gap-2">
                {loan.status && (
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      loan.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {loan.status}
                  </span>
                )}
                <span className="text-xs font-medium text-blue-700">
                  {selectedId === loan.id ? "Hide" : "Review"} →
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <LoanApprovalDetail item={selected} onDecision={handleDecision} />
      )}
    </section>
  );
};

export default PendingLoansList;
