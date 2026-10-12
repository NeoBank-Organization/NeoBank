/**
 * ============================================================================
 * COMPONENT: KYCManualReviewDrawer.tsx
 * DESCRIPTION: BNK-AI-04: Handoff drawer routing ambiguous KYC verification to branch admin officer.
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
import {AlertTriangle, X, CheckCircle} from 'lucide-react';

interface KYCManualReviewDrawerProps {
  isOpen:boolean;
  beneficiaryName:string;
  documentType:'Aadhaar'|'PAN';
  onClose:()=>void;
  onSubmit:(reason:string)=>void;
}

export const KYCManualReviewDrawer:React.FC<KYCManualReviewDrawerProps>=({
  isOpen,
  beneficiaryName,
  documentType,
  onClose,
  onSubmit
})=>{
  const [reason,setReason]=useState('');
  const [submitted,setSubmitted]=useState(false);

  if(!isOpen)return null;

  const handleSubmit=()=>{
    if(!reason.trim())return;
    onSubmit(reason.trim());
    setSubmitted(true);
  };

  const handleClose=()=>{
    setReason('');
    setSubmitted(false);
    onClose();
  };

  return(
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close manual review" onClick={handleClose} className="absolute inset-0 h-full w-full bg-black/50"/>
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">KYC Manual Review</h2>
            <p className="mt-1 text-sm text-gray-500">Beneficiary document verification</p>
          </div>
          <button type="button" onClick={handleClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <X size={20}/>
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {submitted?(
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <CheckCircle size={36} className="mx-auto mb-3 text-green-600"/>
              <h3 className="font-semibold text-green-800">Review Request Submitted</h3>
              <p className="mt-2 text-sm text-green-700">The review request has been recorded in this session.</p>
            </div>
          ):(
            <>
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle size={22} className="shrink-0 text-amber-600"/>
                <p className="text-sm text-amber-800">This document requires additional verification before the KYC process can be completed.</p>
              </div>

              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-xs text-gray-500">Beneficiary Name</p>
                  <p className="mt-1 font-medium text-gray-900">{beneficiaryName||'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Document Type</p>
                  <p className="mt-1 font-medium text-gray-900">{documentType}</p>
                </div>
                <div>
                  <label htmlFor="reviewReason" className="mb-2 block text-sm font-medium text-gray-700">Reason for Manual Review</label>
                  <textarea
                    id="reviewReason"
                    value={reason}
                    onChange={e=>setReason(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Describe the mismatch or verification issue..."
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-right text-xs text-gray-500">{reason.length}/500</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-200 p-5">
          {submitted?(
            <button type="button" onClick={handleClose} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">
              Done
            </button>
          ):(
            <>
              <button type="button" onClick={handleClose} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!reason.trim()}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit for Review
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};