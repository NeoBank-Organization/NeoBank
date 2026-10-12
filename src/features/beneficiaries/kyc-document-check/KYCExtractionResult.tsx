/**
 * ============================================================================
 * COMPONENT: KYCExtractionResult.tsx
 * DESCRIPTION: BNK-AI-04: AI OCR extraction result card displaying parsed Name, DOB, and ID Number.
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
import {CheckCircle,FileText,AlertCircle} from 'lucide-react';

interface KYCExtractionResultProps{
  documentType:'Aadhaar'|'PAN';
  fileName:string;
  extractedName:string;
  extractedDOB:string;
  extractedID:string;
  status:'success'|'mismatch'|'review';
  onContinue?:()=>void;
  onReview?:()=>void;
}

export const KYCExtractionResult:React.FC<KYCExtractionResultProps>=({
  documentType,
  fileName,
  extractedName,
  extractedDOB,
  extractedID,
  status,
  onContinue,
  onReview
})=>{
  const statusDetails={
    success:{
      title:'Document details extracted',
      message:'The document details were extracted successfully.',
      style:'bg-green-50 text-green-700 border-green-200',
      icon:<CheckCircle size={20}/>
    },
    mismatch:{
      title:'Information mismatch detected',
      message:'Some information needs to be checked before proceeding.',
      style:'bg-amber-50 text-amber-700 border-amber-200',
      icon:<AlertCircle size={20}/>
    },
    review:{
      title:'Manual review required',
      message:'The document requires additional verification.',
      style:'bg-blue-50 text-blue-700 border-blue-200',
      icon:<FileText size={20}/>
    }
  };

  const currentStatus=statusDetails[status];

  return(
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
          <FileText size={24}/>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">KYC Extraction Result</h2>
          <p className="text-sm text-slate-500">{documentType} document</p>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
        <FileText size={20} className="text-slate-500"/>
        <span className="truncate text-sm text-slate-700">{fileName}</span>
      </div>

      <div className={`mb-5 flex items-start gap-3 rounded-lg border p-4 ${currentStatus.style}`}>
        {currentStatus.icon}
        <div>
          <p className="font-medium">{currentStatus.title}</p>
          <p className="mt-1 text-sm">{currentStatus.message}</p>
        </div>
      </div>

      <h3 className="mb-3 font-semibold text-slate-800">Extracted Information</h3>

      <div className="space-y-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Full Name</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{extractedName||'Not available'}</p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Date of Birth</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{extractedDOB||'Not available'}</p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Document ID</p>
          <p className="mt-1 break-all text-sm font-medium text-slate-900">{extractedID||'Not available'}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {status==='review'&&(
          <button type="button" onClick={onReview} className="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50">
            Request Manual Review
          </button>
        )}

        {status==='success'&&(
          <button type="button" onClick={onContinue} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Continue
          </button>
        )}

        {status==='mismatch'&&(
          <button type="button" onClick={onReview} className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700">
            Review Details
          </button>
        )}
      </div>
    </div>
  );
};