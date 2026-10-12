/**
 * ============================================================================
 * COMPONENT: Dashboard.tsx
 * DESCRIPTION: Primary customer landing dashboard providing an executive financial
 *              overview, quick banking actions, recent activity, and AI insights.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: Core Shell / Foundation
 * ROLE: Retail Internet Banking Customer Dashboard
 * ============================================================================
 */
 
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Wallet,
  UserPlus,
  FileText,
  Landmark,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CreditCard,
  Clock,
  ChevronRight,
  Lock,
  Calendar,
} from 'lucide-react';
import { accountsMock, mockTransactions } from '../../data/accountsMock';
import type { User } from '../../features/auth/auth.types';
 
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
 
  // Retrieve authenticated customer profile from session
  const userData = sessionStorage.getItem('user');
  let user: User | null = null;
  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }
 
  // Aggregate Total Assets / Liquid Balance
  const totalBalance = useMemo(() => {
    return accountsMock.reduce((sum, acc) => sum + acc.availableBalance, 0);
  }, []);
 
  // Aggregate Recent Activity across primary accounts
  const recentTransactions = useMemo(() => {
    const allTx = [
      ...(mockTransactions['ACC-1001'] || []),
      ...(mockTransactions['ACC-1002'] || []),
    ];
    return allTx
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 5);
  }, []);
 
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };
 
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };
 
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());
 
  // Quick Action Shortcuts
  const quickActions = [
    {
      title: 'Send Money',
      subtitle: 'Transfer via NEFT / UPI',
      icon: <Send size={20} className="text-blue-600" />,
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-100',
      path: '/transfers',
    },
    {
      title: 'My Accounts',
      subtitle: 'Balances & Statements',
      icon: <Wallet size={20} className="text-emerald-600" />,
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100',
      path: '/accounts',
    },
    {
      title: 'Add Beneficiary',
      subtitle: 'Register new payee',
      icon: <UserPlus size={20} className="text-purple-600" />,
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-100',
      path: '/beneficiaries/add',
    },
    {
      title: 'Account Statements',
      subtitle: 'PDF downloads & search',
      icon: <FileText size={20} className="text-amber-600" />,
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-100',
      path: '/statements',
    },
    {
      title: 'Loans & EMI',
      subtitle: 'Apply & check eligibility',
      icon: <Landmark size={20} className="text-indigo-600" />,
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-100',
      path: '/loans',
    },
    {
      title: 'Spend Insights AI',
      subtitle: 'Smart expense advisory',
      icon: <Sparkles size={20} className="text-pink-600" />,
      bg: 'bg-pink-50 hover:bg-pink-100/80 border-pink-100',
      path: '/accounts/spend-insights',
    },
  ];
 
  return (
    <div className="nb-page-container">
      {/* 1. Welcome & Greeting Bar */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">
              Welcome back, {user?.name?.split(' ')[0] || 'Customer'} 👋
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              KYC Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 mb-0">
            Here is your daily financial summary and quick banking shortcuts.
          </p>
        </div>
 
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
            <Calendar size={13} className="text-slate-400" />
            <span>{todayFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">2FA Session Secured</span>
          </div>
        </div>
      </div>
 
      {/* 2. Executive Overview Hero KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Total Assets / Consolidated Portfolio */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Consolidated Net Assets
              </span>
              <CreditCard size={18} className="text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2 mb-0 font-medium">
              <TrendingUp size={13} />
              <span>+3.8% increase across liquid accounts</span>
            </p>
          </div>
 
          <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">3 Registered Accounts</span>
            <button
              onClick={() => navigate('/accounts')}
              className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
              type="button"
            >
              <span>Manage in Accounts</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
 
        {/* Monthly Credits / Cash Inflow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Monthly Inflow (Credits)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              ₹ 1,75,000.00
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-0">
              Salary credit & inter-bank inflows recorded
            </p>
          </div>
 
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Next expected deposit: Oct 30</span>
            <span className="font-semibold text-emerald-600">On Track</span>
          </div>
        </div>
 
        {/* Monthly Debits / Outflow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Monthly Outflow (Debits)
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              ₹ 42,650.00
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-0">
              Utilities, dining, and merchant expenses
            </p>
          </div>
 
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">24% of monthly budget</span>
            <button
              onClick={() => navigate('/accounts/spend-insights')}
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
              type="button"
            >
              <span>AI Insights</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
 
      {/* 3. Quick Actions Hub */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-3.5 flex items-center gap-2">
          <span>Quick Banking Actions</span>
        </h2>
 
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm focus:outline-none ${action.bg}`}
              type="button"
            >
              <div className="w-10 h-10 rounded-lg bg-white shadow-xs flex items-center justify-center">
                {action.icon}
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block leading-tight">
                  {action.title}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 leading-tight">
                  {action.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
 
      {/* 4. Two-Column Layout: Recent Transactions + AI Spend Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left (2 Columns): Recent Activity Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                Recent Transaction Activity
              </h3>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Latest debit and credit movements across your portfolio
              </p>
            </div>
            <button
              onClick={() => navigate('/accounts')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              type="button"
            >
              <span>View All in Accounts</span>
              <ChevronRight size={14} />
            </button>
          </div>
 
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div
                key={tx.transactionId}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-lg px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      tx.type === 'CREDIT'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {tx.description}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{formatDate(tx.transactionDate)}</span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px] font-medium">
                        {tx.category}
                      </span>
                    </span>
                  </div>
                </div>
 
                <div className="text-right">
                  <span
                    className={`text-sm font-bold font-mono ${
                      tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Bal: {formatCurrency(tx.balanceAfter)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Right (1 Column): AI Spend Advisory & Regulatory Banner */}
        <div className="flex flex-col gap-5">
          {/* AI Spend Insights Preview Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-5 text-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-pink-200 border border-white/20">
                  <Sparkles size={12} className="text-pink-300" />
                  AI Spend Advisory
                </span>
                <span className="text-[11px] text-white/60">PRD BNK-AI-02</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2 leading-snug">
                Smart Expense Breakdown
              </h4>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Your top spending category this cycle is <strong className="text-pink-300">Food & Dining (38%)</strong>. You have 3 uncategorized transactions ready for review.
              </p>
            </div>
 
            <button
              onClick={() => navigate('/accounts/spend-insights')}
              className="w-full py-2.5 px-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              type="button"
            >
              <span>Explore Spend Insights AI</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
 
          {/* Regulatory & Security Assurance Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck size={18} className="text-blue-600" />
              <span>Protected Banking Guarantee</span>
            </div>
            <p className="text-[12px] text-slate-500 m-0 leading-relaxed">
              Deposits insured up to ₹5,00,000 under DICGC regulations. All communication protected by 256-Bit TLS bank encryption.
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Lock size={11} /> TLS 1.3 Active
              </span>
              <span>RBI Regulated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
 