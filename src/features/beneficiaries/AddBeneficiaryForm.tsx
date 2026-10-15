/**
 * ============================================================================
 * COMPONENT: AddBeneficiaryForm.tsx
 * DESCRIPTION: Form to register a new beneficiary with account number confirmation and IFSC lookup.
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
import {Formik,Form,Field,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {X,ShieldCheck,FileText} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {IFSCLookup} from './IFSCLookup';
import {KYCUploadModal} from './kyc-document-check/KYCUploadModal';
import {KYCExtractionResult} from './kyc-document-check/KYCExtractionResult';
import {KYCMismatchAlert} from './kyc-document-check/KYCMismatchAlert';
import {KYCManualReviewDrawer} from './kyc-document-check/KYCManualReviewDrawer';

type BeneficiaryType='sameBank'|'otherBank'|'upi';
type DocumentType='Aadhaar'|'PAN';

interface FormValues{
  type:BeneficiaryType;
  name:string;
  bank:string;
  accountNumber:string;
  confirmAccountNumber:string;
  ifsc:string;
  upiId:string;
  nickname:string;
  maxTransferLimit:string;
}

interface IFSCData{
  bankName:string;
  branch:string;
  address:string;
  ifsc:string;
}

interface SavedBeneficiary{
  id:string;
  name:string;
  bank:string;
  accountNumber:string;
  accountNumberFull?:string;
  ifsc?:string;
  upiId?:string;
  type:BeneficiaryType;
  nickname:string;
  status:'PENDING';
  avatarClass:string;
  maxTransferLimit:string;
}

interface KYCReview{
  id:string;
  beneficiaryName:string;
  documentType:DocumentType;
  reason:string;
  status:'PENDING';
  createdAt:string;
}

const STORAGE_KEY='neobank-beneficiaries';
const KYC_REVIEW_KEY='neobank-kyc-reviews';

const initialValues:FormValues={
  type:'sameBank',
  name:'',
  bank:'NeoBank',
  accountNumber:'',
  confirmAccountNumber:'',
  ifsc:'',
  upiId:'',
  nickname:'',
  maxTransferLimit:''
};

const validationSchema=Yup.object({
  type:Yup.string().required(),
  name:Yup.string().trim().required('Beneficiary name is required'),
  bank:Yup.string().when('type',{
    is:(type:BeneficiaryType)=>type==='otherBank',
    then:schema=>schema.required('Please select a bank'),
    otherwise:schema=>schema.notRequired()
  }),
  accountNumber:Yup.string().when('type',{
    is:(type:BeneficiaryType)=>type!=='upi',
    then:schema=>schema
      .required('Account number is required')
      .matches(/^\d+$/,'Account number must contain only numbers'),
    otherwise:schema=>schema.notRequired()
  }),
  confirmAccountNumber:Yup.string().when('type',{
    is:(type:BeneficiaryType)=>type!=='upi',
    then:schema=>schema
      .required('Please confirm account number')
      .oneOf([Yup.ref('accountNumber')],'Account numbers must match'),
    otherwise:schema=>schema.notRequired()
  }),
  ifsc:Yup.string().when('type',{
    is:'otherBank',
    then:schema=>schema
      .required('IFSC code is required')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,'Enter a valid IFSC code'),
    otherwise:schema=>schema.notRequired()
  }),
  upiId:Yup.string().when('type',{
    is:'upi',
    then:schema=>schema
      .required('UPI ID is required')
      .matches(/^[A-Za-z0-9._-]+@mockbank$/,'Enter a valid Mock UPI ID'),
    otherwise:schema=>schema.notRequired()
  }),
  maxTransferLimit:Yup.number()
    .typeError('Enter a valid transfer limit')
    .required('Maximum transfer limit is required')
    .positive('Transfer limit must be greater than 0')
});

export const AddBeneficiaryForm:React.FC=()=>{
  const navigate=useNavigate();

  const [lookupData,setLookupData]=useState<IFSCData|null>(null);
  const [pendingValues,setPendingValues]=useState<FormValues|null>(null);
  const [isKYCOpen,setIsKYCOpen]=useState(false);
  const [isExtractionOpen,setIsExtractionOpen]=useState(false);
  const [isMismatchOpen,setIsMismatchOpen]=useState(false);
  const [isReviewOpen,setIsReviewOpen]=useState(false);
  const [documentType,setDocumentType]=useState<DocumentType>('Aadhaar');
  const [fileName,setFileName]=useState('');
  const [documentName,setDocumentName]=useState('');
  const [formStatus,setFormStatus]=useState('');
  const [formError,setFormError]=useState('');

  const handleSubmit=(values:FormValues)=>{
    setPendingValues(values);
    setFormStatus('');
    setFormError('');
    setIsKYCOpen(true);
  };

  const saveBeneficiary=(values:FormValues):string|null=>{
    try{
      const existing:SavedBeneficiary[]=JSON.parse(
        localStorage.getItem(STORAGE_KEY)||'[]'
      );

      const accountNumber=values.accountNumber.trim();
      const ifsc=values.ifsc.trim().toUpperCase();
      const upiId=values.upiId.trim().toLowerCase();

      const duplicate=existing.some(beneficiary=>{
        if(values.type==='upi'){
          return beneficiary.type==='upi'&&
            beneficiary.upiId?.toLowerCase()===upiId;
        }

        if(
          beneficiary.type==='upi'||
          beneficiary.accountNumberFull!==accountNumber
        ){
          return false;
        }

        if(values.type==='sameBank'){
          return beneficiary.type==='sameBank';
        }

        return beneficiary.type==='otherBank'&&
          beneficiary.ifsc?.toUpperCase()===ifsc;
      });

      if(duplicate){
        return 'This beneficiary already exists. Please check the account number, IFSC, or UPI ID.';
      }

      const beneficiary:SavedBeneficiary={
        id:crypto.randomUUID(),
        name:values.name.trim(),
        bank:values.type==='upi'?'Mock UPI':values.bank,
        accountNumber:values.type==='upi'
          ?upiId
          :accountNumber.slice(-4),
        accountNumberFull:values.type==='upi'
          ?undefined
          :accountNumber,
        ifsc:values.type==='otherBank'?ifsc:undefined,
        upiId:values.type==='upi'?upiId:undefined,
        type:values.type,
        nickname:values.nickname.trim()||values.name.trim(),
        status:'PENDING',
        avatarClass:'bg-blue-600',
        maxTransferLimit:values.maxTransferLimit
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...existing,beneficiary])
      );

      return null;
    }catch{
      return 'Unable to save the beneficiary. Please try again.';
    }
  };

  const handleKYCUpload=(file:File,type:DocumentType)=>{
    setFileName(file.name);
    setDocumentType(type);
    setIsKYCOpen(false);
    setIsExtractionOpen(true);
    setDocumentName('');
  };

  const handleManualReview=(reason:string)=>{
    if(!pendingValues){
      setFormError('Beneficiary details are missing. Please try again.');
      setIsReviewOpen(false);
      return;
    }

    try{
      const reviews:KYCReview[]=JSON.parse(
        localStorage.getItem(KYC_REVIEW_KEY)||'[]'
      );

      const review:KYCReview={
        id:crypto.randomUUID(),
        beneficiaryName:pendingValues.name.trim(),
        documentType,
        reason:reason.trim(),
        status:'PENDING',
        createdAt:new Date().toISOString()
      };

      localStorage.setItem(
        KYC_REVIEW_KEY,
        JSON.stringify([...reviews,review])
      );

      const saveError=saveBeneficiary(pendingValues);

      if(saveError){
        setFormError(saveError);
        return;
      }

      setFormStatus(
        'Beneficiary saved with pending status. KYC manual review has been requested.'
      );
      setIsReviewOpen(false);
      setIsExtractionOpen(false);
      setIsMismatchOpen(false);
    }catch{
      setFormError('Unable to submit the KYC review request. Please try again.');
    }
  };

  const handleMismatchReview=()=>{
    setIsMismatchOpen(false);
    setIsReviewOpen(true);
  };

  const handleMismatchContinue=()=>{
    setIsMismatchOpen(false);
    setIsReviewOpen(true);
  };

  return(
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">
            Beneficiaries
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the people and accounts you send money to.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({values,isSubmitting,setFieldValue,status})=>(
            <Form className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Add a new beneficiary
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    New beneficiaries remain pending until security verification is completed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={()=>navigate('/beneficiaries')}
                  className="text-slate-500 hover:text-slate-900"
                  aria-label="Close form"
                >
                  <X size={22}/>
                </button>
              </div>

              <div className="mb-6 grid grid-cols-3 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={()=>{
                    setFieldValue('type','sameBank');
                    setFieldValue('bank','NeoBank');
                    setLookupData(null);
                  }}
                  className={`rounded-md px-4 py-2.5 text-sm font-medium ${
                    values.type==='sameBank'
                      ?'bg-white text-blue-600 shadow-sm'
                      :'text-slate-600'
                  }`}
                >
                  Same Bank
                </button>

                <button
                  type="button"
                  onClick={()=>{
                    setFieldValue('type','otherBank');
                    setFieldValue('bank','');
                    setLookupData(null);
                  }}
                  className={`rounded-md px-4 py-2.5 text-sm font-medium ${
                    values.type==='otherBank'
                      ?'bg-white text-blue-600 shadow-sm'
                      :'text-slate-600'
                  }`}
                >
                  Other Bank
                </button>

                <button
                  type="button"
                  onClick={()=>{
                    setFieldValue('type','upi');
                    setLookupData(null);
                  }}
                  className={`rounded-md px-4 py-2.5 text-sm font-medium ${
                    values.type==='upi'
                      ?'bg-white text-blue-600 shadow-sm'
                      :'text-slate-600'
                  }`}
                >
                  Mock UPI
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Beneficiary name
                  </label>
                  <Field
                    name="name"
                    placeholder="Full name"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                {values.type!=='upi'&&(
                  <>
                    {values.type==='otherBank'&&(
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">
                          Bank
                        </label>
                        <Field
                          as="select"
                          name="bank"
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                        >
                          <option value="">Select bank</option>
                          <option value="NeoBank">NeoBank</option>
                          <option value="State Bank">State Bank</option>
                          <option value="Horizon Bank">Horizon Bank</option>
                          <option value="Northstar Bank">Northstar Bank</option>
                        </Field>
                        <ErrorMessage
                          name="bank"
                          component="p"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Account number
                      </label>
                      <Field
                        name="accountNumber"
                        placeholder="Enter account number"
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="accountNumber"
                        component="p"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Confirm account number
                      </label>
                      <Field
                        name="confirmAccountNumber"
                        placeholder="Re-enter account number"
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="confirmAccountNumber"
                        component="p"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    {values.type==='otherBank'&&(
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">
                          IFSC code
                        </label>
                        <Field name="ifsc">
                          {({field}:{field:{
                            name:string;
                            value:string;
                            onBlur:(e:React.FocusEvent)=>void
                          }})=>(
                            <input
                              {...field}
                              value={field.value}
                              onChange={e=>{
                                setFieldValue('ifsc',e.target.value.toUpperCase());
                                setLookupData(null);
                              }}
                              placeholder="e.g. SBIN0001234"
                              maxLength={11}
                              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm uppercase outline-none placeholder:text-slate-400 focus:border-blue-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="ifsc"
                          component="p"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    )}

                    {values.type==='otherBank'&&(
                      <IFSCLookup
                        ifsc={values.ifsc}
                        onLookup={data=>{
                          setLookupData(data);
                          setFieldValue('bank',data.bankName);
                        }}
                      />
                    )}
                  </>
                )}

                {values.type==='upi'&&(
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-800">
                      Mock UPI ID
                    </label>
                    <Field
                      name="upiId"
                      placeholder="user@mockbank"
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="upiId"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Nickname
                  </label>
                  <Field
                    name="nickname"
                    placeholder="e.g. Rahul"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Maximum transfer limit
                  </label>
                  <Field
                    name="maxTransferLimit"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="maxTransferLimit"
                    component="p"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>
              </div>

              {lookupData&&values.type==='otherBank'&&(
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Bank</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {lookupData.bankName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Branch</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {lookupData.branch}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {lookupData.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={22} className="mt-0.5 text-blue-600"/>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      KYC document check
                    </p>
                    <p className="mt-1 text-sm text-blue-800">
                      Upload an Aadhaar or PAN document to request KYC review before completing beneficiary onboarding.
                    </p>
                  </div>
                  <FileText size={20} className="text-blue-600"/>
                </div>
              </div>

              {status&&(
                <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {status}
                </p>
              )}

              {formError&&(
                <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </p>
              )}

              {formStatus&&(
                <div role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  {formStatus}
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={()=>navigate('/beneficiaries')}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  Verify & add beneficiary
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <KYCUploadModal
        isOpen={isKYCOpen}
        onClose={()=>setIsKYCOpen(false)}
        onContinue={handleKYCUpload}
      />

      {isExtractionOpen&&(
        <KYCExtractionResult
          documentType={documentType}
          fileName={fileName}
          extractedName=""
          extractedDOB=""
          extractedID=""
          status="review"
          onReview={()=>{
            setIsExtractionOpen(false);
            setIsReviewOpen(true);
          }}
          onContinue={()=>{
            setIsExtractionOpen(false);
            setIsReviewOpen(true);
          }}
        />
      )}

      <KYCMismatchAlert
        isOpen={isMismatchOpen}
        documentName={documentName}
        beneficiaryName={pendingValues?.name||''}
        onClose={()=>setIsMismatchOpen(false)}
        onContinue={handleMismatchContinue}
        onReview={handleMismatchReview}
      />

      <KYCManualReviewDrawer
        isOpen={isReviewOpen}
        beneficiaryName={pendingValues?.name||''}
        documentType={documentType}
        onClose={()=>setIsReviewOpen(false)}
        onSubmit={handleManualReview}
      />
    </div>
  );
};
