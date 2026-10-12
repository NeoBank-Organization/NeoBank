import { ArrowDownUp, Wallet } from 'lucide-react';
import type { AccountSummary } from '../../types/account.types';
import { formatINR } from './transferData';

interface Props { accounts: AccountSummary[]; sourceId: string; destinationId: string; onSourceChange: (id: string) => void; onDestinationChange: (id: string) => void; sourceError?: string; destinationError?: string; }

const AccountSelect = ({ label, accounts, value, onChange, error }: { label: string; accounts: AccountSummary[]; value: string; onChange: (id: string) => void; error?: string }) => (
  <label className="block min-w-0 flex-1">
    <span className="mb-2 block text-xs font-semibold text-slate-600">{label}</span>
    <span className="relative block">
      <Wallet size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`h-[58px] w-full appearance-none rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${error ? 'border-rose-400' : 'border-slate-200'}`}>
        <option value="">Select an account</option>
        {accounts.map((account) => <option key={account.accountId} value={account.accountId}>{account.accountName} ···· {account.accountNumber.slice(-4)}</option>)}
      </select>
    </span>
    {value && <span className="mt-2 block text-xs text-slate-500">Available balance: {formatINR(accounts.find((item) => item.accountId === value)?.availableBalance ?? 0)}</span>}
    {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
  </label>
);

export const OwnAccountTransfer = ({ accounts, sourceId, destinationId, onSourceChange, onDestinationChange, sourceError, destinationError }: Props) => (
  <div>
    <div className="mb-4"><h2 className="text-sm font-semibold text-slate-900">Move money between your accounts</h2><p className="mt-1 text-xs text-slate-500">Transfers between your NeoBank accounts are free and instant.</p></div>
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <AccountSelect label="From account" accounts={accounts} value={sourceId} onChange={onSourceChange} error={sourceError}/>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 sm:mt-5"><ArrowDownUp size={16}/></span>
      <AccountSelect label="To account" accounts={accounts} value={destinationId} onChange={onDestinationChange} error={destinationError}/>
    </div>
  </div>
);
