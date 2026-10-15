/**
 * ============================================================================
 * COMPONENT: LoanPage.tsx
 * DESCRIPTION: Multi-step retail loan application container & orchestrator.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad (aishwaryahonawad7@gmail.com)
 * ============================================================================
 */

import React, { useState } from "react";
import { Building2, ArrowRight } from "lucide-react";
import { LoanCard, LoanProduct } from "./LoanCard";
import { ApplicantInputStep } from "./ApplicantInputStep";
import { AILoanEligibilityCard } from "./ai-loan-eligibility/AILoanEligibilityCard";
import { LoanOfficerHandoff } from "./ai-loan-eligibility/LoanOfficerHandoff";

type RoleMode = "customer" | "officer" | "admin";
type PageMode = "catalog" | "application" | "assessment";

const defaultLoans: LoanProduct[] = [
  {
    id: 1,
    type: "personal",
    name: "Personal loan",
    rate: "From 10.49% p.a.",
    indicativeRateValue: 10.49,
    description: "For life's planned and unplanned moments.",
  },
  {
    id: 2,
    type: "home",
    name: "Home loan",
    rate: "From 8.35% p.a.",
    indicativeRateValue: 8.35,
    description: "A smoother path to your dream home.",
  },
  {
    id: 3,
    type: "vehicle",
    name: "Vehicle loan",
    rate: "From 9.10% p.a.",
    indicativeRateValue: 9.10,
    description: "Get moving with flexible financing.",
  },
];

export const LoanPage: React.FC = () => {
  const [role, setRole] = useState<RoleMode>("customer");
  const [pageMode, setPageMode] = useState<PageMode>("catalog");
  const [selectedLoan, setSelectedLoan] = useState<LoanProduct>(defaultLoans[0]);

  const [applicationData, setApplicationData] = useState<{
    amount: number;
    tenure: number;
    emi: number;
    purpose: string;
  } | null>(null);

  return (
    <main className="min-h-screen bg-slate-50/70 px-6 py-6 text-slate-900 md:px-12">
      {/* ======================================================== */}
      {/* Top Bar: Preview Role Switcher (Matching Figma)         */}
      {/* ======================================================== */}
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-end gap-2 text-[11px]">
        <span className="text-slate-400">Preview role:</span>
        <button
          type="button"
          onClick={() => setRole("customer")}
          className={`rounded-full px-3 py-1 font-medium transition ${
            role === "customer"
              ? "bg-[#0f172a] text-white"
              : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
          }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setRole("officer")}
          className={`rounded-full px-3 py-1 font-medium transition ${
            role === "officer"
              ? "bg-[#0f172a] text-white"
              : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
          }`}
        >
          Loan Officer
        </button>
        <button
          type="button"
          onClick={() => setRole("admin")}
          className={`rounded-full px-3 py-1 font-medium transition ${
            role === "admin"
              ? "bg-[#0f172a] text-white"
              : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
          }`}
        >
          Branch Admin
        </button>
      </header>

      {/* ======================================================== */}
      {/* Body View Based on Role or Page Mode                    */}
      {/* ======================================================== */}
      <div className="mx-auto max-w-6xl">
        {/* WHEN LOAN OFFICER OR BRANCH ADMIN IS CLICKED: */}
        {role !== "customer" ? (
          <LoanOfficerHandoff />
        ) : pageMode === "application" ? (
          /* CUSTOMER APPLICATION FLOW */
          <ApplicantInputStep
            loanName={selectedLoan.name}
            indicativeRate={selectedLoan.indicativeRateValue}
            onCancel={() => setPageMode("catalog")}
            onContinueToKYC={(data: any) => {
              setApplicationData(data);
              setPageMode("assessment");
            }}
          />
        ) : pageMode === "assessment" ? (
          /* STEP 3: AI ADVISORY PRE-ASSESSMENT */
          <div className="mx-auto max-w-4xl space-y-4">
            <button
              onClick={() => setPageMode("application")}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              &larr; Back to loan configuration
            </button>
            <AILoanEligibilityCard
              result={{
                eligibilityStatus: "Eligible",
                maxSuggestedAmount: 650000,
                recommendedTenureMonths: applicationData?.tenure || 36,
                confidenceScore: 94,
                debtToIncomeRatio: 28,
                reasons: [
                  "Strong simulated credit score (780+).",
                  "Debt-to-Income ratio of 28% is well below the 50% limit.",
                  "Sufficient surplus disposable income to service EMI.",
                ],
              }}
              onModifyInputs={() => setPageMode("application")}
              onProceedToSubmit={() => {
                alert("Simulated application submitted to Loan Officer queue!");
                setPageMode("catalog");
              }}
            />
          </div>
        ) : (
          /* CUSTOMER HERO & CATALOG VIEW */
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                Borrow
              </p>
              <h1 className="mt-1 text-2xl font-normal tracking-tight text-slate-900 md:text-3xl">
                Loans built around your goals
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Explore lending options with transparent rates and no hidden surprises.
              </p>
            </div>

            {/* Blue Banner with Concentric Circles & Bank Icon */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d3b66] via-[#104880] to-[#1a5ca4] px-10 py-9 text-white shadow-sm">
              <div className="pointer-events-none absolute -right-6 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-16 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-white/5" />

              <div className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 md:flex">
                <Building2 className="h-28 w-28 text-white/20" strokeWidth={1.2} />
              </div>

              <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[9px] font-semibold text-blue-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Pre-qualified offer
                </div>

                <h2 className="mt-4 text-2xl font-normal leading-snug tracking-tight text-white md:text-3xl">
                  Turn your next plan <br />
                  into a possibility.
                </h2>

                <p className="mt-2 text-xs text-blue-100">
                  Advisory eligibility up to ₹8,00,000 with flexible repayment terms.
                </p>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLoan(defaultLoans[0]);
                      setPageMode("application");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500"
                  >
                    Check eligibility
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <p className="mt-2 text-[9px] text-blue-200">
                    Checking will not affect your credit score.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom 3 Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {defaultLoans.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onApply={(l) => {
                    setSelectedLoan(l);
                    setPageMode("application");
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default LoanPage;