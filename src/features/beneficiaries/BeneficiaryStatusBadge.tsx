/**
 * ============================================================================
 * COMPONENT: BeneficiaryStatusBadge.tsx
 * DESCRIPTION: Status pill indicating Active, Pending Activation, or Restricted status.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R03 - Poorvika N
 * EMAIL: poorvipoorvikan@gmail.com
 * ROLE: Beneficiary feature owner
 * PRD REQUIREMENTS: BNK-FR-02 (Beneficiaries), BNK-AI-04 (KYC Document Check)
 * SPRINT DELIVERABLES: Sprint 1 (S1-08, S1-09, S1-10, S1-11) & Sprint 2 (S2-09, S2-10, S2-11)
 * PRIMARY RESPONSIBILITIES: Beneficiary list, add form, IFSC lookup/autosuggest, activation states, KYC document check
 * ============================================================================
 */

import React from 'react';

interface BeneficiaryStatusBadgeProps{
  status:'ACTIVE'|'PENDING'|'INACTIVE';
}

const styles={
  ACTIVE:'bg-emerald-50 text-emerald-600',
  PENDING:'bg-amber-50 text-amber-600',
  INACTIVE:'bg-slate-100 text-slate-500'
};

const dots={
  ACTIVE:'bg-emerald-500',
  PENDING:'bg-amber-500',
  INACTIVE:'bg-slate-400'
};

export const BeneficiaryStatusBadge:React.FC<BeneficiaryStatusBadgeProps>=({status})=>{
  return(
    <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`}/>
      {status.charAt(0)+status.slice(1).toLowerCase()}
    </span>
  );
};