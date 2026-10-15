/**
 * ============================================================================
 * COMPONENT: EMICalculator.tsx
 * DESCRIPTION: Interactive EMI calculator iframe wrapper with real-time interest calculation.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * EMAIL: aishwaryahonawad7@gmail.com
 * ROLE: Loans feature owner
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility)
 * SPRINT DELIVERABLES: Sprint 1 (S1-24, S1-25, S1-26, S1-27) & Sprint 2 (S2-15, S2-16, S2-17, S2-23)
 * PRIMARY RESPONSIBILITIES: Loan application, EMI calculator, slider interaction, loan status and AI loan integration
 * ============================================================================
 */



import React, { useState } from "react";
import { EMISlider } from "./EMISlider";

export const EMICalculator: React.FC = () => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(36);

  const monthlyRate = rate / 12 / 100;
  const emi = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
  );
  const totalPayment = emi * tenure;
  const totalInterest = Math.max(0, totalPayment - amount);

  const formatINR = (amt: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6">
      <h2 className="text-lg font-bold text-slate-900">Interactive EMI Calculator</h2>
      
      <div className="space-y-5">
        <EMISlider
          label="Loan amount"
          value={amount}
          min={50000}
          max={5000000}
          step={25000}
          displayValue={formatINR(amount)}
          minLabel="₹50,000"
          maxLabel="₹50,00,000"
          onChange={setAmount}
        />

        <EMISlider
          label="Interest rate"
          value={rate}
          min={6.5}
          max={20}
          step={0.25}
          displayValue={`${rate.toFixed(1)}% p.a.`}
          minLabel="6.5%"
          maxLabel="20%"
          onChange={setRate}
        />

        <EMISlider
          label="Tenure"
          value={tenure}
          min={6}
          max={120}
          step={6}
          displayValue={`${tenure} months`}
          minLabel="6 mo"
          maxLabel="120 mo"
          onChange={setTenure}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
        <div>
          <p className="text-[11px] text-slate-500">Monthly EMI</p>
          <p className="text-base font-bold text-blue-600">{formatINR(emi)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500">Total Interest</p>
          <p className="text-base font-bold text-amber-600">{formatINR(totalInterest)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500">Total Payable</p>
          <p className="text-base font-bold text-slate-900">{formatINR(totalPayment)}</p>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
