/**
 * ============================================================================
 * COMPONENT: BeneficiaryCard.tsx
 * DESCRIPTION: Individual beneficiary card displaying nickname, IFSC code, and action buttons.
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
import {Building2,CreditCard,ArrowUpRight} from 'lucide-react';
import {BeneficiaryStatusBadge} from './BeneficiaryStatusBadge';
import {ActivationCoolingBanner} from './ActivationCoolingBanner';

export interface Beneficiary{
  id:string;
  name:string;
  bank:string;
  accountNumber?:string;
  upiId?:string;
  nickname:string;
  status:'ACTIVE'|'PENDING'|'INACTIVE';
  activationTime?:string;
  avatarClass?:string;
}

interface BeneficiaryCardProps{
  beneficiary:Beneficiary;
  onView:()=>void;
  onPay:()=>void;
}

export const BeneficiaryCard:React.FC<BeneficiaryCardProps>=({beneficiary,onView,onPay})=>{
  const initials=beneficiary.name
    .split(' ')
    .map(word=>word.charAt(0))
    .join('')
    .slice(0,2)
    .toUpperCase();

  const account=beneficiary.accountNumber
    ? `•••• ${beneficiary.accountNumber.slice(-4)}`
    : beneficiary.upiId;

  return(
    <div className="flex h-[210px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${beneficiary.avatarClass||'bg-blue-500'}`}>
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {beneficiary.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {beneficiary.nickname}
                </p>
              </div>

              <BeneficiaryStatusBadge status={beneficiary.status}/>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Building2 size={10}/>
              Bank
            </div>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
              {beneficiary.bank}
            </p>
          </div>

          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <CreditCard size={10}/>
              {beneficiary.upiId?'UPI':'Account'}
            </div>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
              {account}
            </p>
          </div>
        </div>

        {beneficiary.status==='PENDING'&&beneficiary.activationTime&&(
          <ActivationCoolingBanner activationTime={beneficiary.activationTime}/>
        )}
      </div>

      <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-100 px-4">
        <button
          type="button"
          onClick={onView}
          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600"
        >
          View details
          <ArrowUpRight size={12}/>
        </button>

        <button
          type="button"
          onClick={onPay}
          disabled={beneficiary.status!=='ACTIVE'}
          className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200"
        >
          Pay
        </button>
      </div>
    </div>
  );
};
