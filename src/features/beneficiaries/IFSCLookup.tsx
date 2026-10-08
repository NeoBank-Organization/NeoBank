/**
 * ============================================================================
 * COMPONENT: IFSCLookup.tsx
 * DESCRIPTION: IFSC code autosuggest and bank/branch detail lookup component.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R03 - Poorvika N
 * EMAIL: poorvipoorvikan@gmail.com
 * ROLE: Beneficiary feature owner
 * PRD REQUIREMENTS: BNK-FR-02 (Beneficiaries), BNK-AI-04 (KYC Document Check)
 * SPRINT DELIVERABLES: Sprint 1 (S1-08, S1-09, S1-10, S1-11) & Sprint 2 (S2-09, S2-10, S2-11)
 * PRIMARY RESPONSIBILITIES: Beneficiary list, add form, IFSC lookup/autosuggest, activation states, KYC document check
 * ============================================================================
 */

import React,{useState} from 'react';

interface IFSCData{
  bankName:string;
  branch:string;
  address:string;
  ifsc:string;
}

interface IFSCLookupProps{
  ifsc:string;
  onLookup:(data:IFSCData)=>void;
}

const mockIFSCData:Record<string,IFSCData>={
  SBIN0001234:{
    bankName:'State Bank',
    branch:'Main Branch',
    address:'Bengaluru',
    ifsc:'SBIN0001234'
  },
  CNRB0987654:{
    bankName:'Canara Bank',
    branch:'Main Branch',
    address:'Bengaluru',
    ifsc:'CNRB0987654'
  },
  NSTR0001234:{
    bankName:'Northstar Bank',
    branch:'Main Branch',
    address:'Bengaluru',
    ifsc:'NSTR0001234'
  }
};

export const IFSCLookup:React.FC<IFSCLookupProps>=({ifsc,onLookup})=>{
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');

  const handleLookup=()=>{
    const value=ifsc.trim().toUpperCase();

    if(!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)){
      setError('Enter a valid IFSC code');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(()=>{
      const result=mockIFSCData[value];

      if(result){
        onLookup(result);
      }else{
        setError('Bank details not found');
      }

      setLoading(false);
    },500);
  };

  return(
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Bank & branch details</p>
          <p className="mt-1 text-sm text-slate-500">
            {loading?'Looking up bank details...':'Verify the bank details using IFSC.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLookup}
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
        >
          {loading?'Checking...':'Lookup'}
        </button>
      </div>
      {error&&<p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};