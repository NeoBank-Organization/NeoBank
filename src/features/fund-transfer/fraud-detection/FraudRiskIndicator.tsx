import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import type { RiskLevel } from '../transfer.types';

const config = {
  LOW: { icon: ShieldCheck, style: 'bg-emerald-50 text-emerald-700 ring-emerald-200', label: 'Low risk' },
  MEDIUM: { icon: Shield, style: 'bg-amber-50 text-amber-700 ring-amber-200', label: 'Review recommended' },
  HIGH: { icon: ShieldAlert, style: 'bg-rose-50 text-rose-700 ring-rose-200', label: 'Additional verification' },
};

export const FraudRiskIndicator = ({ level, score }: { level: RiskLevel; score: number }) => {
  const item = config[level];
  const Icon = item.icon;
  return <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ${item.style}`}><Icon size={16}/><span className="text-xs font-semibold">{item.label}</span><span className="ml-auto text-[11px] font-medium">Risk score {score}/100</span></div>;
};
