/**
 * ============================================================================
 * COMPONENT: LoanApplicationDetails.tsx
 * DESCRIPTION: Displays the submitted loan application details.
 * ============================================================================
 */

import React from "react";
import type { LoanApplication } from "./loanService";

interface LoanApplicationDetailsProps {
  application: LoanApplication;
}

export const LoanApplicationDetails: React.FC<LoanApplicationDetailsProps> = ({
  application,
}) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">Application details</h2>
      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Loan type</dt>
          <dd className="mt-1 font-medium text-slate-900">{application.loanType}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Requested amount</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {formatCurrency(application.amount)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Tenure</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {application.tenureMonths} months
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Monthly income</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {formatCurrency(application.monthlyIncome)}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-slate-500">Purpose</dt>
          <dd className="mt-1 font-medium text-slate-900">{application.purpose}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Submitted</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {new Date(application.submittedAt).toLocaleString("en-IN")}
          </dd>
        </div>
      </dl>
    </section>
  );
};
