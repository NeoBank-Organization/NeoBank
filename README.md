# NeoBank Retail Internet Banking Portal - Frontend Architecture & Folder Structure

This project structure is mapped directly to the **NeoBank Product Requirements Document (PRD)** and the **Two-Sprint Team Ownership Matrix**.

## Team Roster & Module Ownership Matrix

| Resource ID | Owner Name | Email | Role / Feature Ownership | Primary PRD Requirements |
|---|---|---|---|---|
| **R01** | Mubina HVR | `mubina.hvr@gmail.com` | Frontend foundation, security and integration lead | Shared Shell, Session Timeout (BNK-FR-07), Virtual Keyboard, Route Infrastructure |
| **R02** | Syd RJ | `sydrj116@gmail.com` | Accounts feature owner | Accounts Dashboard (BNK-FR-01), Spend Insights AI (BNK-AI-02), Account Masking |
| **R03** | Poorvi K | `poorvipoorvikan@gmail.com` | Beneficiary feature owner | Beneficiary List & Add Form (BNK-FR-02), IFSC Lookup, KYC Document Check AI (BNK-AI-04) |
| **R04** | Prashanth K | `prashanth.k1517@gmail.com` | Fund Transfer feature owner | Own/Other-Bank Transfer (BNK-FR-03), Validation, Fraud Detection AI (BNK-AI-01) |
| **R05** | Ramya N | `ramyan.s1814009@gmail.com` | Transfer security & mock UPI owner | Mock UPI, OTP Confirmation Modal (BNK-FR-03), Banking Assistant AI (BNK-AI-05) |
| **R06** | Sundaravadhanisekar | `sundaravadhanisekar@gmail.com` | Scheduling & Statements feature owner | Scheduled Transfers (BNK-FR-04), Statement Generation & PDF Download (BNK-FR-05) |
| **R07** | Aishwarya Honawad | `aishwaryahonawad7@gmail.com` | Loans feature owner | Loan Application & EMI Calculator (BNK-FR-06), AI Loan Eligibility (BNK-AI-03) |
| **R08** | Alcious | `alciousalcious852@gmail.com` | Branch Admin feature owner | Admin Portal Dashboard (BNK-FR-08), Account & Loan Approval Workflows |
| **R09** | Thejashree Y K | `thejashreeyk918@gmail.com` | Integration / UX states / UAT owner | Cross-Module Integration, Shared UX State Audit, UAT Harness, Regression Testing |

---

## Architectural Principles
1. **Feature-Based Scoping**: Each team member has a dedicated feature module under `src/features/<feature-name>`.
2. **Explicit Owner Headers**: Every file contains a detailed TypeScript top header identifying the specific owner (ID, Name, Email), sprint tasks, and PRD coverage.
3. **Simulated Financial Transactions**: All transfer flows remain strictly simulated as per critical constraint.
4. **Advisory AI Boundaries**: AI components (Loan Eligibility, Fraud Detection, Banking Assistant, KYC, Spend Insights) enforce safe, non-blocking advisory states.
