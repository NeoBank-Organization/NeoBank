/**
 * ============================================================================
 * COMPONENT: ApplicantInputStep.tsx
 * DESCRIPTION: Applicant details input fields (monthly income, tenure, loan purpose).
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * EMAIL: aishwaryahonawad7@gmail.com
 * ROLE: Loans feature owner
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility)
 * SPRINT DELIVERABLES: Sprint 1 (S1-24, S1-25, S1-26, S1-27) & Sprint 2 (S2-15, S2-16, S2-17, S2-23)
 * PRIMARY RESPONSIBILITIES: Loan application, EMI calculator, slider interaction, loan status and AI loan integration
 * ============================================================================
 */

/**
 * ============================================================================
 * COMPONENT: ApplicantInputStep.tsx
 * DESCRIPTION: Multi-step retail loan application - Step 1: Loan details
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility)
 * ============================================================================
 */

/**
 * ============================================================================
 * COMPONENT: ApplicantInputStep.tsx
 * DESCRIPTION: Multi-step retail loan application - Step 1: Loan details (Figma Match)
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * ROLE: Loans feature owner
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility)
 * ============================================================================
 */

/**
 * ============================================================================
 * COMPONENT: ApplicantInputStep.tsx
 * DESCRIPTION: Multi-step retail loan application - Step 1: Loan details (Figma Match)
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * ROLE: Loans feature owner
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility)
 * ============================================================================
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type LoanPurposeType = "Home improvement" | "Education" | "Medical expenses";

export interface ApplicantInputStepProps {
  loanName?: string;
  applicationNumber?: string;
  indicativeRate?: number;
  onCancel?: () => void;
  onContinueToKYC?: (data: {
    amount: number;
    tenure: number;
    emi: number;
    purpose: LoanPurposeType;
  }) => void;
}

export const ApplicantInputStep: React.FC<ApplicantInputStepProps> = ({
  loanName = "Personal loan",
  applicationNumber = "NB-PL-250521",
  indicativeRate = 10.49,
  onCancel,
  onContinueToKYC,
}) => {
  const [amount, setAmount] = useState<number>(500000);
  const [tenure, setTenure] = useState<number>(36);
  const [purpose, setPurpose] = useState<LoanPurposeType>("Home improvement");

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const purposeOptions: LoanPurposeType[] = [
    "Home improvement",
    "Education",
    "Medical expenses",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Precise EMI Formula: ₹5,00,000 at 10.49% for 36 months => ₹16,245
  const monthlyEMI = useMemo(() => {
    const monthlyRate = indicativeRate / 12 / 100;
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  }, [amount, tenure, indicativeRate]);

  const amountMin = 50000;
  const amountMax = 1000000;
  const amountProgress = ((amount - amountMin) / (amountMax - amountMin)) * 100;

  const tenureMin = 12;
  const tenureMax = 60;
  const tenureProgress = ((tenure - tenureMin) / (tenureMax - tenureMin)) * 100;

  return (
    <div className="mx-auto w-full max-w-[820px] rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs md:p-10">
      {/* 1. Stepper: [1 Loan details] ─── [2 KYC] ─── [3 Assessment] */}
      <div className="relative mb-10 flex items-center justify-between px-10 sm:px-14">
        <div className="absolute left-16 right-16 top-4 h-[1px] bg-slate-200" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-xs">
            1
          </div>
          <span className="mt-2 text-[11px] font-semibold text-blue-600">
            Loan details
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-400">
            2
          </div>
          <span className="mt-2 text-[11px] font-medium text-slate-400">
            KYC
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-400">
            3
          </div>
          <span className="mt-2 text-[11px] font-medium text-slate-400">
            Assessment
          </span>
        </div>
      </div>

      {/* 2. Subheading */}
      <h2 className="mb-6 text-base font-semibold text-slate-900">
        Tell us what you need
      </h2>

      {/* 3. Sliders */}
      <div className="space-y-6">
        {/* Slider 1: Loan Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-normal text-slate-700">
              Loan amount
            </label>
            <span className="text-sm font-bold text-slate-900">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={amountMin}
              max={amountMax}
              step={25000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${amountProgress}%, #e2e8f0 ${amountProgress}%, #e2e8f0 100%)`,
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg accent-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>₹50,000</span>
            <span>₹10,00,000</span>
          </div>
        </div>

        {/* Slider 2: Repayment Tenure */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-normal text-slate-700">
              Repayment tenure
            </label>
            <span className="text-sm font-bold text-slate-900">
              {tenure} months
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={tenureMin}
              max={tenureMax}
              step={6}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${tenureProgress}%, #e2e8f0 ${tenureProgress}%, #e2e8f0 100%)`,
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg accent-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* 4. Estimated Monthly EMI Box (₹16,245) */}
        <div className="flex items-center justify-between rounded-xl bg-[#eef5fc] px-6 py-4">
          <div>
            <p className="text-xs font-medium text-slate-600">
              Estimated monthly EMI
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              at an indicative rate of {indicativeRate.toFixed(2)}% p.a.
            </p>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#1d68d8]">
            ₹{monthlyEMI.toLocaleString("en-IN")}
          </span>
        </div>

        {/* 5. Custom Dropdown from Figma */}
        <div className="space-y-1.5" ref={dropdownRef}>
          <label className="text-[13px] font-medium text-slate-800">
            Loan purpose
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-xs transition focus:outline-none ${
                isDropdownOpen
                  ? "rounded-b-none border-blue-600 ring-1 ring-blue-600"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="font-normal text-slate-900">{purpose}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 z-20 -mt-[1px] overflow-hidden rounded-b-xl border border-blue-600 bg-white shadow-lg">
                {purposeOptions.map((opt) => {
                  const isSelected = purpose === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setPurpose(opt);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex w-full items-center px-4 py-3 text-left text-xs transition ${
                        isSelected
                          ? "bg-blue-600 font-medium text-white"
                          : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Footer Buttons */}
      <div className="mt-10 flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            onContinueToKYC?.({
              amount,
              tenure,
              emi: monthlyEMI,
              purpose,
            })
          }
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
        >
          Continue to KYC
        </button>
      </div>
    </div>
  );
};

export default ApplicantInputStep;