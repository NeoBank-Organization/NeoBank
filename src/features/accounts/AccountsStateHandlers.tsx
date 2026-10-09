/**
 * ============================================================================
 * COMPONENT: AccountsStateHandlers.tsx
 * DESCRIPTION: Wrapper component managing loading, empty, error, and pull-to-refresh states for accounts.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React from 'react';
import { AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';

export const AccountLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="nb-skeleton-card">
          <div className="flex justify-between items-center">
            <div className="w-2/5 h-4 nb-skeleton-bar" />
            <div className="w-1/5 h-4 nb-skeleton-bar rounded-full" />
          </div>
          <div className="w-3/5 h-3 nb-skeleton-bar bg-slate-100" />
          <div className="w-4/5 h-8 nb-skeleton-bar mt-2" />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="h-10 nb-skeleton-bar bg-slate-100" />
            <div className="h-10 nb-skeleton-bar bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AccountErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => {
  return (
    <div className="nb-error-container">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 m-0">
        Unable to Load Account Details
      </h3>
      <p className="text-sm text-red-700 m-0 max-w-md">
        {message || 'An unexpected error occurred while communicating with the customer-account-service.'}
      </p>
      <button
        onClick={onRetry}
        className="nb-btn-base bg-red-600 hover:bg-red-700 text-white mt-2 shadow-sm"
        type="button"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry Connection
      </button>
    </div>
  );
};

export const AccountEmptyState: React.FC = () => {
  return (
    <div className="nb-empty-container">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
        <FolderOpen className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 m-0">
        No Active Accounts Found
      </h3>
      <p className="text-sm text-slate-500 m-0 max-w-sm">
        There are currently no retail accounts associated with your customer profile.
      </p>
    </div>
  );
};

interface AccountsStateHandlersProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

export const AccountsStateHandlers: React.FC<AccountsStateHandlersProps> = ({
  isLoading,
  error,
  isEmpty,
  onRetry,
  children,
}) => {
  if (isLoading) return <AccountLoadingSkeleton />;
  if (error) return <AccountErrorState message={error} onRetry={onRetry} />;
  if (isEmpty) return <AccountEmptyState />;
  return <>{children}</>;
};
