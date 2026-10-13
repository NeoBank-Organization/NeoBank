/**
 * ============================================================================
 * COMPONENT: KYCMismatchAlert.tsx
 * DESCRIPTION: BNK-AI-04: Alert banner highlighting data discrepancy between uploaded document and form input.
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
import {AlertTriangle, CheckCircle, X} from 'lucide-react';

interface KYCMismatchAlertProps {
  isOpen:boolean;
  documentName:string;
  beneficiaryName:string;
  onClose:()=>void;
  onContinue:()=>void;
  onReview:()=>void;
}

export const KYCMismatchAlert:React.FC<KYCMismatchAlertProps>=({
  isOpen,
  documentName,
  beneficiaryName,
  onClose,
  onContinue,
  onReview
})=>{
  if(!isOpen)return null;

  const isMatch=documentName.trim().toLowerCase()===beneficiaryName.trim().toLowerCase();

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full ${isMatch?'bg-green-100 text-green-600':'bg-amber-100 text-amber-600'}`}>
            {isMatch?<CheckCircle size={24}/>:<AlertTriangle size={24}/>}
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20}/>
          </button>
        </div>

        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          {isMatch?'Name Matched':'Name Mismatch Detected'}
        </h2>

        <p className="mb-5 text-sm text-gray-600">
          {isMatch
            ?'The beneficiary name matches the name provided in the document.'
            :'The beneficiary name differs from the name provided in the document. Review the details before continuing.'}
        </p>

        <div className="mb-5 space-y-3 rounded-lg border border-gray-200 p-4">
          <div>
            <p className="text-xs text-gray-500">Beneficiary Name</p>
            <p className="font-medium text-gray-900">{beneficiaryName||'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Document Name</p>
            <p className="font-medium text-gray-900">{documentName||'Not available'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isMatch?(
            <button type="button" onClick={onContinue} className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">
              Continue
            </button>
          ):(
            <button type="button" onClick={onReview} className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white hover:bg-amber-600">
              Request Manual Review
            </button>
          )}
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
