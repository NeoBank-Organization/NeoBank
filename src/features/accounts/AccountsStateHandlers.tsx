/**
 * ============================================================================
 * COMPONENT: AccountsStateHandlers.tsx
 * DESCRIPTION: Reusable lifecycle state components (Loading, Empty, Error, Refresh)
 *              matching account card and transaction table geometries faithfully.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  ShieldAlert,
  Lock,
  Search,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

/* ============================================================================
   1. LOADING SKELETON LOADERS (Matching Card & Table Geometries)
   ============================================================================ */

/**
 * AccountCardSkeleton:
 * Faithful 1:1 geometry replica of AccountCard.tsx:
 * - Header banner with icon, title, subtitle, and badges
 * - Account number masking container
 * - Large available balance + ledger balance
 * - 2-column meta grid (IFSC/Branch or Tenure/Interest)
 * - Quick action buttons footer
 */
export const AccountCardSkeleton: React.FC = () => {
  return (
    <div
      className="nb-skeleton-card"
      role="status"
      aria-label="Loading account details"
    >
      {/* Card Header Strip Placeholder */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Icon box (40x40) */}
          <div className="w-10 h-10 rounded-xl nb-skeleton-bar flex-shrink-0" />
          <div className="flex flex-col gap-1.5">
            {/* Title */}
            <div className="w-28 h-4 nb-skeleton-bar" />
            {/* Subtitle */}
            <div className="w-16 h-3 nb-skeleton-bar" />
          </div>
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-5 rounded-full nb-skeleton-bar" />
          <div className="w-14 h-5 rounded-full nb-skeleton-bar" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-4">
        {/* Account Masking Box Placeholder */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-3 nb-skeleton-bar" />
            <div className="w-28 h-3.5 nb-skeleton-bar" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded nb-skeleton-bar" />
            <div className="w-5 h-5 rounded nb-skeleton-bar" />
          </div>
        </div>

        {/* Balances Section Placeholder */}
        <div>
          <div className="w-24 h-3 nb-skeleton-bar" />
          <div className="w-40 h-7 nb-skeleton-bar mt-2" />
          <div className="w-32 h-3 nb-skeleton-bar mt-1.5" />
        </div>

        {/* 2-Column Meta Grid Placeholder */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-lg flex flex-col gap-1.5">
            <div className="w-14 h-2.5 nb-skeleton-bar" />
            <div className="w-20 h-3.5 nb-skeleton-bar" />
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg flex flex-col gap-1.5">
            <div className="w-12 h-2.5 nb-skeleton-bar" />
            <div className="w-16 h-3.5 nb-skeleton-bar" />
          </div>
        </div>
      </div>

      {/* Card Footer Actions Placeholder */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-18 h-7 rounded-lg nb-skeleton-bar" />
          <div className="w-18 h-7 rounded-lg nb-skeleton-bar" />
        </div>
        <div className="w-24 h-7 rounded-lg nb-skeleton-bar" />
      </div>
    </div>
  );
};

/**
 * AccountLoadingSkeleton:
 * Multi-card responsive grid skeleton for AccountsDashboard & AccountsList.
 */
export const AccountLoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      role="status"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <AccountCardSkeleton key={`skeleton-card-${idx}`} />
      ))}
    </div>
  );
};

/**
 * TransactionTableSkeleton:
 * Faithful 1:1 geometry replica of the Transactions Tab in AccountDetails.tsx.
 */
export const TransactionTableSkeleton: React.FC<{ rowCount?: number }> = ({
  rowCount = 5,
}) => {
  return (
    <div
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
      role="status"
      aria-label="Loading transaction records"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header Row */}
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Description & Ref ID</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4 text-right">Balance After</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Skeletons Rows */}
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rowCount }).map((_, idx) => (
              <tr key={`skeleton-tx-row-${idx}`} className="animate-pulse">
                {/* Date */}
                <td className="py-3.5 px-4">
                  <div className="w-24 h-3.5 nb-skeleton-bar" />
                </td>

                {/* Description & Ref */}
                <td className="py-3.5 px-4">
                  <div className="w-40 h-4 nb-skeleton-bar" />
                  <div className="w-28 h-2.5 nb-skeleton-bar mt-1.5" />
                </td>

                {/* Category Pill */}
                <td className="py-3.5 px-4">
                  <div className="w-20 h-5 rounded-full nb-skeleton-bar" />
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <div className="w-16 h-5 rounded-md nb-skeleton-bar" />
                </td>

                {/* Amount (Right aligned) */}
                <td className="py-3.5 px-4 text-right">
                  <div className="w-20 h-4 nb-skeleton-bar ml-auto" />
                </td>

                {/* Balance After (Right aligned) */}
                <td className="py-3.5 px-4 text-right">
                  <div className="w-18 h-3.5 nb-skeleton-bar ml-auto" />
                </td>

                {/* Action Button (Centered) */}
                <td className="py-3.5 px-4 text-center">
                  <div className="w-12 h-6 rounded nb-skeleton-bar mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar Skeleton */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="w-32 h-3.5 nb-skeleton-bar" />
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded nb-skeleton-bar" />
          <div className="w-7 h-7 rounded nb-skeleton-bar" />
          <div className="w-7 h-7 rounded nb-skeleton-bar" />
        </div>
      </div>
    </div>
  );
};

/**
 * AccountDetailHeroSkeleton:
 * Geometry replica of AccountDetails.tsx hero banner & tab bar.
 */
export const AccountDetailHeroSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading account overview">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-16 h-4 nb-skeleton-bar" />
        <div className="w-3 h-4 nb-skeleton-bar" />
        <div className="w-28 h-4 nb-skeleton-bar" />
      </div>

      {/* Hero Banner Card Skeleton */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-700 nb-skeleton-shimmer" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-48 h-6 bg-slate-700 nb-skeleton-shimmer rounded" />
              <div className="w-16 h-5 bg-slate-700 nb-skeleton-shimmer rounded-full" />
            </div>
            <div className="w-36 h-4 bg-slate-700/80 nb-skeleton-shimmer rounded" />
            <div className="w-56 h-8 bg-slate-700/60 nb-skeleton-shimmer rounded-lg mt-2" />
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-3">
          <div className="w-28 h-3 bg-slate-700 nb-skeleton-shimmer rounded" />
          <div className="w-44 h-8 bg-slate-700 nb-skeleton-shimmer rounded" />
          <div className="w-32 h-3 bg-slate-700/70 nb-skeleton-shimmer rounded" />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-24 h-7 bg-slate-700 nb-skeleton-shimmer rounded-lg" />
            <div className="w-24 h-7 bg-slate-700 nb-skeleton-shimmer rounded-lg" />
          </div>
        </div>
      </div>

      {/* Tabs Bar Skeleton */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-6">
        <div className="w-24 h-8 nb-skeleton-bar" />
        <div className="w-28 h-8 nb-skeleton-bar" />
        <div className="w-24 h-8 nb-skeleton-bar" />
      </div>

      {/* Content Skeleton */}
      <TransactionTableSkeleton rowCount={4} />
    </div>
  );
};

/* ============================================================================
   2. ERROR STATE HANDLERS (500, 401, 404, Network)
   ============================================================================ */

export interface AccountErrorStateProps {
  message?: string;
  errorCode?: number | string;
  correlationId?: string;
  onRetry?: () => void;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  showDiagnostics?: boolean;
}

export const AccountErrorState: React.FC<AccountErrorStateProps> = ({
  message,
  errorCode = 500,
  correlationId = `CORR-${Math.floor(100000 + Math.random() * 900000)}`,
  onRetry,
  onSecondaryAction,
  secondaryActionLabel = 'Back to Accounts',
  showDiagnostics = true,
}) => {
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [copiedCorrId, setCopiedCorrId] = useState<boolean>(false);
  const [detailsExpanded, setDetailsExpanded] = useState<boolean>(false);

  const handleRetryClick = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleCopyCorrId = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(correlationId);
      setCopiedCorrId(true);
      setTimeout(() => setCopiedCorrId(false), 2000);
    }
  };

  // Error Classification based on PRD Specifications (500, 401, 404)
  const getErrorMeta = () => {
    const code = String(errorCode);
    if (code === '401' || code.includes('UNAUTHORIZED')) {
      return {
        badge: 'HTTP 401 UNAUTHORIZED',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <Lock className="w-7 h-7 text-amber-600" />,
        iconBg: 'bg-amber-50',
        title: 'Session Expired or Unauthorized',
        defaultMsg:
          'Your banking session security credentials have expired or are no longer valid. Please re-authenticate to safely access account services.',
        actionLabel: 'Re-authenticate Session',
      };
    }

    if (code === '404' || code.includes('NOT_FOUND')) {
      return {
        badge: 'HTTP 404 NOT FOUND',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        icon: <FileQuestion className="w-7 h-7 text-slate-600" />,
        iconBg: 'bg-slate-100',
        title: 'Account Record Not Found',
        defaultMsg:
          'The requested account identifier does not exist or is not associated with your authenticated retail profile in customer-account-service.',
        actionLabel: 'Check Portfolio',
      };
    }

    // Default to 500 Core Banking / Server Error
    return {
      badge: `HTTP ${code || '500'} INTERNAL ERROR`,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <AlertCircle className="w-7 h-7 text-rose-600" />,
      iconBg: 'bg-rose-50',
      title: 'Core Banking Service Unavailable',
      defaultMsg:
        'The customer-account-service microservice encountered an internal ledger timeout. Your funds are entirely secure, and banking operations remain protected.',
      actionLabel: 'Retry Connection',
    };
  };

  const meta = getErrorMeta();

  return (
    <div
      className="nb-error-container"
      role="alert"
      aria-live="assertive"
    >
      {/* Top Status Pill */}
      <span
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border tracking-wider uppercase ${meta.badgeColor}`}
      >
        {meta.badge}
      </span>

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${meta.iconBg} ring-8 ring-rose-50/50 mt-1`}
      >
        {meta.icon}
      </div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-slate-900 m-0">
        {meta.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 m-0 max-w-lg leading-relaxed">
        {message || meta.defaultMsg}
      </p>

      {/* Microservice Correlation Tracking ID */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-600">
        <span className="text-slate-400">Trace ID:</span>
        <span className="font-semibold">{correlationId}</span>
        <button
          onClick={handleCopyCorrId}
          className="ml-1 text-slate-400 hover:text-slate-700 focus:outline-none p-1 rounded hover:bg-slate-200 transition-colors"
          type="button"
          title="Copy Trace ID for Support Audit"
        >
          {copiedCorrId ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
        {onRetry && (
          <button
            onClick={handleRetryClick}
            disabled={isRetrying}
            className="nb-btn-base bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-75"
            type="button"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
            />
            {isRetrying ? 'Retrying...' : meta.actionLabel}
          </button>
        )}

        {onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="nb-btn-base bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-xs"
            type="button"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>

      {/* Collapsible Diagnostics Panel */}
      {showDiagnostics && (
        <div className="w-full max-w-md mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-medium focus:outline-none"
            type="button"
          >
            <span>{detailsExpanded ? 'Hide Technical Diagnostics' : 'Show Technical Diagnostics'}</span>
            {detailsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {detailsExpanded && (
            <div className="mt-2 text-left bg-slate-900 text-slate-200 p-3 rounded-lg text-xs font-mono space-y-1">
              <div><span className="text-slate-400">Endpoint:</span> GET /api/v1/accounts</div>
              <div><span className="text-slate-400">Microservice:</span> customer-account-service</div>
              <div><span className="text-slate-400">Status Code:</span> {errorCode}</div>
              <div><span className="text-slate-400">Timestamp:</span> {new Date().toISOString()}</div>
              <div><span className="text-slate-400">Correlation:</span> {correlationId}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   3. EMPTY STATE HANDLERS (Accounts & Transactions)
   ============================================================================ */

export interface AccountEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onRefresh?: () => void;
}

export const AccountEmptyState: React.FC<AccountEmptyStateProps> = ({
  title = 'No Active Accounts Found',
  description = 'There are currently no retail accounts associated with your customer profile. Open a new Savings, Current, or Fixed Deposit account to get started.',
  actionLabel = 'Open New Account',
  onAction,
  onRefresh,
}) => {
  return (
    <div
      className="nb-empty-container"
      role="region"
      aria-label="No accounts found"
    >
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
        <FolderOpen className="w-8 h-8" />
      </div>

      {/* Heading */}
      <h3 className="text-lg font-bold text-slate-900 m-0">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 m-0 max-w-md leading-relaxed">
        {description}
      </p>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-3 mt-1 flex-wrap justify-center">
        {onAction && (
          <button
            onClick={onAction}
            className="nb-btn-base bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all"
            type="button"
          >
            <PlusCircle className="w-4 h-4" />
            {actionLabel}
          </button>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="nb-btn-base bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh Portfolio
          </button>
        )}
      </div>
    </div>
  );
};

export interface TransactionEmptyStateProps {
  isFiltered?: boolean;
  title?: string;
  description?: string;
  onResetFilters?: () => void;
  onNewTransfer?: () => void;
}

export const TransactionEmptyState: React.FC<TransactionEmptyStateProps> = ({
  isFiltered = false,
  title,
  description,
  onResetFilters,
  onNewTransfer,
}) => {
  const displayTitle =
    title ||
    (isFiltered
      ? 'No Matching Transactions Found'
      : 'No Transaction Activity Recorded Yet');

  const displayDescription =
    description ||
    (isFiltered
      ? 'No ledger entries matched your current search query or category filters. Try resetting the filters.'
      : 'This account has no recent debit or credit entries. Fund transfers or deposits will show up here in real time.');

  return (
    <div
      className="p-10 text-center flex flex-col items-center gap-3 bg-white rounded-xl border border-dashed border-slate-200"
      role="region"
      aria-label="No transactions"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        {isFiltered ? <Search size={22} /> : <AlertCircle size={22} />}
      </div>

      <h4 className="text-base font-bold text-slate-800 m-0">
        {displayTitle}
      </h4>

      <p className="text-sm text-slate-500 m-0 max-w-sm leading-relaxed">
        {displayDescription}
      </p>

      <div className="flex items-center gap-2 mt-2">
        {isFiltered && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            type="button"
          >
            <RefreshCw size={12} />
            Reset Search & Filters
          </button>
        )}

        {!isFiltered && onNewTransfer && (
          <button
            onClick={onNewTransfer}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            type="button"
          >
            Initiate First Transfer
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   4. MANUAL REFRESH TRIGGER COMPONENT
   ============================================================================ */

export interface AccountRefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  isRefreshing?: boolean;
  lastUpdated?: Date | string;
  variant?: 'primary' | 'secondary' | 'compact' | 'ghost';
  className?: string;
  showTimestamp?: boolean;
}

export const AccountRefreshButton: React.FC<AccountRefreshButtonProps> = ({
  onRefresh,
  isRefreshing = false,
  lastUpdated,
  variant = 'secondary',
  className = '',
  showTimestamp = true,
}) => {
  const [justRefreshed, setJustRefreshed] = useState<boolean>(false);

  const handleClick = async () => {
    if (isRefreshing) return;
    try {
      await onRefresh();
      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 2000);
    } catch {
      // Caller handles error state
    }
  };

  const formatLastUpdated = (date?: Date | string) => {
    if (!date) return 'Live';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(d);
    } catch {
      return 'Just now';
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isRefreshing}
        className={`p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none disabled:opacity-60 shadow-xs ${className}`}
        type="button"
        title="Refresh account balances"
        aria-label="Refresh live account balances"
      >
        <RefreshCw
          size={14}
          className={isRefreshing ? 'animate-spin text-blue-600' : ''}
        />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isRefreshing}
        className={`nb-refresh-btn ${className}`}
        type="button"
        aria-label="One-click refresh of customer account portfolio"
      >
        {justRefreshed ? (
          <CheckCircle2 size={13} className="text-emerald-600" />
        ) : (
          <RefreshCw
            size={13}
            className={isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-600'}
          />
        )}
        <span>
          {isRefreshing
            ? 'Refreshing...'
            : justRefreshed
            ? 'Updated!'
            : 'Refresh'}
        </span>
      </button>

      {showTimestamp && lastUpdated && (
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline" title="Last synchronized with core ledger">
          Synced: {formatLastUpdated(lastUpdated)}
        </span>
      )}
    </div>
  );
};

/* ============================================================================
   5. UNIFIED LIFECYCLE WRAPPER COMPONENT
   ============================================================================ */

export interface AccountsStateHandlersProps {
  isLoading: boolean;
  isRefreshing?: boolean;
  error?: string | Error | null;
  errorCode?: number | string;
  correlationId?: string;
  isEmpty: boolean;
  onRetry?: () => void;
  onRefresh?: () => void;
  lastUpdated?: Date | string;
  loadingType?: 'cards' | 'transactions' | 'details' | 'custom';
  skeletonCount?: number;
  emptyType?: 'accounts' | 'transactions' | 'custom';
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  customLoading?: React.ReactNode;
  customEmpty?: React.ReactNode;
  customError?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * AccountsStateHandlers:
 * Master wrapper component managing the entire lifecycle of accounts screens:
 * 1. Loading: Skeleton matching card or transaction table geometries
 * 2. Error: Friendly error banner with retry trigger and error code badges (500, 401, 404)
 * 3. Empty: Informative state when no accounts or transactions are present
 * 4. Content: Smooth presentation of active accounts
 */
export const AccountsStateHandlers: React.FC<AccountsStateHandlersProps> = ({
  isLoading,
  isRefreshing = false,
  error = null,
  errorCode = 500,
  correlationId,
  isEmpty,
  onRetry = () => {},
  onRefresh,
  loadingType = 'cards',
  skeletonCount = 3,
  emptyType = 'accounts',
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  customLoading,
  customEmpty,
  customError,
  children,
}) => {
  // 1. Loading Lifecycle State
  if (isLoading) {
    if (customLoading) return <>{customLoading}</>;
    if (loadingType === 'transactions') {
      return <TransactionTableSkeleton rowCount={skeletonCount} />;
    }
    if (loadingType === 'details') {
      return <AccountDetailHeroSkeleton />;
    }
    return <AccountLoadingSkeleton count={skeletonCount} />;
  }

  // 2. Error Lifecycle State
  if (error) {
    if (customError) return <>{customError}</>;
    const errorMessage = typeof error === 'string' ? error : error.message;
    return (
      <AccountErrorState
        message={errorMessage}
        errorCode={errorCode}
        correlationId={correlationId}
        onRetry={onRetry}
      />
    );
  }

  // 3. Empty Lifecycle State
  if (isEmpty) {
    if (customEmpty) return <>{customEmpty}</>;
    if (emptyType === 'transactions') {
      return (
        <TransactionEmptyState
          title={emptyTitle}
          description={emptyDescription}
          onResetFilters={onEmptyAction}
        />
      );
    }
    return (
      <AccountEmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        onRefresh={onRefresh}
      />
    );
  }

  // 4. Operational Normal State
  return <>{children}</>;
};
