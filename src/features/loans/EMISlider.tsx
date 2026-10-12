/**
 * ============================================================================
 * COMPONENT: EMISlider.tsx
 * DESCRIPTION: Range slider control for dynamic loan principal and tenure adjustments.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R07 - Aishwarya Honawad
 * EMAIL: aishwaryahonawad7@gmail.com
 * ROLE: Loans feature owner
 * PRD REQUIREMENTS: BNK-FR-06 (Loans & EMI), BNK-AI-03 (AI Loan Eligibility)
 * SPRINT DELIVERABLES: Sprint 1 (S1-24, S1-25, S1-26, S1-27) & Sprint 2 (S2-15, S2-16, S2-17, S2-23)
 * PRIMARY RESPONSIBILITIES: Loan application, EMI calculator, slider interaction, loan status and AI loan integration
 * ============================================================================
 */

import React from "react";

interface EMISliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

export const EMISlider: React.FC<EMISliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  minLabel,
  maxLabel,
  onChange,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-slate-700">{label}</label>
        <span className="text-sm font-bold text-slate-900">{displayValue}</span>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg accent-blue-600 transition"
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};
