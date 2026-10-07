/**
 * ============================================================================
 * COMPONENT: AppRoutes.tsx
 * DESCRIPTION: Central routing configuration mapping portal URL paths to module screens.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R01 - Mubina HVR
 * EMAIL: mubina.hvr@gmail.com
 * ROLE: Frontend foundation, security and integration lead
 * PRD REQUIREMENTS: BNK-FR-07 (Security & Timeout), System Architecture Foundation
 * SPRINT DELIVERABLES: Sprint 1 (S1-01, S1-02, S1-03, S1-04) & Sprint 2 (S2-01, S2-02, S2-03, S2-04)
 * PRIMARY RESPONSIBILITIES: Shared shell, navigation, session timeout, virtual keyboard, common states, integration support
 * ============================================================================
 */

import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { AccountsDashboard } from '../features/accounts/AccountsDashboard';
import { AccountDetails } from '../features/accounts/AccountDetails';
import { SpendInsightsDashboard } from '../features/accounts/spend-insights/SpendInsightsDashboard';

import { BeneficiaryList } from '../features/beneficiaries/BeneficiaryList';
import { AddBeneficiaryForm } from '../features/beneficiaries/AddBeneficiaryForm';

import { TransferForm } from '../features/fund-transfer/TransferForm';
import { ScheduledTransfersList } from '../features/scheduling-statements/ScheduledTransfersList';
import { StatementsDashboard } from '../features/scheduling-statements/StatementsDashboard';

import { LoanApplicationForm } from '../features/loans/LoanApplicationForm';
import { EMICalculator } from '../features/loans/EMICalculator';

import { BranchAdminDashboard } from '../features/branch-admin/BranchAdminDashboard';
import { UATScenarioRunner } from '../features/integration-uat/UATScenarioRunner';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/accounts" replace />} />
          <Route path="accounts" element={<AccountsDashboard />} />
          <Route path="accounts/:accountId" element={<AccountDetails />} />
          <Route path="spend-insights" element={<SpendInsightsDashboard />} />
          <Route path="beneficiaries" element={<BeneficiaryList />} />
          <Route path="beneficiaries/add" element={<AddBeneficiaryForm />} />
          <Route path="transfer" element={<TransferForm />} />
          <Route path="scheduled-transfers" element={<ScheduledTransfersList />} />
          <Route path="statements" element={<StatementsDashboard />} />
          <Route path="loans" element={<LoanApplicationForm />} />
          <Route path="loans/emi-calculator" element={<EMICalculator />} />
          <Route path="admin" element={<ProtectedRoute role="admin"><BranchAdminDashboard /></ProtectedRoute>} />
          <Route path="uat" element={<UATScenarioRunner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
