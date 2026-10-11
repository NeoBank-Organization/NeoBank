import { Banknote, Check, Clock3, Smartphone } from 'lucide-react';
import { transferBeneficiaries } from './transferData';
import type { TransferRail, TransferType } from './transfer.types';

interface Props { transferType: Extract<TransferType, 'beneficiary' | 'upi'>; destinationId: string; rail: TransferRail; onDestinationChange: (id: string) => void; onRailChange: (rail: TransferRail) => void; error?: string; }
const rails: { id: TransferRail; name: string; detail: string }[] = [
  { id: 'IMPS', name: 'IMPS', detail: 'Instant · up to ₹5 lakh' },
  { id: 'NEFT', name: 'NEFT', detail: 'Usually within 30 min' },
  { id: 'RTGS', name: 'RTGS', detail: 'Instant · min ₹2 lakh' },
];

export const OtherBankTransfer = ({ transferType, destinationId, rail, onDestinationChange, onRailChange, error }: Props) => {
  if (transferType === 'upi') return (
    <div>
      <div className="mb-4"><h2 className="text-sm font-semibold text-slate-900">Who are you paying?</h2><p className="mt-1 text-xs text-slate-500">Enter the recipient’s UPI ID to make an instant payment.</p></div>
      <label className="block max-w-xl"><span className="mb-2 block text-xs font-semibold text-slate-600">Recipient UPI ID</span><span className={`flex h-[54px] items-center gap-3 rounded-xl border px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 ${error ? 'border-rose-400' : 'border-slate-200'}`}><Smartphone size={18} className="text-slate-400"/><input value={destinationId} onChange={(event) => onDestinationChange(event.target.value.trim())} placeholder="name@bank" autoComplete="off" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"/></span>{error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}</label>
      <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"><Check size={14}/> UPI payments are processed instantly</div>
    </div>
  );

  return (
    <div>
      <div className="mb-4"><h2 className="text-sm font-semibold text-slate-900">Who are you sending money to?</h2><p className="mt-1 text-xs text-slate-500">Only active beneficiaries are available for transfer.</p></div>
      <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-600">Saved beneficiary</span><select value={destinationId} onChange={(event) => onDestinationChange(event.target.value)} className={`h-[54px] w-full rounded-xl border bg-white px-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${error ? 'border-rose-400' : 'border-slate-200'}`}><option value="">Choose a beneficiary</option>{transferBeneficiaries.map((beneficiary) => <option key={beneficiary.id} value={beneficiary.id} disabled={beneficiary.status !== 'ACTIVE'}>{beneficiary.nickname} · {beneficiary.bank} ···· {beneficiary.accountLast4}{beneficiary.status !== 'ACTIVE' ? ` (${beneficiary.status.toLowerCase()})` : ''}</option>)}</select>{error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}</label>
      {destinationId && (() => { const beneficiary = transferBeneficiaries.find((item) => item.id === destinationId); return beneficiary ? <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">{beneficiary.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800">{beneficiary.name}</span><span className="mt-0.5 block text-xs text-slate-500">{beneficiary.bank} ···· {beneficiary.accountLast4} · {beneficiary.ifsc}</span></span><Check size={17} className="text-emerald-600"/></div> : null; })()}
      <div className="mt-5"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600"><Banknote size={15}/> Transfer method</div><div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{rails.map((item) => <button key={item.id} type="button" onClick={() => onRailChange(item.id)} aria-pressed={rail === item.id} className={`rounded-xl border px-3 py-3 text-left transition ${rail === item.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}><span className="block text-sm font-semibold text-slate-800">{item.name}</span><span className="mt-1 block text-[11px] text-slate-500">{item.detail}</span></button>)}</div></div>
      <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-slate-500"><Clock3 size={14} className="mt-0.5 shrink-0"/>New beneficiaries have a 30-hour safety activation period. Transfers are available after activation.</div>
    </div>
  );
};
