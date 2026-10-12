/**
 * ============================================================================
 * COMPONENT: AccountsList.tsx
 * DESCRIPTION: Grid list of account cards showing available balance, masked account number, and type.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React, { useState } from 'react';
import { AccountCard } from './AccountCard';
import { AccountSummary, AccountType } from '../../types/account.types';

interface AccountsListProps {
  accounts: AccountSummary[];
}

export const AccountsList: React.FC<AccountsListProps> = ({ accounts }) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | AccountType>('ALL');

  const filteredAccounts = accounts.filter((acc) => {
    if (selectedFilter === 'ALL') return true;
    return acc.accountType === selectedFilter;
  });

  const filterTabs: Array<{ id: 'ALL' | AccountType; label: string; count: number }> = [
    { id: 'ALL', label: 'All Accounts', count: accounts.length },
    { id: 'SAVINGS', label: 'Savings', count: accounts.filter((a) => a.accountType === 'SAVINGS').length },
    { id: 'CURRENT', label: 'Current', count: accounts.filter((a) => a.accountType === 'CURRENT').length },
    { id: 'FD', label: 'Fixed Deposits', count: accounts.filter((a) => a.accountType === 'FD').length },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Account Type Filter Pills */}
      <div className="nb-filter-bar">
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={isActive ? 'nb-filter-pill-active' : 'nb-filter-pill'}
              type="button"
            >
              <span>{tab.label}</span>
              <span className={isActive ? 'nb-pill-badge-active' : 'nb-pill-badge'}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Account Cards Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="nb-empty-container py-10">
          <p className="text-slate-500 text-sm m-0">No accounts found under this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.accountId} account={account} />
          ))}
        </div>
      )}
    </div>
  );
};
