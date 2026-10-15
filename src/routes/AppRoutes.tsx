import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";


import { Login } from "../features/auth/Login";
import { Signup } from "../features/auth/Signup";
import { Unauthorized } from "../features/auth/Unauthorized";


import { Dashboard } from "../pages/Dashboard/Dashboard";
import { AccountsDashboard } from "../features/accounts/AccountsDashboard";
import { AccountDetails } from "../features/accounts/AccountDetails";
import { SpendInsightsDashboard } from "../features/accounts/spend-insights/SpendInsightsDashboard";


import { BeneficiaryList } from "../features/beneficiaries/BeneficiaryList";
import { AddBeneficiaryForm } from "../features/beneficiaries/AddBeneficiaryForm";


import { TransferForm } from "../features/fund-transfer/TransferForm";
import MockUPITransfer from "../features/transfer-security-upi/MockUPITransfer";


import { ScheduledTransfersList } from "../features/scheduling-statements/ScheduledTransfersList";
import { StatementsDashboard } from "../features/scheduling-statements/StatementsDashboard";


import { EMICalculator } from "../features/loans/EMICalculator";


import BranchAdminDashboard from "../features/branch-admin/BranchAdminDashboard";
import { UATScenarioRunner } from "../features/integration-uat/UATScenarioRunner";
import LoanPage from "../features/loans/LoanPage";


export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}


        <Route path="/login" element={<Login />} />


        <Route path="/signup" element={<Signup />} />


        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* Protected application */}


        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}


          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* Accounts */}


          <Route
            path="/accounts"
            element={<AccountsDashboard />}
          />


          <Route
            path="/accounts/spend-insights"
            element={<SpendInsightsDashboard />}
          />


          <Route
            path="/spend-insights"
            element={<SpendInsightsDashboard />}
          />


          <Route
            path="/accounts/:accountId"
            element={<AccountDetails />}
          />


          {/* Beneficiaries */}


          <Route
            path="/beneficiaries"
            element={<BeneficiaryList />}
          />


          <Route
            path="/beneficiaries/add"
            element={<AddBeneficiaryForm />}
          />


          {/* Transfers */}


          <Route
            path="/transfers"
            element={<TransferForm />}
          />


          <Route
            path="/transfers/scheduled"
            element={<ScheduledTransfersList />}
          />


          <Route
            path="/transfers/security-demo"
            element={<MockUPITransfer />}
          />


          {/* Statements */}


          <Route
            path="/statements"
            element={<StatementsDashboard />}
          />


          {/* Loans */}


          <Route path="/loans" element={<LoanPage />} />


          <Route
            path="/loans/emi-calculator"
            element={<EMICalculator />}
          />


          {/* Admin */}


          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <BranchAdminDashboard />
              </ProtectedRoute>
            }
          />


          {/* UAT */}


          <Route
            path="/uat"
            element={<UATScenarioRunner />}
          />


          {/* Default */}


          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />


          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />


        </Route>
      </Routes>
    </BrowserRouter>
  );
};