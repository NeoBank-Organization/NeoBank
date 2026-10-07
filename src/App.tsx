/**
 * ============================================================================
 * COMPONENT: App.tsx
 * DESCRIPTION: Main Application wrapper providing SecurityContext, GlobalStateProvider and AppRoutes.
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

import { AppRoutes } from './routes/AppRoutes';
import { SecurityProvider } from './components/security/SecurityContext';
import { GlobalStateProvider } from './features/integration-uat/GlobalStateProvider';

export default function App() {
  return (
    <SecurityProvider>
      <GlobalStateProvider>
        <AppRoutes />
      </GlobalStateProvider>
    </SecurityProvider>
  );
}
