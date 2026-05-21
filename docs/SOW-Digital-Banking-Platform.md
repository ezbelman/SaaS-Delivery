# Statement of Work — Digital Banking Platform
## Slalom Consulting × Meridian Bank PLC

**SOW Reference:** SLM-MBK-2024-SOW-002  
**Version:** 1.0  
**Status:** Approved  
**Issue Date:** February 1, 2024  
**Programme End:** December 31, 2024  
**MSA Reference:** MSA-SLM-MBK-2023-007  
**Engagement Lead:** Alex Rivera, Program Manager, Slalom Consulting  
**Client Sponsor:** Diana Foster, VP Digital Banking, Meridian Bank PLC  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Strategic Context](#2-background--strategic-context)
3. [Programme Objectives & Success Metrics](#3-programme-objectives--success-metrics)
4. [Scope of Services — Full Platform](#4-scope-of-services--full-platform)
5. [Deliverables Schedule](#5-deliverables-schedule)
6. [Staffing & Resource Plan](#6-staffing--resource-plan)
7. [Sprint & Delivery Cadence](#7-sprint--delivery-cadence)
8. [Commercial Terms](#8-commercial-terms)
9. [Governance & Reporting](#9-governance--reporting)
10. [Assumptions & Client Dependencies](#10-assumptions--client-dependencies)
11. [Risk Register Summary](#11-risk-register-summary)
12. [Change Management](#12-change-management)
13. [Intellectual Property & Licensing](#13-intellectual-property--licensing)
14. [Confidentiality & Data Protection](#14-confidentiality--data-protection)
15. [Warranties, Liability & Termination](#15-warranties-liability--termination)
16. [Signatories](#16-signatories)

---

## 1. Executive Summary

Slalom Consulting ("Slalom") is engaged by Meridian Bank PLC ("Meridian Bank" or "Client") to design, build, and deliver the **Meridian Bank Digital Banking Platform** — a comprehensive modernisation of the bank's retail digital estate spanning native mobile applications, a re-platformed online banking portal, and a PSD2-compliant Open Banking API Gateway.

The programme runs from **February 1 to December 31, 2024** (11 months, 21 sprints) and has a total contract value of **USD $5,950,000**. At completion, Meridian Bank will possess a fully certified, regulatory-compliant digital banking suite serving its 2.3 million retail customers across iOS, Android, and web channels, with open banking capability enabling fintech partner integrations under the PSD2 framework.

This Statement of Work is the primary commercial and technical contract governing the engagement and is subordinate to the Master Services Agreement (MSA-SLM-MBK-2023-007). All prior SOW versions are superseded on execution of this document.

---

## 2. Background & Strategic Context

### 2.1 Current State

Meridian Bank's digital channels are materially behind market peers on three dimensions:

| Dimension | Current State | Market Benchmark | Business Impact |
|---|---|---|---|
| Mobile authentication | Password + OTP only; no biometric | 89% of UK banks offer Face ID / fingerprint | 63% login abandonment rate; 18% app uninstall rate post-login |
| Web security | No MFA; no PCI-DSS Level 1 certification | MFA standard; PCI-DSS L1 required for card-present merchants | Regulatory exposure; blocked from card-processing contract renewal Q3 2024 |
| Open banking | No PSD2 capability | UK Open Banking mandate since Jan 2018 | FCA enforcement risk; zero fintech partnership revenue |

### 2.2 Strategic Drivers

- **Regulatory compliance:** PSD2 non-compliance exposes Meridian Bank to FCA fines of up to 4% of global annual turnover. PCI-DSS Level 1 certification is required to renew the card-processing contract expiring September 30, 2024.
- **Customer retention:** NPS of 31 (below the 42 sector average); mobile app store rating of 2.8/5; active customer churn rate of 7.2% annually attributable to poor digital experience.
- **Revenue growth:** Open banking enables revenue-sharing agreements with fintech partners (projected £4.2M incremental annual revenue by 2026 per Meridian Bank CFO model).
- **Operational efficiency:** Modernised stack reduces mobile maintenance cost by an estimated 40% vs the legacy UIKit/Java codebase (Meridian Bank internal estimate).

### 2.3 Programme Approach

The programme uses **Scaled Agile** with three parallel workstreams converging at quarterly integration points. Two-week sprints with a shared Kanban workflow provide real-time delivery visibility. Meridian Bank Product Owners are embedded in ceremonies for continuous backlog alignment. The Slalom Delivery Platform (SDP) serves as the engagement command centre — all work items, RAID items, escalations, and sprint metrics are tracked within SDP throughout the engagement.

---

## 3. Programme Objectives & Success Metrics

| Objective | KPI | Baseline | Target | Measurement Date |
|---|---|---|---|---|
| Eliminate biometric authentication gap | Biometric login adoption rate | 0% | ≥ 60% within 90 days of launch | Dec 15, 2024 |
| Reduce mobile login abandonment | Login completion rate | 37% | ≥ 75% | Dec 15, 2024 |
| Achieve PCI-DSS Level 1 certification | Coalfire audit pass | Not certified | Certified before Oct 1, 2024 | Oct 1, 2024 |
| Pass OWASP penetration test | NCC Group ASVS Level 2 | Not assessed | Zero Critical findings at go-live | Sep 15, 2024 |
| Launch PSD2-compliant open banking | First TPP production transaction | None | ≥ 1 TPP integrated in production | Dec 1, 2024 |
| Improve app store ratings | App Store / Google Play rating | 2.8 / 5 | ≥ 4.0 / 5 within 60 days of launch | Nov 15, 2024 |
| Meet performance SLAs | p95 API latency; cold-start time | Unmeasured | p95 ≤ 800ms; cold start ≤ 3s on 4G | Oct 1, 2024 |
| Achieve portal availability SLA | Monthly uptime | 97.1% (measured) | ≥ 99.9% | Dec 31, 2024 |

---

## 4. Scope of Services — Full Platform

### 4.1 Stream 1 — Mobile Banking Application (Phase 1: Feb – Sep 2024)

#### 4.1.1 iOS Application

- Full UI/UX redesign using **SwiftUI** (Swift 5.9), replacing all UIKit screens
- Biometric authentication: Face ID and Touch ID via **LocalAuthentication API**; PIN fallback; 30-minute inactivity timeout; background re-authentication gate
- Behavioural biometrics: **BioCatch SDK** integration for continuous fraud detection
- Instant payments: Faster Payments-compatible transfer (IBAN format: GB29NWBK…); £10,000 single / £25,000 daily limits; real-time confirmation ≤ 2 seconds; step-up re-auth for transactions > £1,000
- Push notifications: **APNs** — transaction alerts, login attempt notifications, silent refresh; background fetch for balance updates
- Certificate pinning on all URLSession connections; App Transport Security (ATS) enforced
- Crash reporting: Firebase Crashlytics; alert threshold ≤ 0.5% crash-free session rate
- Submission pipeline: TestFlight beta → App Store (includes Apple App Privacy questionnaire completion)

#### 4.1.2 Android Application

- Full UI rebuild using **Jetpack Compose** (Kotlin 1.9); Material Design 3 tokens aligned to Meridian Bank brand
- Biometric authentication: **BiometricPrompt API** — fingerprint, face unlock, device credential fallback; identical session logic to iOS
- Behavioural biometrics: **BioCatch SDK for Android**
- Instant payments: mirrors iOS flow with Android-specific UX conventions (bottom sheets, gesture navigation)
- Push notifications: **Firebase Cloud Messaging (FCM)** — Data and Notification message types; battery-optimised delivery via WorkManager
- Certificate pinning: OkHttp 4 CertificatePinner; network security config
- Submission pipeline: Firebase App Distribution beta → Google Play (includes Data Safety declaration)

#### 4.1.3 Shared Mobile Services

- Auth0 OIDC token integration (access token 15-min TTL; refresh token rotation) — shared identity plane with the portal
- Firebase Analytics (anonymised; GDPR consent gate; UK ICO compliant)
- Deeplink scheme: `meridianbank://` for notification tap-through routing

### 4.2 Stream 2 — Online Banking Portal (Phase 2: Aug – Oct 2024)

- **Framework:** Next.js 14 (App Router), TypeScript 5, Tailwind CSS — server-side rendered for SEO and Core Web Vitals (LCP < 2.5s target)
- **Authentication:** Auth0 SDK (OIDC/PKCE); TOTP (RFC 6238) as primary MFA; SMS OTP via Twilio as fallback (max 3 attempts/session); LDAP federation during 90-day migration window; session cookie: HttpOnly, Secure, SameSite=Strict
- **Account dashboard:** Current balance, available balance, 5 pending transactions; 30-day spend trend by category; quick-action row (transfer, pay, statement)
- **Balance data:** ElastiCache Redis 30s TTL against Temenos T24 rate limit (200 req/min); write-through cache invalidation on payment completion
- **Transaction history:** Server-side paginated (20/page); filter by date range, amount, merchant category code; CSV and PDF export
- **Payee management:** Add/edit/delete with duplicate-payee detection and IBAN validation
- **Security hardening:** CSP Level 2; HSTS with preload; CSRF tokens on all state-changing endpoints; rate limiting on auth routes (5 req/min); input sanitisation (DOMPurify); Coalfire PCI-DSS gap assessment and Level 1 certification
- **Tokenisation:** Vault by HashiCorp (PCI-DSS Level 1 certified vendor) for card number and CVV at rest
- **Accessibility:** WCAG 2.1 AA — axe-core automated testing in CI; manual screen reader audit (NVDA + VoiceOver)
- **Infrastructure:** AWS ECS Fargate (EU-West-2); Aurora PostgreSQL 15; ElastiCache Redis 7; CloudFront CDN; AWS Secrets Manager (30-day automated rotation)

### 4.3 Stream 3 — Open Banking API Gateway (Phase 3: Oct – Dec 2024)

- **PSD2 scope:** Berlin Group NextGenPSD2 v1.3 — Payment Initiation Service (PIS), Account Information Service (AIS), Funds Confirmation Service (FCS)
- **Consent management:** Customer grant/revocation UI (90-day consent expiry; 7-day advance email notification); EBA-compliant consent scopes; consent audit log in Aurora PostgreSQL
- **TPP authorisation:** Auth0 Machine-to-Machine; eIDAS qualified certificate validation; MTLS for all TPP connections; TPP registration and onboarding workflow
- **API runtime:** Node.js 20 / Fastify; OpenAPI 3.1 specification published on developer portal; Redis sliding-window rate limiting (1,000 req/min per TPP); structured JSON logging (Datadog ingest)
- **T24 integration:** Payment instruction proxy to Temenos T24 Transact; read-replica for account information; sandbox environment for TPP testing
- **Developer portal:** Swagger UI; sandbox environment with synthetic test accounts; TPP onboarding documentation; API changelog

### 4.4 Cross-Cutting Services

#### 4.4.1 Infrastructure & DevOps

- **Infrastructure as Code:** Terraform modules for all AWS resources; state in S3 + DynamoDB lock; workspaces per environment (dev / staging / prod)
- **CI/CD:** GitHub Actions — lint, unit tests (Vitest / Jest / XCTest / JUnit), type-check, SAST (SonarQube; block at CVSS > 7.0), Docker build & scan (Trivy), ECS blue/green deploy
- **Observability:** Datadog APM — SLO dashboards (p95 latency ≤ 800ms; availability ≥ 99.9%); synthetic monitoring on critical user journeys; PagerDuty escalation
- **Secrets management:** AWS Secrets Manager; 30-day automated rotation; no secrets in environment variables or source code
- **DR / backup:** Aurora automated snapshots (7-day retention); cross-region replica in EU-West-1 for RTO ≤ 4h / RPO ≤ 1h

#### 4.4.2 Security & Compliance

- **SAST:** SonarQube integrated in CI — blocking threshold CVSS > 7.0; weekly full scan reports to Security Lead
- **DAST:** OWASP ZAP in staging pipeline on every release candidate
- **Penetration test:** NCC Group — full-scope OWASP ASVS Level 2 assessment; scope: portal, API gateway, mobile apps; report to CISO by Sep 1, 2024 (interim) and Dec 15, 2024 (final)
- **PCI-DSS:** Coalfire gap assessment + Level 1 certification audit targeting Oct 1, 2024
- **Bug bounty:** Slalom to recommend HackerOne programme launch Q1 2025 (post go-live)

#### 4.4.3 Programme Management

- Weekly RAG status reports to Meridian Bank Steering Committee (5-minute read; RAID delta, velocity, budget burn)
- Bi-weekly Steering Committee presentations (30 minutes; milestone progress, risk review, upcoming decisions)
- Sprint ceremonies: planning, daily stand-up, review (demo), retrospective — 2-week cadence; 21 sprints total
- RAID log maintained in SDP: all risks, assumptions, issues, decisions tracked with owner, probability, impact, and resolution plan
- End-of-phase lessons learned workshop after each milestone; consolidated close-out report at D-008

---

## 5. Deliverables Schedule

| ID | Deliverable | Phase | Owner | Due Date | Acceptance Criteria |
|---|---|---|---|---|---|
| D-001 | Inception & Architecture Baseline | 0 | Alex Rivera | Feb 28, 2024 | Architecture doc signed off; Auth0 tenant live; AWS accounts active; T24 read-replica confirmed; Terraform workspaces created |
| D-002 | Mobile App Beta (iOS + Android) | 1 | Priya Sharma | Jul 31, 2024 | Biometric login functional on iOS 16+ and Android 12+; instant payment end-to-end; crash rate < 2% on TestFlight and Firebase |
| D-003 | Mobile App Production Release | 1 | Priya Sharma | Sep 15, 2024 | Live on App Store and Google Play; crash rate ≤ 0.5%; p95 cold-start ≤ 3s on 4G; App Store rating ≥ 3.5 at launch |
| D-004 | Security Assessment Report (Interim) | 1 | Sarah Mitchell | Sep 1, 2024 | NCC Group OWASP ASVS Level 2 report delivered; all Critical findings have accepted remediation plans; no open Critical findings |
| D-005 | Online Banking Portal Go-Live | 2 | Sarah Mitchell | Oct 1, 2024 | PCI-DSS Level 1 certified (Coalfire); OWASP ASVS Level 2 passed; MFA enabled on 100% of accounts; WCAG 2.1 AA audit clean |
| D-006 | Open Banking API Gateway Launch | 3 | Tom Bradley | Dec 1, 2024 | PSD2 PIS and AIS endpoints in production; at least 1 TPP live; eIDAS cert validation active; rate limiting verified; developer portal published |
| D-007 | Final Security Assessment Report | 3 | Sarah Mitchell | Dec 15, 2024 | Full-scope NCC Group report (all 3 streams); zero open Critical findings; signed off by Meridian Bank CISO |
| D-008 | Programme Close-Out Report | All | Alex Rivera | Dec 31, 2024 | Lessons learned documented; financial reconciliation complete; knowledge transfer sessions conducted; all access credentials handed over |

---

## 6. Staffing & Resource Plan

| Role | Name | Grade | Ph.0 | Ph.1 (Feb–Sep) | Ph.2 (Oct) | Ph.3 (Nov–Dec) | Day Rate (USD) |
|---|---|---|---|---|---|---|---|
| Program Manager | Alex Rivera | Principal | 100% | 50% | 50% | 50% | $2,400 |
| Project Manager | Sarah Mitchell | Manager | 100% | 100% | 100% | 100% | $1,900 |
| Scrum Master | Marcus Johnson | Consultant | 50% | 100% | 100% | 100% | $1,600 |
| iOS Lead Engineer | Priya Sharma | Senior Consultant | 100% | 100% | 25% | — | $2,100 |
| Android Engineer | James Okafor | Consultant | 50% | 100% | 25% | — | $1,900 |
| Full-Stack Engineer | Elena Vasquez | Senior Consultant | 50% | 50% | 100% | 100% | $1,900 |
| Business Analyst / PO | Tom Bradley | Consultant | 100% | 100% | 100% | 100% | $1,700 |
| DevOps Engineer | Ravi Patel | Consultant | 100% | 75% | 75% | 75% | $1,800 |
| QA Lead | Anya Kowalski | Consultant | — | Spr.6–12 100% | 100% | 100% | $1,500 |
| Pen Test (subcontract) | NCC Group | Fixed fee | — | Sep 2024 | — | Dec 2024 | Fixed $150K |

_Slalom may substitute named resources with personnel of equivalent or greater seniority upon 10 business days' advance written notice to the Client._

---

## 7. Sprint & Delivery Cadence

| Sprint | Dates | Focus | Milestone |
|---|---|---|---|
| Spr 1–2 | Feb 1 – Feb 28 | Inception: Auth0, AWS, T24 access, architecture | D-001 Architecture Baseline |
| Spr 3–4 | Mar 1 – Mar 28 | Mobile — biometric auth (iOS + Android) | Biometric prototype in staging |
| Spr 5–6 | Apr 1 – Apr 25 | Mobile — instant payments, push notifications | Payment flow end-to-end in staging |
| Spr 7–8 | Apr 26 – May 23 | Mobile — hardening, BioCatch, Crashlytics / Portal — Auth0 framework | Mobile beta candidate build |
| Spr 9–10 | May 24 – Jun 20 | Mobile — App Store prep / Portal — dashboard, transactions | PSD2 sandbox credentials due Jun 28 |
| Spr 11 | Jun 21 – Jul 4 | Mobile — App Store submission / Portal — payee management | iOS + Android submitted to stores |
| Spr 12 | Jul 5 – Jul 31 | Mobile — beta / Portal — MFA | D-002 Mobile App Beta |
| Spr 13–14 | Aug 1 – Aug 29 | Portal — PCI-DSS hardening, Coalfire assessment, WCAG audit | PCI-DSS gap assessment complete |
| Spr 15 | Sep 1 – Sep 15 | Mobile — production release / NCC Group pen test | D-003 Mobile Production · D-004 Security Report |
| Spr 16 | Sep 16 – Oct 1 | Portal — go-live, final hardening | D-005 Portal Go-Live |
| Spr 17–18 | Oct 2 – Oct 31 | Open Banking — consent management, AIS endpoints, TPP portal | Developer portal live |
| Spr 19–20 | Nov 1 – Nov 28 | Open Banking — PIS endpoints, first TPP integration in UAT | First TPP UAT transaction |
| Spr 21 | Dec 1 – Dec 15 | Open Banking — go-live / NCC final report | D-006 API Gateway · D-007 Final Security Report |
| Close-out | Dec 16 – Dec 31 | Knowledge transfer, handover, close-out report | D-008 Programme Close-Out |

---

## 8. Commercial Terms

### 8.1 Contract Structure & Total Value

| Phase | Stream | T&M Ceiling | Fixed Milestone | Phase Total |
|---|---|---|---|---|
| Phase 0 | Inception & Architecture | $120,000 | — | $120,000 |
| Phase 1 | Mobile Banking Application | $1,480,000 | $800,000 at D-002 | $2,280,000 |
| Phase 2 | Online Banking Portal | $700,000 | $1,200,000 at D-005 | $1,900,000 |
| Phase 3 | Open Banking API Gateway | $700,000 | $800,000 at D-006 | $1,500,000 |
| All phases | NCC Group Penetration Test | — | $150,000 fixed | $150,000 |
| **Total** | | | | **$5,950,000** |

### 8.2 Milestone Payment Schedule

| Milestone | Trigger | Amount | Invoice Timing |
|---|---|---|---|
| M0 — Mobilisation | SOW execution and kick-off | $250,000 | Feb 1, 2024 |
| M1 — Mobile Beta | Client acceptance of D-002 | $800,000 | Within 5 business days of acceptance |
| M2 — Portal Go-Live | Client acceptance of D-005 | $1,200,000 | Within 5 business days of acceptance |
| M3 — API Gateway | Client acceptance of D-006 | $800,000 | Within 5 business days of acceptance |
| M4 — Close-Out | Client acceptance of D-008 | $150,000 | Within 5 business days of acceptance |

### 8.3 T&M Billing

- **Frequency:** Monthly in arrears; invoices by the 5th of the following month
- **Timesheets:** Approved by Client contract manager by the 3rd of each month
- **Payment terms:** Net 30; late payments accrue interest at 2% per month
- **Expenses:** Reimbursable at cost; receipts required; pre-approval for any item > $500
- **Currency:** USD; Meridian Bank bears FX conversion costs
- **Overrun policy:** Slalom must notify Client 15 business days before any phase T&M ceiling is projected to be exceeded by > 10%; a signed CR is required before incurring hours above the ceiling

---

## 9. Governance & Reporting

| Forum | Participants | Frequency | Purpose |
|---|---|---|---|
| Steering Committee | Diana Foster (Chair), Alex Rivera, CTO, CFO | Bi-weekly | Milestone acceptance, programme health, escalation decisions |
| Programme Review | Alex Rivera, Sarah Mitchell, Tom Bradley, Meridian BA | Weekly | RAG status, RAID delta, dependency tracking, upcoming risks |
| Sprint Review | Delivery team, Meridian PO, selected stakeholders | End of each sprint | Demo of completed stories; acceptance confirmation |
| Sprint Planning | Delivery team + Meridian PO | Start of each sprint | Backlog grooming; sprint commitment |
| Daily Stand-Up | Delivery team | Daily 09:00 GMT | Progress, blockers, coordination |
| Security Review | Sarah Mitchell, Ravi Patel, Meridian CISO | Monthly | SAST report review; vulnerability triage; pen test coordination |

### Deliverable Acceptance Process

1. Slalom submits Deliverable Acceptance Notice (DAN) to Client nominated contact
2. Client has **10 business days** to accept or raise written defects
3. Slalom has **10 business days** to remediate raised defects
4. No written response within 10 business days = deemed accepted
5. Milestone invoice issued within 5 business days of formal acceptance

---

## 10. Assumptions & Client Dependencies

| ID | Assumption / Dependency | Required By | Owner | Risk if Missed |
|---|---|---|---|---|
| A-001 | AWS account access and IAM baseline provisioned | Feb 15, 2024 | Meridian IT | Inception sprint blocked; programme start delayed |
| A-002 | Temenos T24 API documentation and read-replica access | Feb 15, 2024 | Meridian IT | Dashboard and payment flows cannot be developed in Phase 1 |
| A-003 | Auth0 tenant provisioned to agreed specification | Mar 1, 2024 | Slalom / Meridian IT | Authentication across all streams delayed by ≥ 1 sprint |
| A-004 | BioCatch SDK licensing executed (iOS + Android) | Apr 1, 2024 | Meridian Bank | Continuous auth descoped; manual fraud review required |
| A-005 | PSD2 sandbox credentials from Meridian IT | Jun 28, 2024 | Meridian IT | Sprint 9 Open Banking development blocked; Phase 3 at risk |
| A-006 | NCC Group pen test window confirmed and scope agreed | Jul 15, 2024 | Sarah Mitchell | D-004 and D-005 at risk; fallback vendor required |
| A-007 | PCI-DSS tokenisation vendor achieves Level 1 certification | Jul 15, 2024 | Meridian Bank (RAID-001 escalated) | Phase 2 go-live blocked; Adyen / Braintree fallback adds 6 weeks |
| A-008 | Meridian Bank Product Owner dedicated ≥ 50% to ceremonies | Feb 1, 2024 | Meridian Bank | Backlog prioritisation delayed; sprint velocity reduced by est. 20% |
| A-009 | App Store and Google Play developer accounts under Meridian entity | Jun 1, 2024 | Meridian Bank | Mobile production release cannot proceed under Meridian brand |

---

## 11. Risk Register Summary

| Risk ID | Description | Prob. | Impact | Owner | Mitigation |
|---|---|---|---|---|---|
| RAID-001 | PCI-DSS tokenisation vendor not Level 1 certified at go-live | High | Critical | Meridian Bank | Fallback to Adyen or Braintree; board decision required by Jul 15 |
| RAID-004 | iOS OAuth session bug (401 after 14 min) blocking Sprint 8 | High (active) | High | Slalom | Auth0 support case open (case #0083412); clock-skew fix in Sprint 8 day 3 |
| RAID-005 | Apple App Store review delay (5–14 business days) | Medium | Medium | Slalom | Submit 21 days before D-003; expedited review request prepared |
| RAID-006 | Temenos T24 rate limit (200 req/min) constrains portal response time | Medium | High | Shared | Redis 30s cache; negotiate rate limit increase to 500 req/min with Meridian IT |
| RAID-007 | Key person dependency — Priya Sharma (iOS) | Low | High | Slalom | Pair programming on all biometric auth modules; James Okafor cross-training |
| RAID-008 | NCC Group unavailable until late September — zero remediation buffer | High | High | Shared | Alternative vendor (Cobalt / Bishop Fox) on standby; scope agreed by Jul 15 |
| RAID-009 | LDAP migration to Auth0 takes longer than 90-day window | Medium | Medium | Meridian IT | Parallel-run LDAP federation; rollback plan if migration incomplete by May 30 |

---

## 12. Change Management

### 12.1 Change Request Process

1. Either party initiates a Change Request (CR) using the SDP Change Request form
2. Requesting party documents: description, business reason, scope/timeline/budget impact, risk assessment
3. Slalom delivers impact assessment within **5 business days**
4. Steering Committee approval required for CRs with budget impact > $25,000 or timeline impact > 5 business days
5. No change work commences without a CR signed by both parties
6. All CRs logged in SDP RAID register and reflected in the project baseline

### 12.2 Scope Boundary

Requirements not explicitly enumerated in Section 4 are out of scope. Implicit requirements discovered during delivery must be raised as a CR within 3 business days. Slalom shall not bear responsibility for schedule impacts caused by undisclosed requirements.

---

## 13. Intellectual Property & Licensing

- **Bespoke deliverables** — all code, configurations, architecture documents, test plans, and runbooks produced exclusively for this engagement vest in Meridian Bank upon receipt of the corresponding milestone payment
- **Slalom IP** — pre-existing frameworks, accelerators, and proprietary methodologies remain Slalom's property; Meridian Bank receives a perpetual, non-exclusive, royalty-free licence to use them as embedded in the deliverables
- **Third-party components** — Auth0, BioCatch, NCC Group, HashiCorp Vault, Temenos T24 connectors are governed by their respective vendor licences; Meridian Bank is responsible for maintaining those licences post-engagement
- **Open-source components** — all OSS used in the platform must be Apache 2.0, MIT, or BSD licensed; GPL-licensed components require Steering Committee approval before inclusion

---

## 14. Confidentiality & Data Protection

- Both parties shall protect the other's proprietary information under the terms of MSA-SLM-MBK-2023-007; disclosure to third parties requires prior written consent
- Slalom personnel shall not access Meridian Bank customer personal data except where strictly necessary for testing, in which case synthetic or fully anonymised data must be used
- Any accidental access to live customer data must be reported to the Meridian Bank Data Protection Officer within **24 hours** and logged in the RAID register
- Slalom shall comply with UK GDPR, the Data Protection Act 2018, and Meridian Bank's Information Security Policy throughout the engagement
- All Slalom personnel on this engagement shall complete Meridian Bank's mandatory security awareness training within 5 business days of onboarding

---

## 15. Warranties, Liability & Termination

### Warranties

- Slalom warrants services will be performed with reasonable professional care and skill by appropriately qualified personnel
- Deliverables are warranted to conform to their documented acceptance criteria for **90 days** post-acceptance; defects reported within this window will be remediated at no additional charge

### Limitation of Liability

- Slalom's total aggregate liability shall not exceed fees paid by Client in the 12 months preceding the claim
- Neither party shall be liable for indirect, consequential, or punitive damages

### Termination

- **Convenience:** Either party may terminate with 30 business days' written notice; Client pays for all work and expenses incurred to the effective date
- **Cause:** Either party may terminate immediately for material breach not remedied within 15 business days of written notice
- On termination: Slalom delivers all work-in-progress materials and transfers access credentials within 10 business days

---

## 16. Signatories

By signing below, the parties agree to be bound by this Statement of Work and the Master Services Agreement referenced herein.

| Party | Name | Title | Signature | Date |
|---|---|---|---|---|
| Meridian Bank PLC | Diana Foster | VP Digital Banking | D. Foster | February 1, 2024 |
| Meridian Bank PLC | Jonathan Hale | Chief Financial Officer | J. Hale | February 1, 2024 |
| Meridian Bank PLC | Richard Osei | Chief Information Security Officer | R. Osei | February 1, 2024 |
| Slalom Consulting | Alex Rivera | Program Manager | A. Rivera | January 31, 2024 |
| Slalom Consulting | Rachel Kim | Client Partner | R. Kim | January 31, 2024 |

---

_SOW Reference: SLM-MBK-2024-SOW-002 — Digital Banking Platform · Version 1.0 · Effective February 1, 2024_  
_This document is subject to the Master Services Agreement MSA-SLM-MBK-2023-007._
