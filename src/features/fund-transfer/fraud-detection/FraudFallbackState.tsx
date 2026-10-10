import { LockKeyhole } from 'lucide-react';

export const FraudFallbackState = ({ compact = false }: { compact?: boolean }) => (
  <div className={`flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}>
    <LockKeyhole size={15} className="mt-0.5 shrink-0 text-slate-500"/><p className="text-[11px] leading-5">Safety checks run locally in this demo using sample rules. No payment is sent to a bank.</p>
  </div>
);
