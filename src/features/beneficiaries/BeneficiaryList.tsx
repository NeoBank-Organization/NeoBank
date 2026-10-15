/**
 * ============================================================================
 * COMPONENT: BeneficiaryList.tsx
 * DESCRIPTION: List of saved beneficiaries showing active, pending activation, and cooling period states.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R03 - Poorvika N
 * EMAIL: poorvipoorvikan@gmail.com
 * ROLE: Beneficiary feature owner
 * PRD REQUIREMENTS: BNK-FR-02 (Beneficiaries), BNK-AI-04 (KYC Document Check)
 * SPRINT DELIVERABLES: Sprint 1 (S1-08, S1-09, S1-10, S1-11) & Sprint 2 (S2-09, S2-10, S2-11)
 * PRIMARY RESPONSIBILITIES: Beneficiary list, add form, IFSC lookup/autosuggest, activation states, KYC document check
 * ============================================================================
 */

import React,{useMemo,useState} from 'react';
import {Plus,Search,X,Building2,CreditCard,ArrowUpRight} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {BeneficiaryCard,Beneficiary} from './BeneficiaryCard';

const STORAGE_KEY='neobank-beneficiaries';

interface SavedBeneficiary extends Beneficiary{
  type:'sameBank'|'otherBank'|'upi';
  accountNumberFull?:string;
  ifsc?:string;
  upiId?:string;
  maxTransferLimit:string;
}

const mockBeneficiaries:Beneficiary[]=[
  {
    id:'1',
    name:'Priya Sharma',
    bank:'Northstar Bank',
    accountNumber:'9044',
    nickname:'Priya',
    status:'ACTIVE',
    avatarClass:'bg-blue-600'
  },
  {
    id:'2',
    name:'Rohan Properties',
    bank:'Horizon Bank',
    accountNumber:'1182',
    nickname:'Rohan',
    status:'ACTIVE',
    avatarClass:'bg-violet-600'
  },
  {
    id:'3',
    name:'Aarav Mehta',
    bank:'NeoBank',
    accountNumber:'6730',
    nickname:'Aarav',
    status:'PENDING',
    activationTime:new Date(Date.now()+10*60*1000+41*1000).toISOString(),
    avatarClass:'bg-teal-600'
  },
  {
    id:'4',
    name:'Sanya Kapoor',
    bank:'Union Trust',
    accountNumber:'2219',
    nickname:'Sanya',
    status:'INACTIVE',
    avatarClass:'bg-rose-500'
  }
];

export const BeneficiaryList:React.FC=()=>{
  const navigate=useNavigate();
  const [search,setSearch]=useState('');
  const [status,setStatus]=useState('ALL');
  const [selectedBeneficiary,setSelectedBeneficiary]=useState<SavedBeneficiary|null>(null);

  const [savedBeneficiaries]=useState<SavedBeneficiary[]>(()=>{
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    }catch{
      return [];
    }
  });

  const filteredBeneficiaries=useMemo(()=>{
    const beneficiaries=[...mockBeneficiaries,...savedBeneficiaries];

    return beneficiaries.filter(beneficiary=>{
      const value=search.toLowerCase();
      const matchesSearch=
        beneficiary.name.toLowerCase().includes(value)||
        beneficiary.nickname.toLowerCase().includes(value)||
        beneficiary.bank.toLowerCase().includes(value)||
        ('upiId' in beneficiary&&typeof beneficiary.upiId==='string'&&beneficiary.upiId.toLowerCase().includes(value));

      const matchesStatus=status==='ALL'||beneficiary.status===status;

      return matchesSearch&&matchesStatus;
    });
  },[search,status,savedBeneficiaries]);

  const getInitials=(name:string)=>name.split(' ').map(word=>word.charAt(0)).join('').slice(0,2).toUpperCase();

  const getAccount=(beneficiary:Beneficiary)=>{
    const saved=beneficiary as SavedBeneficiary;
    const accountNumber=saved.accountNumberFull||beneficiary.accountNumber;

    return accountNumber?`•••• ${accountNumber.slice(-4)}`:beneficiary.upiId||'Not available';
  };

  return(
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto w-full max-w-[848px]">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">PAYEES</p>
            <h1 className="text-3xl font-medium text-slate-900">Beneficiaries</h1>
            <p className="mt-2 text-sm text-slate-500">Manage the people and accounts you send money to.</p>
          </div>

          <button type="button" onClick={()=>navigate('/beneficiaries/add')} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            <Plus size={18}/>
            Add beneficiary
          </button>
        </div>

        <div className="mb-5 flex h-[68px] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search beneficiaries" className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"/>
          </div>

          <select value={status} onChange={e=>setStatus(e.target.value)} className="h-11 w-[145px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {filteredBeneficiaries.length===0?(
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-slate-800">No beneficiaries found</h2>
            <p className="mt-1 text-sm text-slate-500">Try changing your search or status filter.</p>
          </div>
        ):(
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredBeneficiaries.map(beneficiary=>(
              <BeneficiaryCard
                key={beneficiary.id}
                beneficiary={beneficiary}
                onView={()=>setSelectedBeneficiary(beneficiary as SavedBeneficiary)}
                onPay={()=>navigate('/transfers')}
              />
            ))}
          </div>
        )}
      </div>

      {selectedBeneficiary&&(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={event=>{
            if(event.target===event.currentTarget)setSelectedBeneficiary(null);
          }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="beneficiary-modal-title" className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 id="beneficiary-modal-title" className="text-xl font-semibold text-slate-900">Beneficiary Details</h2>
                <p className="mt-1 text-sm text-slate-500">Your saved beneficiary information</p>
              </div>

              <button type="button" aria-label="Close details" onClick={()=>setSelectedBeneficiary(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={20}/>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${selectedBeneficiary.avatarClass||'bg-blue-500'}`}>
                  {getInitials(selectedBeneficiary.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-900">{selectedBeneficiary.name}</h3>
                  <p className="text-sm text-slate-500">{selectedBeneficiary.nickname}</p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedBeneficiary.status==='ACTIVE'?'bg-green-100 text-green-700':selectedBeneficiary.status==='PENDING'?'bg-amber-100 text-amber-700':'bg-slate-100 text-slate-600'}`}>
                  {selectedBeneficiary.status}
                </span>
              </div>

              <div className="mt-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Bank Details</h4>

                <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 size={16}/>
                    <span>Bank Name</span>
                    <span className="ml-auto max-w-[60%] truncate text-right font-medium text-slate-800">{selectedBeneficiary.bank}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CreditCard size={16}/>
                    <span>{selectedBeneficiary.upiId?'UPI ID':'Account Number'}</span>
                    <span className="ml-auto max-w-[60%] break-all text-right font-medium text-slate-800">
                      {selectedBeneficiary.upiId||getAccount(selectedBeneficiary)}
                    </span>
                  </div>

                  {(selectedBeneficiary as SavedBeneficiary).ifsc&&(
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">IFSC Code</span>
                      <span className="font-medium text-slate-800">{(selectedBeneficiary as SavedBeneficiary).ifsc}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">Beneficiary ID</span>
                    <span className="font-medium text-slate-800">{selectedBeneficiary.id}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Transfer Information</h4>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">Maximum Transfer Limit</span>
                    <span className="font-semibold text-slate-800">
                      {(selectedBeneficiary as SavedBeneficiary).maxTransferLimit||'Not available'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">Transfer Availability</span>
                    <span className={`font-medium ${selectedBeneficiary.status==='ACTIVE'?'text-green-700':'text-amber-700'}`}>
                      {selectedBeneficiary.status==='ACTIVE'?'Available':selectedBeneficiary.status==='PENDING'?'Pending activation':'Unavailable'}
                    </span>
                  </div>

                  {selectedBeneficiary.activationTime&&(
                    <p className="mt-3 text-xs text-slate-500">
                      Activation time: {new Date(selectedBeneficiary.activationTime).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={()=>setSelectedBeneficiary(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Close
              </button>

              <button
                type="button"
                disabled={selectedBeneficiary.status!=='ACTIVE'}
                onClick={()=>{
                  setSelectedBeneficiary(null);
                  navigate('/transfers');
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200"
              >
                Pay Now
                <ArrowUpRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};