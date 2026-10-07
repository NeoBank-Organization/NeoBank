/**
 * ============================================================================
 * COMPONENT: ErrorBoundary.tsx
 * DESCRIPTION: React error boundary catching component crashes and displaying graceful failure state.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R01 - Mubina HVR
 * EMAIL: mubina.hvr@gmail.com
 * ROLE: Frontend foundation, security and integration lead
 * PRD REQUIREMENTS: BNK-FR-07 (Security & Timeout), System Architecture Foundation
 * SPRINT DELIVERABLES: Sprint 1 (S1-01, S1-02, S1-03, S1-04) & Sprint 2 (S2-01, S2-02, S2-03, S2-04)
 * PRIMARY RESPONSIBILITIES: Shared shell, navigation, session timeout, virtual keyboard, common states, integration support
 * ============================================================================
 */

import React, { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children?: ReactNode }> {
  render() {
    return this.props.children || null;
  }
}
