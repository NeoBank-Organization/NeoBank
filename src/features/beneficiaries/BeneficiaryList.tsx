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
import {Plus,Search} from 'lucide-react';
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
                onView={()=>console.log('View beneficiary',beneficiary.id)}
                onPay={()=>console.log('Pay beneficiary',beneficiary.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};