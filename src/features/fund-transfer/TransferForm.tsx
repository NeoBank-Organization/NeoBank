import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowRight, BadgeCheck, Check, ChevronRight, Clock3, FileText, Plus, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { accountsMock } from '../../data/accountsMock';
import { FraudExplanationCard } from './fraud-detection/FraudExplanationCard';
import { FraudFallbackState } from './fraud-detection/FraudFallbackState';
import { FraudHoldModal } from './fraud-detection/FraudHoldModal';
import { FraudRiskIndicator } from './fraud-detection/FraudRiskIndicator';
import { OtherBankTransfer } from './OtherBankTransfer';
import { OwnAccountTransfer } from './OwnAccountTransfer';
import { TransactionSummary } from './TransactionSummary';
import { TransferTypeSelector } from './TransferTypeSelector';
import { transferBeneficiaries, recentTransfers as initialRecentTransfers, formatINR, transferLimits } from './transferData';
import { validateTransfer } from './TransferValidation';
import type { RiskLevel, TransferDraft, TransferError, TransferRail, TransferReceipt, TransferType } from './transfer.types';

const initialDraft: TransferDraft = { transferType: 'beneficiary', sourceAccountId: 'ACC-1001', destinationId: '', rail: 'IMPS', amount: '', note: '' };
const bankAccounts = accountsMock.filter((account) => account.accountStatus === 'ACTIVE' && account.accountType !== 'FD');
const money = (amount: number) => formatINR(amount);

export const TransferForm = () => {
  const [draft, setDraft] = useState<TransferDraft>(initialDraft);
  const [errors, setErrors] = useState<TransferError[]>([]);
  const [review, setReview] = useState(false);
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null);
  const [holdOpen, setHoldOpen] = useState(false);
  const [recent, setRecent] = useState(initialRecentTransfers);
  const [transferredToday, setTransferredToday] = useState(63_000);

  const amount = Number(draft.amount) || 0;
  const source = bankAccounts.find((account) => account.accountId === draft.sourceAccountId);
  const beneficiary = transferBeneficiaries.find((item) => item.id === draft.destinationId);
  const recipientName = draft.transferType === 'own'
    ? bankAccounts.find((account) => account.accountId === draft.destinationId)?.accountName ?? ''
    : draft.transferType === 'upi' ? draft.destinationId : beneficiary?.name ?? '';
  const recipientDetails = draft.transferType === 'own'
    ? bankAccounts.find((account) => account.accountId === draft.destinationId)?.accountNumber.slice(-4) ?? ''
    : draft.transferType === 'upi' ? 'UPI payment' : `${beneficiary?.bank ?? ''} ···· ${beneficiary?.accountLast4 ?? ''}`;
  const errorFor = (field: keyof TransferDraft) => errors.find((error) => error.field === field)?.message;

  const risk = useMemo(() => {
    const factors: string[] = [];
    let score = 12;
    if (draft.transferType === 'beneficiary' && beneficiary && beneficiary.bank !== 'NeoBank') { score += 18; factors.push('Recipient bank is outside NeoBank.'); }
    if (amount >= 50_000) { score += 20; factors.push('Amount is above your usual transfer size.'); }
    if (amount >= 200_000) { score += 30; factors.push('Large value transfer requires stronger verification.'); }
    if (draft.transferType === 'upi') factors.push('UPI recipient will be checked before payment.');
    if (draft.transferType === 'own') { score = 5; factors.push('Both accounts belong to you.'); }
    score = Math.min(score, 95);
    const level: RiskLevel = score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';
    return { score, level, factors };
  }, [amount, beneficiary, draft.transferType]);

  const update = <K extends keyof TransferDraft>(field: K, value: TransferDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => current.filter((error) => error.field !== field));
  };

  const setTransferType = (type: TransferType) => {
    setDraft((current) => ({ ...current, transferType: type, destinationId: '', rail: type === 'upi' ? 'IMPS' : current.rail }));
    setErrors([]);
    setReview(false);
  };

  const startReview = () => {
    const nextErrors = validateTransfer(draft, bankAccounts);
    setErrors(nextErrors);
    if (nextErrors.length === 0) setReview(true);
  };

  const finishTransfer = () => {
    const ref = `NEO${Date.now().toString().slice(-10)}`;
    const rail = draft.transferType === 'own' ? 'OWN ACCOUNT' : draft.rail;
    const completedAt = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
    setReceipt({ reference: ref, amount, recipient: recipientName, completedAt, rail });
    setTransferredToday((current) => current + amount);
    setRecent((current) => [{ name: recipientName, detail: recipientDetails, amount, date: 'Just now', status: 'Success' }, ...current].slice(0, 4));
    setHoldOpen(false);
    setReview(false);
  };

  const confirmTransfer = () => {
    if (risk.level === 'HIGH') setHoldOpen(true);
    else finishTransfer();
  };

  const resetTransfer = () => { setDraft(initialDraft); setErrors([]); setReview(false); setReceipt(null); };

  const progress = Math.min((transferredToday / transferLimits.daily) * 100, 100);

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-blue-600"/> Payments</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Fund transfer</h1>
          <p className="mt-1.5 text-sm text-slate-500">Send money securely to your accounts or someone new.</p>
        </div>
        <a href="/transfers/scheduled" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"><Clock3 size={15}/> Scheduled transfers <ChevronRight size={14}/></a>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.45fr_0.8fr]">
        <section className="rounded-2xl bg-gradient-to-br from-[#0d3268] via-[#124b97] to-[#1b68ce] p-5 text-white shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium text-blue-100">Your primary account</p><p className="mt-1 text-sm font-semibold">{bankAccounts[0]?.accountName}</p><p className="mt-0.5 text-xs text-blue-100/80">Savings ···· {bankAccounts[0]?.accountNumber.slice(-4)}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Wallet size={20}/></span></div>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] text-blue-100">Available balance</p><p className="mt-1 text-2xl font-bold tracking-tight">{money(bankAccounts[0]?.availableBalance ?? 0)}</p></div><a href="/accounts" className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white">View account <ArrowRight size={14}/></a></div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-xs font-medium text-slate-500">Daily transfer limit</p><p className="mt-1 text-lg font-bold text-slate-900">{money(Math.max(transferLimits.daily - transferredToday, 0))}<span className="ml-1 text-xs font-medium text-slate-400">left</span></p></div><span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><ShieldCheck size={18}/></span></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }}/></div>
          <p className="mt-2 flex justify-between text-[10px] text-slate-400"><span>Used today {money(transferredToday)}</span><span>Limit {money(transferLimits.daily)}</span></p>
        </section>
      </div>

      {receipt ? (
        <section className="mx-auto max-w-2xl rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><BadgeCheck size={34}/></div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-emerald-700">Transfer successful</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{money(receipt.amount)}</h2>
          <p className="mt-2 text-sm text-slate-600">Sent to <strong className="font-semibold text-slate-800">{receipt.recipient}</strong></p>
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-slate-50 p-4 text-left"><div className="flex justify-between gap-4 border-b border-slate-200 pb-3 text-xs"><span className="text-slate-500">Reference number</span><span className="font-mono font-semibold text-slate-800">{receipt.reference}</span></div><div className="mt-3 flex justify-between gap-4 text-xs"><span className="text-slate-500">Date & time</span><span className="font-medium text-slate-700">{receipt.completedAt}</span></div><div className="mt-3 flex justify-between gap-4 text-xs"><span className="text-slate-500">Method</span><span className="font-medium text-slate-700">{receipt.rail}</span></div></div>
          <div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={resetTransfer} className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16}/> New transfer</button><button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FileText size={16}/> Print receipt</button></div>
          <p className="mt-5 text-[11px] text-slate-400">Demo only: no money has been moved between bank accounts.</p>
        </section>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2 text-[11px] font-medium text-slate-400"><span className={`grid h-6 w-6 place-items-center rounded-full ${!review ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{review ? <Check size={13}/> : '1'}</span><span className={review ? 'text-slate-400' : 'text-slate-700'}>Transfer details</span><span className="mx-1 h-px w-8 bg-slate-200"/><span className={`grid h-6 w-6 place-items-center rounded-full ${review ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</span><span className={review ? 'text-slate-700' : ''}>Review</span></div>
          {!review ? (
            <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4"><h2 className="text-sm font-bold text-slate-900">Choose transfer type</h2><p className="mt-1 text-xs text-slate-500">How would you like to send money?</p></div>
                <TransferTypeSelector value={draft.transferType} onChange={setTransferType}/>
                <div className="my-6 border-t border-slate-100"/>
                {draft.transferType === 'own' ? <OwnAccountTransfer accounts={bankAccounts} sourceId={draft.sourceAccountId} destinationId={draft.destinationId} onSourceChange={(id) => update('sourceAccountId', id)} onDestinationChange={(id) => update('destinationId', id)} sourceError={errorFor('sourceAccountId')} destinationError={errorFor('destinationId')}/> : <OtherBankTransfer transferType={draft.transferType} destinationId={draft.destinationId} rail={draft.rail} onDestinationChange={(id) => update('destinationId', id)} onRailChange={(rail: TransferRail) => update('rail', rail)} error={errorFor('destinationId')}/>}
                {draft.transferType !== 'own' && <div className="mt-5"><label className="mb-2 block text-xs font-semibold text-slate-600" htmlFor="source-account">Pay from</label><select id="source-account" value={draft.sourceAccountId} onChange={(event) => update('sourceAccountId', event.target.value)} className="h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{bankAccounts.map((account) => <option key={account.accountId} value={account.accountId}>{account.accountName} ···· {account.accountNumber.slice(-4)} — {money(account.availableBalance)} available</option>)}</select>{errorFor('sourceAccountId') && <p className="mt-1 text-xs text-rose-600">{errorFor('sourceAccountId')}</p>}</div>}

                <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-xs font-semibold text-slate-600">Amount</span><span className={`flex h-[52px] items-center gap-2 rounded-xl border px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 ${errorFor('amount') ? 'border-rose-400' : 'border-slate-200'}`}><span className="text-sm font-semibold text-slate-400">₹</span><input inputMode="decimal" value={draft.amount} onChange={(event) => update('amount', event.target.value.replace(/[^\d.]/g, ''))} placeholder="0.00" className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-300"/></span>{errorFor('amount') && <span className="mt-1 block text-xs text-rose-600">{errorFor('amount')}</span>}<span className="mt-1.5 block text-[10px] text-slate-400">Up to ₹5,00,000 per day</span></label><label className="block"><span className="mb-2 block text-xs font-semibold text-slate-600">Note <span className="font-normal text-slate-400">(optional)</span></span><input maxLength={60} value={draft.note} onChange={(event) => update('note', event.target.value)} placeholder="e.g. Monthly rent" className="h-[52px] w-full rounded-xl border border-slate-200 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/><span className="mt-1.5 block text-right text-[10px] text-slate-400">{draft.note.length}/60</span></label></div>

                <div className="mt-5"><FraudRiskIndicator level={risk.level} score={risk.score}/></div>
                <button type="button" onClick={startReview} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100">Review transfer <ArrowRight size={16}/></button>
              </section>
              <div className="space-y-4"><TransactionSummary amount={amount} rail={draft.rail} transferType={draft.transferType} source={source?.accountName ?? ''} recipient={recipientName}/><FraudExplanationCard level={risk.level} factors={risk.factors}/><FraudFallbackState/></div>
            </div>
          ) : (
            <div className="grid items-start gap-5 lg:grid-cols-[1.35fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={20}/></span><div><h2 className="text-base font-bold text-slate-900">Review your transfer</h2><p className="mt-1 text-xs text-slate-500">Check the details before confirming.</p></div></div>
                <div className="mt-5 rounded-xl border border-slate-100"><div className="flex items-center gap-3 border-b border-slate-100 p-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600"><Wallet size={16}/></span><span className="min-w-0 flex-1"><span className="block text-[10px] text-slate-400">FROM</span><span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">{source?.accountName}</span><span className="text-xs text-slate-500">Account ending {source?.accountNumber.slice(-4)}</span></span><ArrowDownLeft size={16} className="rotate-180 text-slate-400"/></div><div className="flex items-center gap-3 p-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><ArrowDownLeft size={16}/></span><span className="min-w-0 flex-1"><span className="block text-[10px] text-slate-400">TO</span><span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">{recipientName}</span><span className="text-xs text-slate-500">{recipientDetails}</span></span></div></div>
                <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">TRANSFER AMOUNT</p><p className="mt-1 text-lg font-bold text-slate-900">{money(amount)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">METHOD</p><p className="mt-1 text-sm font-semibold text-slate-800">{draft.transferType === 'own' ? 'Own accounts · Instant' : draft.transferType === 'upi' ? 'UPI · Instant' : `${draft.rail} · ${draft.rail === 'NEFT' ? 'Within 30 min' : 'Instant'}`}</p></div></div>
                {draft.note && <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">Note: {draft.note}</p>}
                <div className="mt-4"><FraudRiskIndicator level={risk.level} score={risk.score}/></div>
                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={() => setReview(false)} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">Edit details</button><button type="button" onClick={confirmTransfer} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">Confirm transfer <Check size={16}/></button></div>
                <p className="mt-4 text-center text-[10px] text-slate-400"><Sparkles size={12} className="mr-1 inline"/>This is a static demo. Confirming creates a sample receipt only.</p>
              </section>
              <div className="space-y-4"><TransactionSummary amount={amount} rail={draft.rail} transferType={draft.transferType} source={source?.accountName ?? ''} recipient={recipientName}/><FraudExplanationCard level={risk.level} factors={risk.factors}/><FraudFallbackState compact/></div>
            </div>
          )}
        </>
      )}

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-900">Recent transfers</h2><p className="mt-1 text-xs text-slate-500">Your latest payments from this account.</p></div><button type="button" onClick={() => { setDraft({ ...initialDraft, transferType: 'beneficiary', destinationId: recent[0]?.name === 'Priya Sharma' ? 'ben-priya' : 'ben-rohan' }); setReceipt(null); setReview(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hidden items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 sm:inline-flex">Repeat transfer <ChevronRight size={14}/></button></div>
        <div className="divide-y divide-slate-100">{recent.map((item, index) => <div key={`${item.name}-${item.date}-${index}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{item.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-800">{item.name}</span><span className="mt-0.5 block truncate text-[10px] text-slate-400">{item.detail} · {item.date}</span></span><span className="text-right"><span className="block text-xs font-semibold text-slate-800">−{money(item.amount)}</span><span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-emerald-600"><Check size={11}/>{item.status}</span></span></div>)}</div>
      </section>

      <div className="mt-4 flex items-start gap-2 px-1 text-[10px] leading-5 text-slate-400"><ShieldCheck size={13} className="mt-0.5 shrink-0"/>Your transfers are protected with device verification and transaction monitoring. Never share your password, PIN, or one-time code with anyone.</div>
      <FraudHoldModal open={holdOpen} onCancel={() => setHoldOpen(false)} onContinue={finishTransfer}/>
    </div>
  );
};
