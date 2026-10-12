/**
 * ============================================================================
 * COMPONENT: SpendInsightsDashboard.tsx
 * DESCRIPTION: BNK-AI-02: Spend Insights dashboard providing monthly expense summaries,
 *              interactive month/year selection, and visual category breakdowns.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Zap,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { getSpendInsights } from '../../../services/accountService';
import { SpendInsightResponse, CategorySpendSummary } from '../../../types/account.types';
import { CategoryBreakdown } from './CategoryBreakdown';

// Supported PRD historical and active spending months
const AVAILABLE_MONTHS = [
  { id: '2026-10', label: 'October 2026', short: 'Oct 2026' },
  { id: '2026-09', label: 'September 2026', short: 'Sep 2026' },
  { id: '2026-08', label: 'August 2026', short: 'Aug 2026' },
  { id: '2026-07', label: 'July 2026', short: 'Jul 2026' },
];

export const SpendInsightsDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [spendData, setSpendData] = useState<SpendInsightResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Monthly Spend Insights
  const loadSpendInsights = useCallback(async (month: string, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getSpendInsights(month);
      setSpendData(data);
    } catch (err: any) {
      setError(err?.message || `Unable to load spend insights for ${month}.`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSpendInsights(selectedMonth);
  }, [selectedMonth, loadSpendInsights]);

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Month navigation helpers
  const currentMonthIdx = AVAILABLE_MONTHS.findIndex((m) => m.id === selectedMonth);
  const canGoPrevious = currentMonthIdx < AVAILABLE_MONTHS.length - 1;
  const canGoNext = currentMonthIdx > 0;

  const handlePreviousMonth = () => {
    if (canGoPrevious) {
      setSelectedMonth(AVAILABLE_MONTHS[currentMonthIdx + 1].id);
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      setSelectedMonth(AVAILABLE_MONTHS[currentMonthIdx - 1].id);
    }
  };

  // Top spending category
  const topCategory: CategorySpendSummary | undefined = spendData?.categories?.[0];

  // Daily Average Spend (approx 30 days)
  const dailyAverage = spendData ? spendData.totalSpend / 30 : 0;

  // Total debits count across categories
  const totalDebitsCount = spendData?.categories?.reduce(
    (sum, c) => sum + c.transactionCount,
    0
  ) || 0;

  return (
    <div className="nb-page-container">
      {/* 1. Top Breadcrumb & Return Bar */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500">
          <button
            onClick={() => navigate('/accounts')}
            className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-blue-600 transition-colors"
            type="button"
          >
            <ArrowLeft size={15} />
            <span>Accounts</span>
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-600" />
            Spend Insights AI
          </span>
        </nav>

        {/* RBI AI Advisory Disclaimer Pill */}
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>Non-Prescriptive Advisory Only</span>
        </div>
      </div>

      {/* 2. Header & Month/Year Selector Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">
              Monthly Spend Summary
            </h1>
            
          </div>
          <p className="text-sm text-slate-500 mt-1 mb-0">
            Automated categorical expense classification and visual outflow breakdown.
          </p>
        </div>

        {/* Month Selector Component (S2-05 Deliverable) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Previous Month Arrow */}
          <button
            onClick={handlePreviousMonth}
            disabled={!canGoPrevious || isLoading}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            type="button"
            title="View Previous Month"
            aria-label="View previous month"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Month Dropdown Selector */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={isLoading}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
              aria-label="Select spending month"
            >
              {AVAILABLE_MONTHS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <Calendar
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Next Month Arrow */}
          <button
            onClick={handleNextMonth}
            disabled={!canGoNext || isLoading}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            type="button"
            title="View Next Month"
            aria-label="View next month"
          >
            <ChevronRight size={16} />
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadSpendInsights(selectedMonth, true)}
            disabled={isRefreshing || isLoading}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs ml-1"
            type="button"
            title="Re-fetch live spend classification"
            aria-label="Refresh spend insights"
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? 'animate-spin text-blue-600' : ''}
            />
          </button>
        </div>
      </div>

      {/* 3. Loading Skeleton State */}
      {isLoading ? (
        <div className="flex flex-col gap-6" role="status" aria-label="Loading spend insights">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse">
                <div className="w-24 h-3 bg-slate-200 rounded mb-3" />
                <div className="w-36 h-7 bg-slate-200 rounded mb-2" />
                <div className="w-28 h-3 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 animate-pulse">
            <div className="w-48 h-5 bg-slate-200 rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-48 h-48 rounded-full bg-slate-200" />
              </div>
              <div className="lg:col-span-7 flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        /* 4. Error State */
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-rose-900 m-0">Failed to Load Spend Insights</h3>
          <p className="text-sm text-rose-700 m-0 max-w-md">{error}</p>
          <button
            onClick={() => loadSpendInsights(selectedMonth)}
            className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            type="button"
          >
            Retry Loading
          </button>
        </div>
      ) : spendData ? (
        /* 5. Main Content: KPIs + CategoryBreakdown */
        <div className="flex flex-col gap-6">
          {/* Executive Overview KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Spend */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-xs border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Monthly Spend
                </span>
                <div className="text-2xl font-extrabold tracking-tight mt-1">
                  {formatCurrency(spendData.totalSpend)}
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-3">
                <TrendingDown size={13} />
                <span>Verified debit outflow</span>
              </span>
            </div>

            {/* Card 2: Top Spending Category */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Highest Category
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1 truncate">
                  {topCategory?.categoryName || 'None'}
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-3 flex items-center gap-1">
                <strong className="text-slate-800">{formatCurrency(topCategory?.amount || 0)}</strong>
                <span>• {topCategory?.percentage?.toFixed(1)}% share</span>
              </span>
            </div>

            {/* Card 3: Daily Average */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Daily Average Spend
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(dailyAverage)}
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-3">
                Calculated over 30 billing days
              </span>
            </div>

            {/* Card 4: Total Debits Recorded */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Debit Transactions
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {totalDebitsCount} Debits
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-3 flex items-center gap-1">
                <CreditCard size={13} className="text-slate-400" />
                <span>Across verified accounts</span>
              </span>
            </div>
          </div>

          {/* Visual Category Breakdown Component (S2-05 Deliverable) */}
          <CategoryBreakdown
            categories={spendData.categories}
            totalSpend={spendData.totalSpend}
            currency={spendData.currency}
          />

          {/* AI Advisory Summary Preview Banner */}
          {spendData.aiExplanation && (
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <span className="font-bold block text-blue-950">AI Spend Summary</span>
                <p className="mt-0.5 mb-1 leading-relaxed text-blue-800">
                  {spendData.aiExplanation}
                </p>
                <span className="text-[11px] text-blue-600/80">
                  {spendData.disclaimer}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
