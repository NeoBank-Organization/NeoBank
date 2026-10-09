/**
 * ============================================================================
 * COMPONENT: ActivationCoolingBanner.tsx
 * DESCRIPTION: Cooling period policy notification banner restricting immediate high-value transfers.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R03 - Poorvika N
 * EMAIL: poorvipoorvikan@gmail.com
 * ROLE: Beneficiary feature owner
 * PRD REQUIREMENTS: BNK-FR-02 (Beneficiaries), BNK-AI-04 (KYC Document Check)
 * SPRINT DELIVERABLES: Sprint 1 (S1-08, S1-09, S1-10, S1-11) & Sprint 2 (S2-09, S2-10, S2-11)
 * PRIMARY RESPONSIBILITIES: Beneficiary list, add form, IFSC lookup/autosuggest, activation states, KYC document check
 * ============================================================================
 */

import React,{useEffect,useState} from 'react';

interface ActivationCoolingBannerProps{
  activationTime:string;
}

export const ActivationCoolingBanner:React.FC<ActivationCoolingBannerProps>=({activationTime})=>{
  const getRemaining=()=>{
    return Math.max(0,new Date(activationTime).getTime()-Date.now());
  };

  const [remaining,setRemaining]=useState(getRemaining);

  useEffect(()=>{
    const timer=setInterval(()=>setRemaining(getRemaining()),1000);
    return()=>clearInterval(timer);
  },[activationTime]);

  if(remaining<=0)return null;

  const totalSeconds=Math.floor(remaining/1000);
  const minutes=Math.floor(totalSeconds/60);
  const seconds=totalSeconds%60;

  return(
    <div className="mt-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-600">
      Cooling period: {minutes}:{seconds.toString().padStart(2,'0')} remaining
    </div>
  );
};
