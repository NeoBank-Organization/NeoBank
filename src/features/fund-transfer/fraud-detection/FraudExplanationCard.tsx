import { Info, CheckCircle2 } from 'lucide-react';
import type { RiskLevel } from '../transfer.types';

export const FraudExplanationCard = ({ level, factors }: { level: RiskLevel; factors: string[] }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"><Info size={16}/></span><div><h3 className="text-xs font-semibold text-slate-800">Transfer safety check</h3><p className="mt-1 text-[11px] leading-5 text-slate-500">{level === 'LOW' ? 'This transfer matches your usual activity.' : level === 'MEDIUM' ? 'A few details need an extra look before you send.' : 'This transfer needs a quick identity check to help keep your account safe.'}</p></div></div>
    {factors.length > 0 && <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">{factors.map((factor) => <li key={factor} className="flex items-start gap-2 text-[11px] text-slate-600"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-slate-400"/>{factor}</li>)}</ul>}
  </div>
);
