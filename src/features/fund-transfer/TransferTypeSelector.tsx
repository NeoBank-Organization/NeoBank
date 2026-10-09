import { ArrowLeftRight, Building2, WalletCards } from 'lucide-react';
import type { TransferType } from './transfer.types';

const options: { id: TransferType; title: string; subtitle: string; icon: typeof ArrowLeftRight }[] = [
  { id: 'own', title: 'My accounts', subtitle: 'Move money between your accounts', icon: ArrowLeftRight },
  { id: 'beneficiary', title: 'Bank account', subtitle: 'Send to a saved beneficiary', icon: Building2 },
  { id: 'upi', title: 'UPI ID', subtitle: 'Pay instantly using a UPI ID', icon: WalletCards },
];

interface Props { value: TransferType; onChange: (value: TransferType) => void; }

export const TransferTypeSelector = ({ value, onChange }: Props) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="group" aria-label="Transfer type">
    {options.map(({ id, title, subtitle, icon: Icon }) => {
      const active = value === id;
      return (
        <button key={id} type="button" onClick={() => onChange(id)} aria-pressed={active}
          className={`flex min-h-[88px] items-center gap-3 rounded-xl border p-4 text-left transition ${active ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'}`}>
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Icon size={19}/></span>
          <span className="min-w-0"><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-4 text-slate-500">{subtitle}</span></span>
        </button>
      );
    })}
  </div>
);
