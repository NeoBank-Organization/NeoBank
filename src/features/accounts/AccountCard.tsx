/**
 * ============================================================================
 * COMPONENT: AccountCard.tsx
 * DESCRIPTION: Individual account card widget with masked account number, balance, and quick actions.
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
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Send,
  FileText
} from 'lucide-react';
import { AccountSummary } from '../../types/account.types';
import { AccountMasking } from './AccountMasking';

interface AccountCardProps {
  account: AccountSummary;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getCardTheme = () => {
    switch (account.accountType) {
      case 'SAVINGS':
        return {
          icon: <Wallet size={20} color="#FFFFFF" />,
          headerClass: 'nb-account-card-header nb-account-card-header-savings',
          label: 'Savings Account',
        };
      case 'CURRENT':
        return {
          icon: <Building2 size={20} color="#FFFFFF" />,
          headerClass: 'nb-account-card-header nb-account-card-header-current',
          label: 'Current Account',
        };
      case 'FD':
        return {
          icon: <TrendingUp size={20} color="#FFFFFF" />,
          headerClass: 'nb-account-card-header nb-account-card-header-fd',
          label: 'Fixed Deposit',
        };
      default:
        return {
          icon: <Wallet size={20} color="#FFFFFF" />,
          headerClass: 'nb-account-card-header nb-account-card-header-savings',
          label: 'Account',
        };
    }
  };

  const theme = getCardTheme();

  return (
    <div className="nb-account-card">
      {/* Card Header Strip */}
      <div className={theme.headerClass}>
        <div className="flex items-center gap-2.5">
          <div className="nb-account-card-icon-box">
            {theme.icon}
          </div>
          <div>
            <h3 className="nb-account-card-title">
              {account.accountName}
            </h3>
            <span className="nb-account-card-subtitle">
              {theme.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {account.isPrimary && (
            <span className="nb-badge-primary-pill">
              Primary
            </span>
          )}
          <span className="nb-badge-status-pill">
            <CheckCircle2 size={10} />
            {account.accountStatus}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="nb-account-card-body">
        {/* Account Number & Masking Component */}
        <div className="nb-account-mask-box">
          <AccountMasking
            accountNumber={account.accountNumber}
            maskedAccountNumber={account.maskedAccountNumber}
            showLabel={true}
            showCopy={true}
            size="sm"
            className="w-full"
          />
        </div>

        {/* Balance Display */}
        <div>
          <span className="nb-account-bal-label">
            {account.accountType === 'FD' ? 'Deposit Principal' : 'Available Balance'}
          </span>
          <div className="nb-account-bal-value">
            {formatCurrency(account.availableBalance)}
          </div>
          <div className="nb-account-bal-ledger">
            Ledger Balance: {formatCurrency(account.ledgerBalance)}
          </div>
        </div>

        {/* Account Specific Info (FD Interest or Branch IFSC) */}
        <div className="nb-account-meta-grid">
          {account.accountType === 'FD' ? (
            <>
              <div className="nb-account-meta-box">
                <span className="nb-account-meta-label">Interest Rate</span>
                <span className="nb-account-meta-val-accent">{account.interestRate}% p.a.</span>
              </div>
              <div className="nb-account-meta-box">
                <span className="nb-account-meta-label">Tenure</span>
                <span className="nb-account-meta-val-primary">{account.fdTenureMonths} Months</span>
              </div>
            </>
          ) : (
            <>
              <div className="nb-account-meta-box">
                <span className="nb-account-meta-label">IFSC Code</span>
                <span className="nb-account-meta-val-primary">{account.ifscCode}</span>
              </div>
              <div className="nb-account-meta-box">
                <span className="nb-account-meta-label">Branch</span>
                <span className="nb-account-meta-val-text" title={account.branchName}>
                  {account.branchName.split(',')[0]}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card Footer with Actions */}
      <div className="nb-account-card-footer">
        <div className="flex gap-2">
          {account.accountType !== 'FD' && (
            <button
              onClick={() => navigate('/transfer')}
              className="nb-btn-transfer"
              type="button"
            >
              <Send size={12} />
              Transfer
            </button>
          )}
          <button
            onClick={() => navigate('/statements')}
            className="nb-btn-statement"
            type="button"
          >
            <FileText size={12} />
            Statement
          </button>
        </div>

        <button
          onClick={() => navigate(`/accounts/${account.accountId}`)}
          className="nb-btn-view-details"
          type="button"
        >
          View Details
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
