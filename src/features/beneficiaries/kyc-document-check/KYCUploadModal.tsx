/**
 * ============================================================================
 * COMPONENT: KYCUploadModal.tsx
 * DESCRIPTION: BNK-AI-04: KYC document upload modal accepting Aadhaar/PAN image files.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R03 - Poorvika N
 * EMAIL: poorvipoorvikan@gmail.com
 * ROLE: Beneficiary feature owner
 * PRD REQUIREMENTS: BNK-FR-02 (Beneficiaries), BNK-AI-04 (KYC Document Check)
 * SPRINT DELIVERABLES: Sprint 1 (S1-08, S1-09, S1-10, S1-11) & Sprint 2 (S2-09, S2-10, S2-11)
 * PRIMARY RESPONSIBILITIES: Beneficiary list, add form, IFSC lookup/autosuggest, activation states, KYC document check
 * ============================================================================
 */

import React,{useEffect,useRef,useState} from 'react';
import {X,Upload,FileText,Trash2} from 'lucide-react';

interface KYCUploadModalProps{
  isOpen:boolean;
  onClose:()=>void;
  onContinue:(file:File,documentType:'Aadhaar'|'PAN')=>void;
}

export const KYCUploadModal:React.FC<KYCUploadModalProps>=({isOpen,onClose,onContinue})=>{
  const [documentType,setDocumentType]=useState<'Aadhaar'|'PAN'>('Aadhaar');
  const [file,setFile]=useState<File|null>(null);
  const [error,setError]=useState('');
  const [preview,setPreview]=useState('');
  const [isChecking,setIsChecking]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(!file){
      setPreview('');
      return;
    }

    const url=URL.createObjectURL(file);
    setPreview(url);

    return()=>URL.revokeObjectURL(url);
  },[file]);

  useEffect(()=>{
    if(isOpen){
      setDocumentType('Aadhaar');
      setFile(null);
      setError('');
      setIsChecking(false);
    }
  },[isOpen]);

  if(!isOpen)return null;

  const handleFileChange=(selectedFile?:File)=>{
    setError('');
    setFile(null);

    if(inputRef.current)inputRef.current.value='';

    if(!selectedFile)return;

    if(!['image/jpeg','image/png','image/webp'].includes(selectedFile.type)){
      setError('Upload a JPG, PNG, or WEBP image.');
      return;
    }

    if(selectedFile.size>5*1024*1024){
      setError('File size must not exceed 5 MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleContinue=async()=>{
    if(!file)return;

    setIsChecking(true);
    setError('');

    try{
      const imageUrl=URL.createObjectURL(file);

      try{
        const image=new Image();

        await new Promise<void>((resolve,reject)=>{
          image.onload=()=>resolve();
          image.onerror=()=>reject(new Error('Unable to read this image.'));
          image.src=imageUrl;
        });

        if(image.naturalWidth<300||image.naturalHeight<200){
          setError('This image is too small. Upload a clear image of your document.');
          return;
        }

        const ratio=image.naturalWidth/image.naturalHeight;

        if(ratio<0.45||ratio>2.2){
          setError('This image does not appear to have a suitable document layout. Upload a clear Aadhaar or PAN image.');
          return;
        }

        setError('Image format and dimensions are acceptable, but the document has not been verified. Actual Aadhaar/PAN recognition must be completed before proceeding.');

      }finally{
        URL.revokeObjectURL(imageUrl);
      }
    }catch{
      setError('Unable to read the image. Please select another file.');
    }finally{
      setIsChecking(false);
    }
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="kyc-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 id="kyc-title" className="text-xl font-semibold text-slate-900">KYC Document Verification</h2>
            <p className="mt-1 text-sm text-slate-500">Upload an Aadhaar or PAN image.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X size={20}/>
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          {(['Aadhaar','PAN'] as const).map(type=>(
            <button key={type} type="button" onClick={()=>{
              setDocumentType(type);
              setFile(null);
              setError('');
              if(inputRef.current)inputRef.current.value='';
            }} className={`rounded-lg border px-4 py-3 text-sm font-medium ${documentType===type?'border-blue-600 bg-blue-50 text-blue-700':'border-slate-200 text-slate-600'}`}>
              {type}
            </button>
          ))}
        </div>

        <label htmlFor="kyc-file" className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 px-5 py-8 text-center hover:border-blue-500">
          {preview?<img src={preview} alt="Selected image preview" className="mb-4 max-h-48 max-w-full rounded-lg object-contain"/>:<Upload size={32} className="mb-3 text-blue-600"/>}
          <span className="text-sm font-medium text-slate-800">{file?file.name:'Choose a document image'}</span>
          <span className="mt-1 text-xs text-slate-500">JPG, PNG or WEBP · Maximum 5 MB</span>
          <input ref={inputRef} id="kyc-file" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>handleFileChange(e.target.files?.[0])}/>
        </label>

        {file&&(
          <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <FileText size={18}/>
              <span className="max-w-xs truncate">{file.name}</span>
            </div>
            <button type="button" onClick={()=>{
              setFile(null);
              setError('');
              if(inputRef.current)inputRef.current.value='';
            }} aria-label="Remove document" className="text-red-600 hover:text-red-700">
              <Trash2 size={18}/>
            </button>
          </div>
        )}

        {error&&<p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 text-xs text-slate-500">Image checks do not confirm document identity or authenticity. Verification requires a document-recognition service.</p>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="button" disabled={!file||isChecking} onClick={handleContinue} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{isChecking?'Checking...':'Check document'}</button>
        </div>
      </div>
    </div>
  );
};