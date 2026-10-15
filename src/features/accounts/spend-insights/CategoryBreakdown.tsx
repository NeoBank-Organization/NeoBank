/**
 * ============================================================================
 * COMPONENT: CategoryBreakdown.tsx
 * DESCRIPTION: BNK-AI-02: Monthly expense graphical breakdown by categories with
 *              an interactive donut chart, category progress bars, and stats.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Plane,
  Zap,
  ShoppingBag,
  TrendingUp,
  MoreHorizontal,
  HelpCircle,
  ArrowRight,
  PieChart,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CategorySpendSummary, TransactionCategory } from '../../../types/account.types';

interface CategoryBreakdownProps {
  categories: CategorySpendSummary[];
  totalSpend: number;
  currency?: string;
  onCategorySelect?: (category: TransactionCategory) => void;
  selectedCategory?: TransactionCategory | null;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  totalSpend,
  currency = 'INR',
  onCategorySelect,
  selectedCategory = null,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<TransactionCategory | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Get matching icon for category
  const getCategoryIcon = (category: TransactionCategory) => {
    switch (category) {
      case 'FOOD':
        return <Utensils size={16} />;
      case 'TRAVEL':
        return <Plane size={16} />;
      case 'BILLS':
        return <Zap size={16} />;
      case 'SHOPPING':
        return <ShoppingBag size={16} />;
      case 'INVESTMENTS':
        return <TrendingUp size={16} />;
      case 'UNCATEGORIZED':
        return <HelpCircle size={16} />;
      case 'OTHERS':
      default:
        return <MoreHorizontal size={16} />;
    }
  };

  // Mathematical Exit Check Verification: Total spend equals sum of category values
  const sumOfCategories = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.amount, 0);
  }, [categories]);

  const isReconciled = Math.abs(sumOfCategories - totalSpend) < 0.01;

  // Donut Chart calculations using SVG circumference
  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative strokeDashoffset for each slice
  const donutSlices = useMemo(() => {
    let accumulatedPercent = 0;
    return categories.map((cat) => {
      const pct = totalSpend > 0 ? cat.amount / totalSpend : 0;
      const strokeDasharray = `${pct * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedPercent * circumference;
      accumulatedPercent += pct;

      return {
        ...cat,
        strokeDasharray,
        strokeDashoffset,
        effectivePercent: pct * 100,
      };
    });
  }, [categories, totalSpend, circumference]);

  const activeCategory = hoveredCategory || selectedCategory;
  const activeItem = categories.find((c) => c.category === activeCategory);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header Strip */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 m-0 flex items-center gap-2">
            <PieChart size={18} className="text-blue-600" />
            <span>Monthly Category Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 m-0 mt-0.5">
            Visual expenditure distribution across verified transaction categories.
          </p>
        </div>

        {/* Mathematical Exit Check Badge */}
        {isReconciled && (
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"
            title="Total spend exactly matches the mathematical sum of category breakdown values"
          >
            <CheckCircle2 size={12} />
            <span>100% Reconciled</span>
          </span>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive SVG Donut Chart (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 180 180"
              aria-label="Category spend donut chart"
            >
              {/* Background ring */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />

              {/* Slices */}
              {donutSlices.map((slice) => {
                const isHovered = activeCategory === slice.category;
                return (
                  <circle
                    key={slice.category}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(slice.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => onCategorySelect && onCategorySelect(slice.category)}
                    role="graphics-symbol"
                    aria-label={`${slice.categoryName}: ${slice.percentage}%`}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {activeItem ? activeItem.categoryName : 'TOTAL SPEND'}
              </span>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {formatCurrency(activeItem ? activeItem.amount : totalSpend)}
              </span>
              <span className="text-[11px] font-semibold text-blue-600 mt-0.5">
                {activeItem ? `${activeItem.percentage.toFixed(1)}% of total` : `${categories.length} Categories`}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3 m-0">
            Hover over any chart segment to inspect categorical weight
          </p>
        </div>

        {/* Right: Categorical Breakdown Progress Bars & Stats (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {categories.map((cat, index) => {
            const isHovered = activeCategory === cat.category;
            const avgPerTxn = cat.transactionCount > 0 ? cat.amount / cat.transactionCount : cat.amount;

            return (
              <div
                key={cat.category}
                onMouseEnter={() => setHoveredCategory(cat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onCategorySelect && onCategorySelect(cat.category)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                {/* Top Row: Icon, Title, Transaction Count & Amount */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Icon container matching category color */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-2xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      {getCategoryIcon(cat.category)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 leading-none">
                          {cat.categoryName}
                        </span>
                        {index === 0 && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            #1 Top Spend
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1 leading-none">
                        {cat.transactionCount} debits • Avg {formatCurrency(avgPerTxn)}
                      </span>
                    </div>
                  </div>

                  {/* Amount and percentage badge */}
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block leading-none font-mono">
                      {formatCurrency(cat.amount)}
                    </span>
                    <span
                      className="text-[11px] font-bold inline-block mt-1 px-1.5 py-0.2 rounded font-mono"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                      }}
                    >
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(100, Math.max(2, cat.percentage))}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Reconciliation Bar */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-slate-500">
          <Sparkles size={13} className="text-blue-500" />
          <span>Sum of category items:</span>
          <strong className="text-slate-800 font-mono">{formatCurrency(sumOfCategories)}</strong>
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-slate-500">Total Monthly Spend:</span>
          <strong className="text-slate-900 font-mono font-bold">{formatCurrency(totalSpend)}</strong>
        </span>
      </div>
    </div>
  );
};
