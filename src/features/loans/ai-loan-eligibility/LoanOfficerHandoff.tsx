/**
 * ============================================================================
 * COMPONENT: LoanOfficerHandoff.tsx
 * DESCRIPTION: Approval Workspace for Loan Officers & Branch Admins (Figma Match)
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad (aishwaryahonawad7@gmail.com)
 * PRD REQUIREMENTS: BNK-FR-08 (Admin Approval Workspace), BNK-AI-03 (Advisory Review)
 * ============================================================================
 */

import React, { useState } from "react";
import { LoanApplicationDetails } from "../LoanApplicationDetails";

export interface PendingApplication {
  id: string;
  applicantName: string;
  applicationNumber: string;
  product: string;
  amount: number;
  risk: "Low" | "Medium" | "High";
  monthlyIncome?: number;
  tenureMonths?: number;
  purpose?: string;
  score?: number;
}

const INITIAL_APPLICATIONS: PendingApplication[] = [
  {
    id: "1",
    applicantName: "Arjun Mehta",
    applicationNumber: "NB-PL-250521",
    product: "Personal loan",
    amount: 500000,
    risk: "Low",
    monthlyIncome: 85000,
    tenureMonths: 36,
    purpose: "Home improvement",
    score: 785,
  },
  {
    id: "2",
    applicantName: "Maya Kapoor",
    applicationNumber: "NB-HL-250518",
    product: "Home loan",
    amount: 4200000,
    risk: "Medium",
    monthlyIncome: 140000,
    tenureMonths: 240,
    purpose: "Property purchase",
    score: 710,
  },
  {
    id: "3",
    applicantName: "Dev Shah",
    applicationNumber: "NB-PL-250510",
    product: "Personal loan",
    amount: 800000,
    risk: "High",
    monthlyIncome: 45000,
    tenureMonths: 48,
    purpose: "Debt consolidation",
    score: 590,
  },
];

export interface LoanOfficerHandoffProps {
  onCreateNew?: () => void;
}

export const LoanOfficerHandoff: React.FC<LoanOfficerHandoffProps> = () => {
  const [applications, setApplications] = useState<PendingApplication[]>(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<PendingApplication | null>(null);

  const formatINR = (amt: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);

  const handleDecision = (
    id: string,
    decision: "APPROVED" | "REJECTED" | "ESCALATED",
    notes: string
  ) => {
    alert(`Application ${id} ${decision}! Note: "${notes}"`);
    setApplications((prev) => prev.filter((app) => app.id !== id));
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <header className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          AUTHORIZED ROLES ONLY
        </p>
        <h1 className="text-2xl font-normal tracking-tight text-slate-900 md:text-3xl">
          Approval workspace
        </h1>
        <p className="text-xs text-slate-500">
          Review fictional applications assigned to Loan Officers and Branch Admins.
        </p>
      </header>

      {/* 2. Three KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Awaiting review */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <p className="text-xs font-normal text-slate-500">Awaiting review</p>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {applications.length + 9}
          </div>
          <p className="mt-1 text-xs text-slate-400">4 high priority</p>
        </div>

        {/* Card 2: Approved today */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <p className="text-xs font-normal text-slate-500">Approved today</p>
          <div className="mt-2 text-3xl font-bold text-slate-900">8</div>
          <p className="mt-1 text-xs text-slate-400">₹24.5L total</p>
        </div>

        {/* Card 3: Escalated */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <p className="text-xs font-normal text-slate-500">Escalated</p>
          <div className="mt-2 text-3xl font-bold text-slate-900">2</div>
          <p className="mt-1 text-xs text-slate-400">Branch Admin review</p>
        </div>
      </div>

      {/* 3. Pending Applications Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
        {/* Table Top Header with Yellow Pill */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Pending loan applications
            </h2>
            <p className="text-xs text-slate-400">
              Fictional records for workflow demonstration
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {applications.length + 9} pending
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 sm:px-8">Applicant</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Risk</th>
                <th className="py-4 px-6 text-right sm:pr-8">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No pending applications. All caught up!
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Applicant & App Number */}
                    <td className="py-4 px-6 sm:px-8">
                      <div className="font-semibold text-slate-900">{app.applicantName}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {app.applicationNumber}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-4 px-6 text-slate-600">{app.product}</td>

                    {/* Amount */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatINR(app.amount)}
                    </td>

                    {/* Risk Badge (Green/Yellow/Red) */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          app.risk === "Low"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : app.risk === "Medium"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {app.risk}
                      </span>
                    </td>

                    {/* Review Button */}
                    <td className="py-4 px-6 text-right sm:pr-8">
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="rounded-xl border border-slate-200 px-6 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal Trigger */}
      {selectedApp && (
        <LoanApplicationDetails
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
};

export default LoanOfficerHandoff;