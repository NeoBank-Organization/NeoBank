/**
 * ============================================================================
 * COMPONENT: AccountsDashboard.tsx
 * DESCRIPTION: Primary customer accounts dashboard displaying Savings, Current, and Fixed Deposit balances.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React, { useEffect, useState, useCallback } from 'react';
import { 
  RefreshCw, 
  Wallet, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccountSummary } from '../../types/account.types';
import { getAccounts } from '../../services/accountService';
import { AccountsList } from './AccountsList';
import { AccountsStateHandlers } from './AccountsStateHandlers';

export const AccountsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch customer account portfolio.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  // Aggregate Portfolio Balances
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.availableBalance, 0);
  const savingsBalance = accounts
    .filter((a) => a.accountType === 'SAVINGS')
    .reduce((sum, acc) => sum + acc.availableBalance, 0);
  const currentBalance = accounts
    .filter((a) => a.accountType === 'CURRENT')
    .reduce((sum, acc) => sum + acc.availableBalance, 0);
  const fdBalance = accounts
    .filter((a) => a.accountType === 'FD')
    .reduce((sum, acc) => sum + acc.availableBalance, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="nb-page-container">
      {/* Top Header & Refresh Bar */}
      <div className="nb-page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="nb-page-title">
              Accounts & Balances
            </h1>
            <span className="nb-badge-prd">
              BNK-FR-01
            </span>
          </div>
          <p className="nb-page-subtitle">
            Consolidated overview of your Savings, Current, and Fixed Deposit accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Spend Insights AI Button */}
          <button
            onClick={() => navigate('/spend-insights')}
            className="nb-btn-spend-ai"
            type="button"
          >
            <Sparkles size={15} color="#16a34a" />
            Spend Insights AI
            <ArrowUpRight size={14} />
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAccountData(true)}
            disabled={isRefreshing || isLoading}
            className="nb-btn-refresh"
            type="button"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Aggregate Portfolio KPI Cards */}
      <div className="nb-kpi-grid">
        {/* Total Consolidated Balance */}
        <div className="nb-kpi-card-dark">
          <div>
            <span className="nb-kpi-label-dark">
              TOTAL CONSOLIDATED BALANCE
            </span>
            <div className="nb-kpi-value-dark">
              {isLoading ? '₹ ————' : formatCurrency(totalBalance)}
            </div>
          </div>
          <div className="nb-kpi-subtext-dark">
            <ShieldCheck size={14} color="#34D399" />
            <span>Simulated Banking Core Environment</span>
          </div>
        </div>

        {/* Savings Balance Breakdown */}
        <div className="nb-kpi-card">
          <div className="flex justify-between items-center">
            <span className="nb-kpi-label">SAVINGS TOTAL</span>
            <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600 flex items-center justify-center">
              <Wallet size={16} color="#2563EB" />
            </div>
          </div>
          <div className="nb-kpi-value">
            {isLoading ? '₹ ————' : formatCurrency(savingsBalance)}
          </div>
          <span className="nb-kpi-subtext">Liquid available funds</span>
        </div>

        {/* Current Balance Breakdown */}
        <div className="nb-kpi-card">
          <div className="flex justify-between items-center">
            <span className="nb-kpi-label">CURRENT TOTAL</span>
            <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600 flex items-center justify-center">
              <Building2 size={16} color="#059669" />
            </div>
          </div>
          <div className="nb-kpi-value">
            {isLoading ? '₹ ————' : formatCurrency(currentBalance)}
          </div>
          <span className="nb-kpi-subtext">Commercial operational funds</span>
        </div>

        {/* Fixed Deposits Breakdown */}
        <div className="nb-kpi-card">
          <div className="flex justify-between items-center">
            <span className="nb-kpi-label">DEPOSITS (FD)</span>
            <div className="bg-purple-50 p-1.5 rounded-lg text-purple-600 flex items-center justify-center">
              <TrendingUp size={16} color="#7C3AED" />
            </div>
          </div>
          <div className="nb-kpi-value">
            {isLoading ? '₹ ————' : formatCurrency(fdBalance)}
          </div>
          <span className="nb-kpi-subtext">High-yield term deposits</span>
        </div>
      </div>

      {/* Main Accounts Content List wrapped with lifecycle states */}
      <AccountsStateHandlers
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && accounts.length === 0}
        onRetry={() => fetchAccountData(false)}
      >
        <AccountsList accounts={accounts} />
      </AccountsStateHandlers>
    </div>
  );
};
