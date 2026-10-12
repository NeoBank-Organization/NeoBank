import { Clock3, ShieldCheck } from 'lucide-react';
import type { TransferType, TransferRail } from './transfer.types';
import { formatINR } from './transferData';

interface Props { amount: number; rail: TransferRail; transferType: TransferType; source: string; recipient: string; }

export const TransactionSummary = ({ amount, rail, transferType, source, recipient }: Props) => {
  const fee = transferType === 'own' || transferType === 'upi' || rail === 'IMPS' ? 0 : rail === 'NEFT' ? 2.5 : 15;
  const delivery = transferType === 'own' || transferType === 'upi' || rail === 'IMPS' || rail === 'RTGS' ? 'Instant' : 'Within 30 minutes';
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-900">Transfer summary</h2><ShieldCheck size={18} className="text-emerald-600"/></div>
      <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">You’re sending</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{formatINR(amount || 0)}</p></div>
      <dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between gap-4"><dt className="text-slate-500">From</dt><dd className="max-w-[60%] truncate text-right font-medium text-slate-700">{source || 'Select account'}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">To</dt><dd className="max-w-[60%] truncate text-right font-medium text-slate-700">{recipient || 'Choose recipient'}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Transfer method</dt><dd className="font-medium text-slate-700">{transferType === 'own' ? 'Own account' : transferType === 'upi' ? 'UPI · Instant' : rail}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Transfer fee</dt><dd className="font-medium text-slate-700">{fee ? formatINR(fee) : 'Free'}</dd></div><div className="border-t border-slate-200 pt-3"><div className="flex justify-between"><dt className="font-semibold text-slate-700">Total debit</dt><dd className="font-bold text-slate-900">{formatINR((amount || 0) + fee)}</dd></div></div></dl>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-800"><Clock3 size={14}/><span>Expected delivery: <strong>{delivery}</strong></span></div>
      <p className="mt-4 text-[11px] leading-5 text-slate-500">By continuing, you confirm the recipient details are correct. Transfers may not be reversible once processed.</p>
    </aside>
  );
};
