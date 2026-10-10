/**
 * ============================================================================
 * COMPONENT: AccountDetails.tsx
 * DESCRIPTION: Comprehensive detailed view for a selected account with tabbed
 *              navigation for Overview, Paginated Transactions, and Account Info/Limits.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Wallet,
  Building2,
  TrendingUp,
  CheckCircle2,
  Send,
  FileText,
  Sparkles,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  Check,
  Copy,
  X,
  Printer,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react';

import {
  AccountSummary,
  TransactionItem,
  TransactionType,
  TransactionCategory,
} from '../../types/account.types';
import {
  getAccountSummary,
  getAccountTransactions,
} from '../../services/accountService';
import { AccountMasking } from './AccountMasking';
import { AccountTabs, AccountTabKey } from './AccountTabs';
import {
  AccountLoadingSkeleton,
  AccountErrorState,
} from './AccountsStateHandlers';

export const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  // State
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState<AccountTabKey>('overview');

  // Transactions Tab Filtering, Searching & Pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-high' | 'amount-low'>('date-desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Transaction Receipt Modal
  const [receiptTx, setReceiptTx] = useState<TransactionItem | null>(null);

  // Data fetching
  const loadAccountData = useCallback(async (isManualRefresh = false) => {
    if (!accountId) {
      setError('No account identifier provided in route.');
      setIsLoading(false);
      return;
    }

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [accData, txData] = await Promise.all([
        getAccountSummary(accountId),
        getAccountTransactions(accountId),
      ]);
      setAccount(accData);
      setTransactions(txData);
    } catch (err: any) {
      setError(err?.message || 'Unable to load account information.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadAccountData();
  }, [loadAccountData]);

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Date Formatter
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    } catch {
      return isoString;
    }
  };

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.referenceNumber.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.amount.toString().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter((tx) => tx.category === categoryFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'date-desc') {
        return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
      }
      if (sortOrder === 'date-asc') {
        return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      }
      if (sortOrder === 'amount-high') {
        return b.amount - a.amount;
      }
      if (sortOrder === 'amount-low') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, categoryFilter, sortOrder, pageSize]);

  // Paginated chunk
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Theme gradient based on account type
  const getHeroTheme = (type?: string) => {
    switch (type) {
      case 'SAVINGS':
        return {
          headerClass: 'nb-account-hero-header nb-hero-savings',
          icon: <Wallet size={24} className="text-white" />,
          label: 'Savings Account',
          accentColor: '#2563EB',
        };
      case 'CURRENT':
        return {
          headerClass: 'nb-account-hero-header nb-hero-current',
          icon: <Building2 size={24} className="text-white" />,
          label: 'Current Account',
          accentColor: '#059669',
        };
      case 'FD':
        return {
          headerClass: 'nb-account-hero-header nb-hero-fd',
          icon: <TrendingUp size={24} className="text-white" />,
          label: 'Fixed Deposit',
          accentColor: '#7C3AED',
        };
      default:
        return {
          headerClass: 'nb-account-hero-header nb-hero-savings',
          icon: <Wallet size={24} className="text-white" />,
          label: 'Account Details',
          accentColor: '#2563EB',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="nb-page-container">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-24 h-4 nb-skeleton-bar" />
        </div>
        <AccountLoadingSkeleton />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="nb-page-container">
        <div className="mb-4">
          <button
            onClick={() => navigate('/accounts')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            type="button"
          >
            <ArrowLeft size={16} />
            Back to Accounts
          </button>
        </div>
        <AccountErrorState
          message={error || `Account ${accountId} could not be located in the banking core.`}
          onRetry={() => loadAccountData(false)}
        />
      </div>
    );
  }

  const theme = getHeroTheme(account.accountType);

  // Available transfer limit calculation
  const dailyLimit = account.dailyTransferLimit || 200000;
  const usedDailyLimit = account.usedDailyLimit || 45000;
  const remainingLimit = Math.max(0, dailyLimit - usedDailyLimit);
  const limitUsagePct = Math.min(100, Math.round((usedDailyLimit / dailyLimit) * 100));

  return (
    <div className="nb-page-container">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex justify-between items-center flex-wrap gap-3">
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
          <span className="font-semibold text-slate-900">{account.accountName}</span>
        </nav>

        <div className="flex items-center gap-2">
          {/* Spend Insights AI link */}
          <button
            onClick={() => navigate('/accounts/spend-insights')}
            className="nb-btn-spend-ai"
            type="button"
            title="View AI spend breakdown for this portfolio"
          >
            <Sparkles size={14} color="#16a34a" />
            <span>Spend Insights AI</span>
            <ArrowUpRight size={13} />
          </button>

          {/* Refresh button */}
          <button
            onClick={() => loadAccountData(true)}
            disabled={isRefreshing}
            className="nb-btn-refresh"
            type="button"
            title="Refresh balance and transactions"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Account Hero Card with Masking & Balances */}
      <div className="nb-account-hero-card">
        <div className={theme.headerClass}>
          {/* Left: Account Identity */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              {theme.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-white m-0">
                  {account.accountName}
                </h1>
                {account.isPrimary && (
                  <span className="nb-badge-primary-pill">Primary</span>
                )}
                <span className="nb-badge-status-pill">
                  <CheckCircle2 size={11} />
                  {account.accountStatus}
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1 font-medium">
                {theme.label} • {account.branchName}
              </p>

              {/* Account Number with Masking */}
              <div className="mt-3.5 inline-block">
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-3">
                  <span className="text-xs text-slate-300 font-medium uppercase tracking-wider">
                    A/C No:
                  </span>
                  <AccountMasking
                    accountNumber={account.accountNumber}
                    maskedAccountNumber={account.maskedAccountNumber}
                    showCopy={true}
                    size="md"
                    className="text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Balances & Actions */}
          <div className="flex flex-col items-end gap-3 text-right">
            <div>
              <span className="text-xs text-white/80 font-medium tracking-wide uppercase block">
                {account.accountType === 'FD' ? 'Deposit Principal' : 'Available Balance'}
              </span>
              <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
                {formatCurrency(account.availableBalance)}
              </div>
              <div className="text-xs text-white/70 mt-1">
                Ledger Balance: {formatCurrency(account.ledgerBalance)}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-2">
              {account.accountType !== 'FD' && (
                <button
                  onClick={() => navigate('/transfers')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all shadow-sm"
                  type="button"
                >
                  <Send size={13} className="text-blue-600" />
                  Transfer Funds
                </button>
              )}
              <button
                onClick={() => navigate('/statements')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm rounded-lg text-xs font-semibold transition-all border border-white/20"
                type="button"
              >
                <FileText size={13} />
                Statement
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white px-6 pt-3">
          <AccountTabs
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            transactionCount={transactions.length}
          />
        </div>
      </div>

      {/* ====================================================================
          TAB 1: OVERVIEW
          ==================================================================== */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6 animate-fade-in" role="tabpanel" id="account-tabpanel-overview">
          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Available Liquid Funds
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {formatCurrency(account.availableBalance)}
                </div>
              </div>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-3">
                <CheckCircle2 size={13} /> Instant access via UPI / NEFT
              </span>
            </div>

            {/* Metric 2: Limits or FD return */}
            {account.accountType === 'FD' ? (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Deposit Interest Rate
                  </span>
                  <div className="text-2xl font-bold text-purple-700 mt-2">
                    {account.interestRate}% p.a.
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-3">
                  Tenure: {account.fdTenureMonths} Months • Due {account.maturityDate}
                </span>
              </div>
            ) : (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Daily Transfer Limit
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {limitUsagePct}% used
                    </span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-2">
                    {formatCurrency(remainingLimit)} left
                  </div>
                  <div className="nb-limit-progress-bar mt-2">
                    <div
                      className="nb-limit-progress-fill"
                      style={{ width: `${limitUsagePct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-3">
                  Limit: {formatCurrency(dailyLimit)} / day
                </span>
              </div>
            )}

            {/* Metric 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Electronic Clearing (IFSC)
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-2">
                  {account.ifscCode}
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-3 truncate" title={account.branchName}>
                {account.branchName}
              </span>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Account Status & Security
                </span>
                <div className="text-lg font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  Active & Protected
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-3">
                Nominee: {account.nomineeName || 'Priya RJ (Verified)'}
              </span>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  Recent Account Transactions
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  Latest transactions recorded for this account
                </p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                type="button"
              >
                <span>View All ({transactions.length})</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No recent transactions found for this account.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.slice(0, 4).map((tx) => (
                  <div
                    key={tx.transactionId}
                    className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          tx.type === 'CREDIT'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {tx.type === 'CREDIT' ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {tx.description}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{formatDate(tx.transactionDate)}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{tx.referenceNumber}</span>
                          <span>•</span>
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                            {tx.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${
                          tx.type === 'CREDIT' ? 'nb-tx-credit' : 'nb-tx-debit'
                        }`}
                      >
                        {tx.type === 'CREDIT' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Bal: {formatCurrency(tx.balanceAfter)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regulatory & Security Assurance Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">
                  RBI Regulated & DICGC Insured Deposit
                </span>
                <span>
                  Principal and interest protected up to ₹5,00,000 under the Deposit Insurance Scheme.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-slate-500">
              <Lock size={12} /> 256-Bit TLS Bank Encryption Active
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: TRANSACTIONS
          ==================================================================== */}
      {activeTab === 'transactions' && (
        <div className="flex flex-col gap-5 animate-fade-in" role="tabpanel" id="account-tabpanel-transactions">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, ref ID..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  type="button"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Pills & Selectors */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              {/* Type Filter */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setTypeFilter('ALL')}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${
                    typeFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  All
                </button>
                <button
                  onClick={() => setTypeFilter('DEBIT')}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${
                    typeFilter === 'DEBIT'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Debits (-)
                </button>
                <button
                  onClick={() => setTypeFilter('CREDIT')}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${
                    typeFilter === 'CREDIT'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Credits (+)
                </button>
              </div>

              {/* Category Dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Categories</option>
                <option value="FOOD">Food & Dining</option>
                <option value="TRAVEL">Travel & Transport</option>
                <option value="BILLS">Bills & Utilities</option>
                <option value="SHOPPING">Shopping</option>
                <option value="TRANSFERS">Transfers</option>
                <option value="INVESTMENTS">Investments</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortOrder}
                onChange={(e: any) => setSortOrder(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>

              {(searchQuery || typeFilter !== 'ALL' || categoryFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('ALL');
                    setCategoryFilter('ALL');
                  }}
                  className="text-xs text-blue-600 hover:underline px-2 font-medium"
                  type="button"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="nb-tx-table-card">
            {paginatedTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
                <h4 className="text-base font-bold text-slate-800 m-0">No matching transactions</h4>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  Try adjusting your search query or clear the active filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('ALL');
                    setCategoryFilter('ALL');
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                  type="button"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Description & Ref ID</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Amount (₹)</th>
                      <th className="py-3 px-4 text-right">Balance After</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paginatedTransactions.map((tx) => (
                      <tr key={tx.transactionId} className="nb-tx-row">
                        {/* Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                          {formatDate(tx.transactionDate)}
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 text-sm">
                            {tx.description}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {tx.referenceNumber}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            {tx.category}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={11} />
                            {tx.status}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span
                            className={`font-mono text-sm ${
                              tx.type === 'CREDIT' ? 'nb-tx-credit' : 'nb-tx-debit'
                            }`}
                          >
                            {tx.type === 'CREDIT' ? '+' : '-'} {formatCurrency(tx.amount)}
                          </span>
                        </td>

                        {/* Balance After */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-xs text-slate-600">
                          {formatCurrency(tx.balanceAfter)}
                        </td>

                        {/* Receipt Button */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setReceiptTx(tx)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            type="button"
                            title="View transaction receipt voucher"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span>
                  Showing{' '}
                  <strong className="text-slate-900">
                    {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-slate-900">
                    {Math.min(currentPage * pageSize, filteredTransactions.length)}
                  </strong>{' '}
                  of <strong className="text-slate-900">{filteredTransactions.length}</strong> transactions
                </span>

                <div className="flex items-center gap-1.5 ml-2">
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  type="button"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`px-2.5 py-1 rounded border text-xs font-bold transition-colors ${
                      currentPage === pg
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    type="button"
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  type="button"
                  aria-label="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: ACCOUNT INFO / LIMITS
          ==================================================================== */}
      {activeTab === 'info' && (
        <div className="flex flex-col gap-6 animate-fade-in" role="tabpanel" id="account-tabpanel-info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: Account Ownership & Identification */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-600" />
                  Account Coordinates & Ownership
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Account Title:</span>
                    <span className="font-bold text-slate-900">{account.accountName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Customer ID:</span>
                    <span className="font-mono font-bold text-slate-900">{account.customerId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Account Number:</span>
                    <AccountMasking
                      accountNumber={account.accountNumber}
                      maskedAccountNumber={account.maskedAccountNumber}
                      showCopy={true}
                      size="sm"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Account Type:</span>
                    <span className="font-bold text-slate-800">{theme.label}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Opening Date:</span>
                    <span className="font-medium text-slate-800">
                      {account.openedDate || '15 Aug 2023'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Primary Status:</span>
                    <span className="font-semibold text-blue-600">
                      {account.isPrimary ? 'Primary Account' : 'Secondary Account'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Base Currency:</span>
                    <span className="font-mono font-bold text-slate-800">
                      INR (₹) - Indian Rupee
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Branch Coordinates */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Building2 size={18} className="text-emerald-600" />
                  Branch & Electronic Coordinates
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Financial Institution:</span>
                    <span className="font-bold text-slate-900">NeoBank Private Limited</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Branch Location:</span>
                    <span className="font-medium text-slate-800 text-right max-w-[200px] truncate" title={account.branchName}>
                      {account.branchName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">IFSC Code:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                      <span>{account.ifscCode}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">MICR Code:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {account.micrCode || '560024012'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Clearing Networks:</span>
                    <div className="flex items-center gap-1">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">NEFT</span>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">RTGS</span>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">IMPS</span>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">UPI</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Nominee Registered:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      {account.nomineeName || 'Priya RJ (Verified)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Daily & Periodic Operational Limits */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-purple-600" />
              Daily Operational & Transfer Limits
            </h3>

            {account.accountType === 'FD' ? (
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-5 text-sm text-purple-900">
                <h4 className="font-bold text-purple-950 mb-1">Fixed Deposit Term Specifications</h4>
                <p className="text-xs text-purple-800 mb-4">
                  Term deposits are non-operating accounts intended for compound capital preservation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3.5 rounded-lg border border-purple-100">
                    <span className="text-xs text-slate-500 block">Annual Percentage Rate:</span>
                    <span className="text-xl font-bold text-purple-800">{account.interestRate}% p.a.</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-purple-100">
                    <span className="text-xs text-slate-500 block">Compounding Tenure:</span>
                    <span className="text-xl font-bold text-slate-900">{account.fdTenureMonths} Months</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-purple-100">
                    <span className="text-xs text-slate-500 block">Maturity Date:</span>
                    <span className="text-xl font-bold text-emerald-700">{account.maturityDate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Limit 1: NEFT/RTGS */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                    <span>NEFT / RTGS Transfer</span>
                    <span className="text-blue-600">{limitUsagePct}% used</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(dailyLimit)} / day
                  </div>
                  <div className="nb-limit-progress-bar mt-2 mb-2">
                    <div
                      className="nb-limit-progress-fill"
                      style={{ width: `${limitUsagePct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Used: {formatCurrency(usedDailyLimit)} • Left: {formatCurrency(remainingLimit)}
                  </span>
                </div>

                {/* Limit 2: UPI */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                    <span>UPI Transfer Limit</span>
                    <span className="text-emerald-600">Active</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(account.upiDailyLimit || 100000)} / day
                  </div>
                  <div className="nb-limit-progress-bar mt-2 mb-2">
                    <div
                      className="nb-limit-progress-fill bg-emerald-600"
                      style={{ width: '25%' }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Max ₹1,00,000 per single transaction
                  </span>
                </div>

                {/* Limit 3: ATM */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                    <span>ATM Cash Withdrawal</span>
                    <span className="text-slate-600">Active</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(account.atmLimit || 50000)} / day
                  </div>
                  <div className="nb-limit-progress-bar mt-2 mb-2">
                    <div
                      className="nb-limit-progress-fill bg-indigo-600"
                      style={{ width: '0%' }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    5 Free domestic ATM transactions/mo
                  </span>
                </div>

                {/* Limit 4: POS & E-Commerce */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                    <span>POS & E-Commerce</span>
                    <span className="text-slate-600">Active</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(account.posLimit || 150000)} / day
                  </div>
                  <div className="nb-limit-progress-bar mt-2 mb-2">
                    <div
                      className="nb-limit-progress-fill bg-amber-600"
                      style={{ width: '15%' }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Tokenized card protection enabled
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          TRANSACTION RECEIPT MODAL
          ==================================================================== */}
      {receiptTx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setReceiptTx(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  NB
                </div>
                <div>
                  <h3 id="receipt-title" className="text-base font-bold text-slate-900 m-0">
                    Transaction Receipt
                  </h3>
                  <span className="text-[11px] text-slate-500">Official NeoBank Voucher</span>
                </div>
              </div>
              <button
                onClick={() => setReceiptTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                type="button"
                aria-label="Close receipt"
              >
                <X size={18} />
              </button>
            </div>

            {/* Amount Banner */}
            <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                {receiptTx.type === 'CREDIT' ? 'Credited Amount' : 'Debited Amount'}
              </span>
              <div
                className={`text-3xl font-extrabold font-mono mt-1 ${
                  receiptTx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {receiptTx.type === 'CREDIT' ? '+' : '-'} {formatCurrency(receiptTx.amount)}
              </div>
              <div className="inline-flex items-center gap-1 mt-2 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                <CheckCircle2 size={12} />
                Transaction Successful
              </div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Description:</span>
                <span className="font-semibold text-slate-900 text-right">{receiptTx.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference Number:</span>
                <span className="font-mono font-bold text-slate-900">{receiptTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Timestamp:</span>
                <span className="font-medium text-slate-800">{formatDate(receiptTx.transactionDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-slate-800">{receiptTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source Account:</span>
                <span className="font-medium text-slate-800">{account.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Post-Txn Balance:</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(receiptTx.balanceAfter)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                type="button"
              >
                <Printer size={14} />
                Print Voucher
              </button>
              <button
                onClick={() => setReceiptTx(null)}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
