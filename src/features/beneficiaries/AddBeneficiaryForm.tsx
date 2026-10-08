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
import {X} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {IFSCLookup} from './IFSCLookup';

type BeneficiaryType='sameBank'|'otherBank'|'upi';

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
  name:Yup.string().required('Beneficiary name is required'),
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

  return(
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">Beneficiaries</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the people and accounts you send money to.</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values=>{
            console.log(values);
          }}
        >
          {({values,isSubmitting,setFieldValue})=>(
            <Form className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Add a new beneficiary</h2>
                  <p className="mt-1 text-sm text-slate-500">New beneficiaries are activated after security verification.</p>
                </div>
                <button
                  type="button"
                  onClick={()=>navigate('/beneficiaries')}
                  className="text-slate-500 hover:text-slate-900"
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
                  className={`rounded-md px-4 py-2.5 text-sm font-medium ${values.type==='sameBank'?'bg-white text-blue-600 shadow-sm':'text-slate-600'}`}
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
                  className={`rounded-md px-4 py-2.5 text-sm font-medium ${values.type==='otherBank'?'bg-white text-blue-600 shadow-sm':'text-slate-600'}`}
                >
                  Other Bank
                </button>
                <button
                  type="button"
                  onClick={()=>{
                    setFieldValue('type','upi');
                    setLookupData(null);
                  }}
                  className={`rounded-md px-4 py-2.5 text-sm font-medium ${values.type==='upi'?'bg-white text-blue-600 shadow-sm':'text-slate-600'}`}
                >
                  Mock UPI
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">Beneficiary name</label>
                  <Field
                    name="name"
                    placeholder="Full name"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <ErrorMessage name="name" component="p" className="mt-1 text-xs text-red-500"/>
                </div>

                {values.type!=='upi'&&(
                  <>
                    {values.type==='otherBank'&&(
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Bank</label>
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
                        <ErrorMessage name="bank" component="p" className="mt-1 text-xs text-red-500"/>
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">Account number</label>
                      <Field
                        name="accountNumber"
                        placeholder="Enter account number"
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                      />
                      <ErrorMessage name="accountNumber" component="p" className="mt-1 text-xs text-red-500"/>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">Confirm account number</label>
                      <Field
                        name="confirmAccountNumber"
                        placeholder="Re-enter account number"
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                      />
                      <ErrorMessage name="confirmAccountNumber" component="p" className="mt-1 text-xs text-red-500"/>
                    </div>

                    {values.type==='otherBank'&&(
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">IFSC code</label>
                        <Field name="ifsc">
                          {({field}:{field:{name:string;value:string;onBlur:(e:React.FocusEvent)=>void}})=>(
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
                        <ErrorMessage name="ifsc" component="p" className="mt-1 text-xs text-red-500"/>
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
                    <label className="mb-2 block text-sm font-medium text-slate-800">Mock UPI ID</label>
                    <Field
                      name="upiId"
                      placeholder="user@mockbank"
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                    />
                    <ErrorMessage name="upiId" component="p" className="mt-1 text-xs text-red-500"/>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">Nickname</label>
                  <Field
                    name="nickname"
                    placeholder="e.g. Rahul"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">Maximum transfer limit</label>
                  <Field
                    name="maxTransferLimit"
                    type="number"
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <ErrorMessage name="maxTransferLimit" component="p" className="mt-1 text-xs text-red-500"/>
                </div>
              </div>

              {lookupData&&values.type==='otherBank'&&(
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Bank</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{lookupData.bankName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Branch</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{lookupData.branch}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{lookupData.address}</p>
                    </div>
                  </div>
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
    </div>
  );
};