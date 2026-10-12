import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface Props { open: boolean; onContinue: () => void; onCancel: () => void; }

export const FraudHoldModal = ({ open, onContinue, onCancel }: Props) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  if (!open) return null;

  const verify = () => {
    if (code !== '246810') { setError('That code does not match. Please try again.'); return; }
    setError(''); setCode(''); onContinue();
  };

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="risk-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600"><ShieldAlert size={22}/></div><button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18}/></button></div>
      <h2 id="risk-title" className="mt-4 text-lg font-bold text-slate-900">One quick security check</h2><p className="mt-2 text-sm leading-6 text-slate-600">This transfer is higher than your usual activity. Verify with the demo code to continue.</p>
      <label className="mt-5 block"><span className="mb-2 block text-xs font-semibold text-slate-600">6-digit verification code</span><input autoFocus inputMode="numeric" maxLength={6} value={code} onChange={(event) => { setCode(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} placeholder="Enter code" className="h-12 w-full rounded-xl border border-slate-200 px-4 text-center text-lg tracking-[0.35em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/></label>
      <p className="mt-2 text-[11px] text-slate-500">Demo verification code: <strong className="font-semibold text-slate-700">246810</strong></p>{error && <p role="alert" className="mt-2 text-xs text-rose-600">{error}</p>}
      <div className="mt-5 flex gap-3"><button type="button" onClick={onCancel} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">Go back</button><button type="button" onClick={verify} disabled={code.length !== 6} className="h-11 flex-1 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">Verify & continue</button></div>
    </section>
  </div>;
};
