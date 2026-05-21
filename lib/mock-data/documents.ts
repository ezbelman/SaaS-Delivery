import type { ProjectDocument } from "@/lib/types"

const CHARTER_HTML = `<h1>Project Charter</h1>
<h2>Meridian Bank — Digital Banking Transformation</h2>
<p><strong>Document ID:</strong> MBK-CHARTER-2024-001 &nbsp;·&nbsp; <strong>Version:</strong> 2.0 &nbsp;·&nbsp; <strong>Status:</strong> Approved &nbsp;·&nbsp; <strong>Date:</strong> January 18, 2024</p>
<hr>
<h2>1. Executive Summary</h2>
<p>This Project Charter authorises the initiation of the <strong>Meridian Bank Digital Banking Transformation</strong> programme. Slalom Consulting has been engaged to modernise Meridian Bank's digital channels across mobile, web, and open banking APIs, delivering a modern, secure, and regulatory-compliant digital banking experience to retail customers.</p>
<h2>2. Business Case</h2>
<p>Meridian Bank's current digital channels suffer from high abandonment rates (63% mobile app dropout at login), lack of biometric authentication, and zero open banking capability — blocking fintech partnership revenue. This programme addresses all three gaps under a single Agile delivery umbrella.</p>
<h2>3. Objectives</h2>
<ul>
<li>Ship a refreshed iOS and Android mobile banking app with biometric authentication and instant payments by <strong>July 31, 2024</strong></li>
<li>Re-platform the online banking portal with PCI-DSS compliance hardening and multi-factor authentication by <strong>October 1, 2024</strong></li>
<li>Launch a PSD2-compliant Open Banking API Gateway enabling third-party fintech integrations by <strong>December 1, 2024</strong></li>
</ul>
<h2>4. Scope</h2>
<h3>In Scope</h3>
<ul>
<li>Mobile Banking App (iOS + Android): biometric login, instant payments, FCM/APNs push notifications</li>
<li>Online Banking Portal: account dashboard, transaction history, payee management, MFA (TOTP/SMS)</li>
<li>Open Banking API Gateway: PSD2 PIS/AIS endpoints, Auth0 OIDC, Temenos T24 integration</li>
<li>Security &amp; Compliance: PCI-DSS gap assessment, OWASP penetration test (NCC Group)</li>
</ul>
<h3>Out of Scope</h3>
<ul>
<li>Core banking system (Temenos T24) modernisation</li>
<li>Business banking / SME product lines</li>
<li>Physical branch technology</li>
<li>Customer onboarding / KYC flows</li>
</ul>
<h2>5. Budget &amp; Timeline</h2>
<table>
<tr><th>Phase</th><th>Stream</th><th>Budget</th><th>Target Date</th></tr>
<tr><td>Phase 1</td><td>Mobile Banking App</td><td>$1.8M</td><td>July 31, 2024</td></tr>
<tr><td>Phase 2</td><td>Online Banking Portal</td><td>$2.2M</td><td>October 1, 2024</td></tr>
<tr><td>Phase 3</td><td>Open Banking API Gateway</td><td>$1.8M</td><td>December 1, 2024</td></tr>
<tr><td><strong>Total</strong></td><td></td><td><strong>$5.8M</strong></td><td><strong>December 1, 2024</strong></td></tr>
</table>
<h2>6. Key Stakeholders</h2>
<table>
<tr><th>Name</th><th>Role</th><th>Organisation</th><th>Responsibility</th></tr>
<tr><td>Diana Foster</td><td>VP Digital Banking</td><td>Meridian Bank</td><td>Executive Sponsor</td></tr>
<tr><td>Alex Rivera</td><td>Program Manager</td><td>Slalom Consulting</td><td>Programme Delivery</td></tr>
<tr><td>Sarah Mitchell</td><td>Project Manager</td><td>Slalom Consulting</td><td>Banking Transformation Lead</td></tr>
<tr><td>Marcus Johnson</td><td>Scrum Master</td><td>Slalom Consulting</td><td>Agile Delivery</td></tr>
<tr><td>Priya Sharma</td><td>iOS Lead</td><td>Slalom Consulting</td><td>Mobile Engineering</td></tr>
<tr><td>Tom Bradley</td><td>Business Analyst</td><td>Slalom Consulting</td><td>Product Owner, Analysis</td></tr>
</table>
<h2>7. Success Criteria</h2>
<ul>
<li>Mobile app available on TestFlight and Firebase App Distribution by July 31, 2024</li>
<li>Online portal passing OWASP ASVS Level 2 penetration test before go-live</li>
<li>Open Banking API processing at least one successful PSD2 PIS transaction in UAT by November 30, 2024</li>
<li>Internal staff NPS ≥ 40 from mobile beta programme</li>
<li>Zero PCI-DSS Level 1 certification gaps at Phase 2 go-live</li>
</ul>
<h2>8. Key Risks</h2>
<ul>
<li><strong>PCI-DSS tokenisation vendor</strong> must achieve Level 1 certification before Phase 1 go-live (currently unresolved — escalated)</li>
<li><strong>PSD2 sandbox credentials</strong> required from Meridian IT by June 28, 2024 to enable Sprint 9 development</li>
<li><strong>Key man dependency</strong>: Priya Sharma holds iOS LocalAuthentication expertise — mitigation plan required</li>
<li><strong>App Store review lead time</strong>: Apple historically 5–14 business days for biometric permission changes</li>
</ul>
<h2>9. Approval</h2>
<table>
<tr><th>Name</th><th>Role</th><th>Date</th></tr>
<tr><td>Diana Foster</td><td>Executive Sponsor, Meridian Bank</td><td>January 18, 2024</td></tr>
<tr><td>Alex Rivera</td><td>Program Manager, Slalom Consulting</td><td>January 15, 2024</td></tr>
<tr><td>CTO, Meridian Bank</td><td>Technology Sponsor</td><td>January 18, 2024</td></tr>
</table>`

const SOW_HTML = `<h1>Statement of Work</h1>
<h2>Slalom Consulting × Meridian Bank</h2>
<h2>Digital Banking Transformation Programme</h2>
<p><strong>SOW ID:</strong> SLM-MBK-2024-SOW-001 &nbsp;·&nbsp; <strong>Version:</strong> 2.0 &nbsp;·&nbsp; <strong>Status:</strong> Approved &nbsp;·&nbsp; <strong>Effective Date:</strong> February 1, 2024 &nbsp;·&nbsp; <strong>Expiry:</strong> December 31, 2024</p>
<p><strong>Master Services Agreement Ref:</strong> MSA-SLM-MBK-2023-007 &nbsp;·&nbsp; <strong>Prepared by:</strong> Alex Rivera, Program Manager, Slalom Consulting &nbsp;·&nbsp; <strong>Approved by:</strong> Diana Foster, VP Digital Banking, Meridian Bank</p>
<hr>
<h2>1. Executive Summary</h2>
<p>This Statement of Work ("SOW") governs the delivery of the <strong>Meridian Bank Digital Banking Transformation Programme</strong> by Slalom Consulting ("Slalom") on behalf of Meridian Bank PLC ("Client"). The programme is an 18-month, three-phase modernisation of Meridian Bank's retail digital channels — native mobile banking apps, an online banking portal, and a PSD2-compliant Open Banking API Gateway — with a total contract value of <strong>USD $5,800,000</strong>.</p>
<p>This document supersedes SOW version 1.2 dated January 30, 2024 and incorporates scope refinements agreed at the February 15, 2024 programme governance review. All prior versions are void upon execution of this version.</p>
<hr>
<h2>2. Background &amp; Business Context</h2>
<p>Meridian Bank is a mid-tier UK retail bank with 2.3 million active current account customers. The bank's current digital estate is characterised by:</p>
<ul>
<li>A mobile banking application (iOS and Android) with a 63% login abandonment rate, no biometric authentication, and no real-time payment capability</li>
<li>An online banking portal built on a legacy Java monolith with no multi-factor authentication and no PCI-DSS Level 1 certification</li>
<li>Zero open banking capability, blocking entry into the UK fintech partnership market and creating exposure to PSD2 regulatory non-compliance penalties (up to 4% of annual global turnover)</li>
</ul>
<p>The transformation programme addresses all three gaps under a single Agile delivery model, operating under the governance structures defined in the Project Charter (MBK-CHARTER-2024-001).</p>
<hr>
<h2>3. Scope of Services</h2>
<h3>3.1 Stream 1 — Mobile Banking Application (Phase 1)</h3>
<p><strong>Objective:</strong> Deliver a fully modernised native mobile banking experience for iOS and Android with biometric authentication, instant payments, and real-time push notifications.</p>
<h4>3.1.1 iOS Application</h4>
<ul>
<li>Full UI/UX refactor using <strong>SwiftUI</strong> (Swift 5.9), replacing legacy UIKit screens</li>
<li>Biometric authentication: Face ID and Touch ID via <strong>LocalAuthentication API</strong> with PIN fallback and 30-minute inactivity session timeout</li>
<li>Continuous authentication layer: <strong>BioCatch SDK</strong> integration for behavioural biometrics</li>
<li>Instant payments: Faster Payments-compatible transfer flow with IBAN validation (GB format), £10,000 single / £25,000 daily limits, real-time confirmation (&lt; 2s)</li>
<li>Push notifications: <strong>APNs (Apple Push Notification service)</strong> integration with silent and alert notification types</li>
<li>Certificate pinning on all URLSession connections</li>
<li>TestFlight beta distribution pipeline; App Store production submission including Apple App Privacy declaration</li>
</ul>
<h4>3.1.2 Android Application</h4>
<ul>
<li>Full UI rebuild using <strong>Jetpack Compose</strong> (Kotlin 1.9)</li>
<li>Biometric authentication: <strong>BiometricPrompt API</strong> (fingerprint, face, device credential fallback)</li>
<li>Continuous authentication: <strong>BioCatch SDK</strong> for Android</li>
<li>Instant payments: mirror of iOS payment flow with Android-specific UX conventions</li>
<li>Push notifications: <strong>Firebase Cloud Messaging (FCM)</strong>, Data and Notification message types</li>
<li>Certificate pinning via OkHttp 4 CertificatePinner</li>
<li>Firebase App Distribution beta pipeline; Google Play production submission including Data Safety declaration</li>
</ul>
<h4>3.1.3 Mobile Shared Services</h4>
<ul>
<li>Auth0 OIDC token integration (access token + refresh token with rotation) shared with portal</li>
<li>Step-up re-authentication for transactions &gt; £1,000</li>
<li>Crash reporting: Firebase Crashlytics with alerting threshold ≤ 0.5% crash-free session rate</li>
<li>Analytics: Firebase Analytics (anonymised; GDPR consent gate)</li>
</ul>
<h3>3.2 Stream 2 — Online Banking Portal (Phase 2)</h3>
<p><strong>Objective:</strong> Re-platform the online banking portal as a modern, PCI-DSS Level 1 certified, WCAG 2.1 AA-compliant web application with multi-factor authentication.</p>
<ul>
<li><strong>Frontend:</strong> Next.js 14 (App Router), TypeScript 5, Tailwind CSS — server-side rendered for SEO and performance</li>
<li><strong>Authentication:</strong> Auth0 SDK with OIDC/PKCE; TOTP (RFC 6238) as primary MFA factor; SMS OTP via Twilio as fallback (max 3 attempts/session); LDAP federation during 90-day migration window</li>
<li><strong>Account dashboard:</strong> Real-time balance (30s Redis cache against Temenos T24 rate limit of 200 req/min), available balance, 5 pending transactions, 30-day spend trend chart (category breakdown)</li>
<li><strong>Transaction history:</strong> Paginated, server-side filtered by date, amount range, and category; CSV and PDF statement export</li>
<li><strong>Payee management:</strong> Add/edit/delete payees with confirmation flow and duplicate detection</li>
<li><strong>Security hardening:</strong> PCI-DSS gap assessment (Coalfire), tokenisation via Vault (Level 1 certified vendor); OWASP ASVS Level 2 target; CSP, HSTS, SameSite cookies, CSRF tokens, rate limiting on all auth endpoints</li>
<li><strong>Accessibility:</strong> WCAG 2.1 AA audit and remediation (axe-core automated + manual screen-reader testing)</li>
<li><strong>Infrastructure:</strong> AWS ECS Fargate (EU-West-2), CloudFront CDN, Aurora PostgreSQL 15, ElastiCache Redis 7, AWS Secrets Manager</li>
</ul>
<h3>3.3 Stream 3 — Open Banking API Gateway (Phase 3)</h3>
<p><strong>Objective:</strong> Deliver a PSD2-compliant Open Banking API Gateway enabling authorised Third-Party Providers (TPPs) to initiate payments and access account information on behalf of Meridian Bank customers.</p>
<ul>
<li><strong>PSD2 compliance scope:</strong> Berlin Group NextGenPSD2 v1.3 — Payment Initiation Service (PIS), Account Information Service (AIS), Funds Confirmation Service (FCS)</li>
<li><strong>Consent management:</strong> Customer consent grant/revocation UI (90-day expiry, 7-day advance notification), EBA-compliant consent scopes (account_info, payment_initiation, funds_confirmation)</li>
<li><strong>TPP authorisation:</strong> Auth0 Machine-to-Machine with MTLS certificate validation for all TPP API calls; eIDAS certificate validation</li>
<li><strong>API runtime:</strong> Node.js 20 / Fastify; OpenAPI 3.1 specification; Redis-backed sliding-window rate limiting (1,000 req/min per TPP)</li>
<li><strong>Temenos T24 integration:</strong> Payment instruction forwarding, account data proxy, gateway configuration and sandbox testing</li>
<li><strong>Developer portal:</strong> Swagger UI, sandbox environment, TPP onboarding documentation</li>
<li><strong>Penetration test coordination:</strong> NCC Group OWASP ASVS Level 2 full-scope assessment of API Gateway and portal</li>
</ul>
<h3>3.4 Cross-Cutting Services</h3>
<h4>3.4.1 DevOps &amp; Infrastructure</h4>
<ul>
<li>Infrastructure as Code: <strong>Terraform</strong> modules for all AWS resources (ECS, Aurora, ElastiCache, CloudFront, Secrets Manager, IAM)</li>
<li>CI/CD pipelines: <strong>GitHub Actions</strong> — lint, unit tests, type-check, SAST (SonarQube blocking at CVSS &gt; 7.0), Docker build, ECS deploy (blue/green)</li>
<li>Monitoring: <strong>Datadog APM</strong> — SLO dashboards (p95 latency ≤ 800ms, availability ≥ 99.9%), alerting, runbook links</li>
<li>Secrets rotation: AWS Secrets Manager automated 30-day rotation for Auth0 credentials and T24 API keys</li>
</ul>
<h4>3.4.2 Programme Management</h4>
<ul>
<li>Weekly status reporting (RAG summary, sprint velocity, RAID log updates) to Meridian Bank Steering Committee</li>
<li>Bi-weekly Steering Committee presentations</li>
<li>Sprint ceremonies: planning, daily stand-up, review, retrospective (2-week sprints, 12 sprints total)</li>
<li>RAID log maintenance, change request management, issue escalation to programme level</li>
<li>End-of-phase lessons learned and project close-out report</li>
</ul>
<hr>
<h2>4. Deliverables &amp; Acceptance Criteria</h2>
<table>
<tr><th>ID</th><th>Deliverable</th><th>Phase</th><th>Due Date</th><th>Owner</th><th>Acceptance Criteria</th></tr>
<tr><td>D-001</td><td>Inception &amp; Architecture Baseline</td><td>0</td><td>Feb 28, 2024</td><td>Alex Rivera</td><td>Architecture doc reviewed; Auth0 tenant provisioned; AWS accounts live; T24 read-replica access confirmed</td></tr>
<tr><td>D-002</td><td>Mobile App Beta (iOS + Android)</td><td>1</td><td>Jul 31, 2024</td><td>Priya Sharma</td><td>Biometric login functional on iOS 16+ and Android 12+; instant payment end-to-end in beta; crash rate &lt; 2% on TestFlight</td></tr>
<tr><td>D-003</td><td>Mobile App Production Release</td><td>1</td><td>Sep 15, 2024</td><td>Priya Sharma</td><td>Live on App Store and Google Play; crash rate ≤ 0.5%; 95th-percentile cold-start ≤ 3s on 4G; Apple / Google review approved</td></tr>
<tr><td>D-004</td><td>Security Assessment Report (Interim)</td><td>1</td><td>Sep 1, 2024</td><td>Sarah Mitchell</td><td>NCC Group OWASP ASVS Level 2 report delivered; all Critical findings remediated; High findings with remediation plan and target date</td></tr>
<tr><td>D-005</td><td>Online Banking Portal Go-Live</td><td>2</td><td>Oct 1, 2024</td><td>Sarah Mitchell</td><td>PCI-DSS Level 1 certification confirmed (Coalfire); OWASP ASVS Level 2 passed; MFA active for 100% of accounts; WCAG 2.1 AA audit clean</td></tr>
<tr><td>D-006</td><td>Open Banking API Gateway Launch</td><td>3</td><td>Dec 1, 2024</td><td>Tom Bradley</td><td>PSD2 PIS and AIS endpoints live; Auth0 M2M operational; at least one TPP integrated in production; eIDAS certificate validation active</td></tr>
<tr><td>D-007</td><td>Final Security Assessment Report</td><td>3</td><td>Dec 15, 2024</td><td>Sarah Mitchell</td><td>Full-scope NCC Group report covering all three streams; zero open Critical findings; programme sign-off by CISO</td></tr>
<tr><td>D-008</td><td>Programme Close-Out Report</td><td>All</td><td>Dec 31, 2024</td><td>Alex Rivera</td><td>Lessons learned, financial reconciliation, knowledge transfer documentation, handover to Meridian Bank operations team completed</td></tr>
</table>
<hr>
<h2>5. Staffing &amp; Resource Plan</h2>
<table>
<tr><th>Role</th><th>Name</th><th>Allocation</th><th>Phase 1 (Feb–Sep)</th><th>Phase 2 (Oct)</th><th>Phase 3 (Nov–Dec)</th><th>Day Rate (USD)</th></tr>
<tr><td>Program Manager</td><td>Alex Rivera</td><td>50%</td><td>✓</td><td>✓</td><td>✓</td><td>$2,400</td></tr>
<tr><td>Project Manager</td><td>Sarah Mitchell</td><td>100%</td><td>✓</td><td>✓</td><td>✓</td><td>$1,900</td></tr>
<tr><td>Scrum Master</td><td>Marcus Johnson</td><td>100%</td><td>✓</td><td>✓</td><td>✓</td><td>$1,600</td></tr>
<tr><td>iOS Lead Engineer</td><td>Priya Sharma</td><td>100%</td><td>✓</td><td>25%</td><td>—</td><td>$2,100</td></tr>
<tr><td>Android Engineer</td><td>James Okafor</td><td>100%</td><td>✓</td><td>25%</td><td>—</td><td>$1,900</td></tr>
<tr><td>Full-Stack Engineer</td><td>Elena Vasquez</td><td>100%</td><td>50%</td><td>✓</td><td>✓</td><td>$1,900</td></tr>
<tr><td>Business Analyst / PO</td><td>Tom Bradley</td><td>100%</td><td>✓</td><td>✓</td><td>✓</td><td>$1,700</td></tr>
<tr><td>DevOps Engineer</td><td>Ravi Patel</td><td>75%</td><td>✓</td><td>✓</td><td>✓</td><td>$1,800</td></tr>
<tr><td>QA Lead</td><td>Anya Kowalski</td><td>100%</td><td>Sprints 6–12</td><td>✓</td><td>✓</td><td>$1,500</td></tr>
<tr><td>Security Consultant</td><td>NCC Group (subcontract)</td><td>Fixed fee</td><td>Pen test Sep 2024</td><td>—</td><td>Final report Dec 2024</td><td>Fixed</td></tr>
</table>
<p><em>Slalom reserves the right to substitute named resources with personnel of equivalent or greater seniority, providing 10 business days' advance notice to the Client.</em></p>
<hr>
<h2>6. Sprint &amp; Delivery Cadence</h2>
<table>
<tr><th>Sprint</th><th>Dates</th><th>Stream Focus</th><th>Key Milestone</th></tr>
<tr><td>Sprint 1–2</td><td>Feb 1 – Feb 28, 2024</td><td>All — Inception</td><td>D-001: Architecture baseline; environments live</td></tr>
<tr><td>Sprint 3–4</td><td>Mar 1 – Mar 28, 2024</td><td>Mobile (Auth)</td><td>Biometric login prototype; Auth0 integrated</td></tr>
<tr><td>Sprint 5–6</td><td>Apr 1 – Apr 25, 2024</td><td>Mobile (Payments)</td><td>Instant payment flow (iOS + Android) in staging</td></tr>
<tr><td>Sprint 7–8</td><td>Apr 26 – May 23, 2024</td><td>Mobile (Hardening) / Portal start</td><td>Mobile beta candidate; Portal auth framework</td></tr>
<tr><td>Sprint 9–10</td><td>May 24 – Jun 20, 2024</td><td>Mobile (Beta prep) / Portal (Dashboard)</td><td>PSD2 sandbox credentials required by Jun 28</td></tr>
<tr><td>Sprint 11</td><td>Jun 21 – Jul 4, 2024</td><td>Mobile (App Store) / Portal (Transactions)</td><td>App Store submission</td></tr>
<tr><td>Sprint 12</td><td>Jul 5 – Jul 31, 2024</td><td>Mobile (Beta) / Portal (MFA)</td><td><strong>D-002: Mobile App Beta</strong></td></tr>
<tr><td>Sprint 13–14</td><td>Aug 1 – Aug 29, 2024</td><td>Portal (Security hardening)</td><td>PCI-DSS gap assessment complete</td></tr>
<tr><td>Sprint 15</td><td>Sep 1 – Sep 15, 2024</td><td>Mobile (Production) / Portal (Pen test)</td><td><strong>D-003: Mobile Production</strong> &amp; D-004: Security Report</td></tr>
<tr><td>Sprint 16</td><td>Sep 16 – Oct 1, 2024</td><td>Portal (Go-live)</td><td><strong>D-005: Portal Go-Live</strong></td></tr>
<tr><td>Sprint 17–18</td><td>Oct 2 – Oct 31, 2024</td><td>Open Banking (Consent + AIS)</td><td>TPP developer portal live</td></tr>
<tr><td>Sprint 19–20</td><td>Nov 1 – Nov 28, 2024</td><td>Open Banking (PIS + hardening)</td><td>First TPP integration in UAT</td></tr>
<tr><td>Sprint 21</td><td>Dec 1 – Dec 15, 2024</td><td>Open Banking (Go-live) / Close-out</td><td><strong>D-006: API Gateway</strong> &amp; D-007: Final Security Report</td></tr>
<tr><td>Close-out</td><td>Dec 16 – Dec 31, 2024</td><td>Programme closure</td><td><strong>D-008: Close-Out Report</strong></td></tr>
</table>
<hr>
<h2>7. Commercial Terms</h2>
<h3>7.1 Contract Structure</h3>
<p>The engagement combines a <strong>Time &amp; Materials (T&amp;M)</strong> component for ongoing sprint delivery with <strong>Fixed-Price Milestone Payments</strong> tied to key deliverables. The T&amp;M component is capped at the amounts specified per phase below.</p>
<h3>7.2 Phase Budget Breakdown</h3>
<table>
<tr><th>Phase</th><th>Stream</th><th>T&amp;M Budget</th><th>Fixed Milestone</th><th>Phase Total</th><th>Target Completion</th></tr>
<tr><td>Phase 0</td><td>Inception &amp; Architecture</td><td>$120,000</td><td>—</td><td>$120,000</td><td>Feb 28, 2024</td></tr>
<tr><td>Phase 1</td><td>Mobile Banking Application</td><td>$1,480,000</td><td>$800,000 (M1 — D-002)</td><td>$2,280,000</td><td>Sep 15, 2024</td></tr>
<tr><td>Phase 2</td><td>Online Banking Portal</td><td>$1,600,000</td><td>$1,200,000 (M2 — D-005)</td><td>$1,900,000</td><td>Oct 1, 2024</td></tr>
<tr><td>Phase 3</td><td>Open Banking API Gateway</td><td>$1,100,000</td><td>$800,000 (M3 — D-006)</td><td>$1,500,000</td><td>Dec 1, 2024</td></tr>
<tr><td>All</td><td>NCC Group Pen Test (subcontract)</td><td>—</td><td>$150,000 fixed</td><td>$150,000</td><td>Dec 15, 2024</td></tr>
<tr><td colspan="4"><strong>Total Contract Value</strong></td><td><strong>$5,950,000</strong></td><td><strong>Dec 31, 2024</strong></td></tr>
</table>
<p><em>Note: NCC Group subcontract valued at $150K fixed; included in total. T&amp;M budgets are ceilings — Slalom will invoice only for hours actually worked at agreed day rates.</em></p>
<h3>7.3 Milestone Payment Schedule</h3>
<table>
<tr><th>Milestone</th><th>Trigger Event</th><th>Amount</th><th>Invoice Date</th></tr>
<tr><td>M0 — Mobilisation</td><td>SOW execution &amp; project kick-off</td><td>$250,000</td><td>Feb 1, 2024</td></tr>
<tr><td>M1 — Mobile Beta</td><td>D-002 formally accepted by Client</td><td>$800,000</td><td>Within 5 days of D-002 acceptance</td></tr>
<tr><td>M2 — Portal Go-Live</td><td>D-005 formally accepted by Client</td><td>$1,200,000</td><td>Within 5 days of D-005 acceptance</td></tr>
<tr><td>M3 — API Gateway Launch</td><td>D-006 formally accepted by Client</td><td>$800,000</td><td>Within 5 days of D-006 acceptance</td></tr>
<tr><td>M4 — Programme Close-Out</td><td>D-008 formally accepted by Client</td><td>$150,000</td><td>Within 5 days of D-008 acceptance</td></tr>
</table>
<h3>7.4 T&amp;M Invoicing</h3>
<ul>
<li><strong>Frequency:</strong> Monthly in arrears; invoices submitted by the 5th of the following month</li>
<li><strong>Support:</strong> Timesheets approved by the Client's nominated contract manager by the 3rd of each month</li>
<li><strong>Payment terms:</strong> Net 30 from invoice date; late payments accrue interest at 2% per month</li>
<li><strong>Expenses:</strong> Reimbursable at cost (receipts required); pre-approval required for any single item &gt; $500; travel must follow Slalom travel policy</li>
<li><strong>Currency:</strong> All amounts in USD; invoiced in USD; Meridian Bank responsible for any FX conversion costs</li>
</ul>
<h3>7.5 Overrun Policy</h3>
<p>If a phase's T&amp;M budget is forecast to be exceeded by more than 10%, Slalom must notify the Client in writing at least 15 business days before the cap is reached. A Change Request must be approved before hours in excess of the cap are incurred. Slalom shall not invoice for hours incurred above the cap without a signed CR.</p>
<hr>
<h2>8. Project Governance</h2>
<h3>8.1 Governance Structure</h3>
<table>
<tr><th>Forum</th><th>Participants</th><th>Frequency</th><th>Purpose</th></tr>
<tr><td>Steering Committee</td><td>Diana Foster (Chair), Alex Rivera, CTO, CFO</td><td>Bi-weekly</td><td>Programme oversight, milestone acceptance, escalation</td></tr>
<tr><td>Programme Review</td><td>Alex Rivera, Sarah Mitchell, Tom Bradley</td><td>Weekly</td><td>RAG status, RAID review, dependency tracking</td></tr>
<tr><td>Sprint Review</td><td>Delivery team + Meridian Bank PO</td><td>Bi-weekly (end of sprint)</td><td>Demo completed stories; acceptance</td></tr>
<tr><td>Sprint Planning</td><td>Delivery team + Meridian Bank PO</td><td>Bi-weekly (start of sprint)</td><td>Backlog grooming and sprint commitment</td></tr>
<tr><td>Daily Stand-Up</td><td>Delivery team</td><td>Daily (09:00 GMT)</td><td>Progress, blockers, coordination</td></tr>
</table>
<h3>8.2 RACI Matrix</h3>
<table>
<tr><th>Activity</th><th>Slalom PM</th><th>Slalom Team</th><th>Meridian PO</th><th>Meridian IT</th><th>Steering Cttee</th></tr>
<tr><td>Sprint planning &amp; execution</td><td>A</td><td>R</td><td>C</td><td>I</td><td>I</td></tr>
<tr><td>Backlog prioritisation</td><td>C</td><td>I</td><td>R/A</td><td>I</td><td>I</td></tr>
<tr><td>Environment provisioning</td><td>R</td><td>R</td><td>—</td><td>A</td><td>I</td></tr>
<tr><td>Deliverable acceptance</td><td>R</td><td>C</td><td>A</td><td>C</td><td>I</td></tr>
<tr><td>Change request approval</td><td>R</td><td>I</td><td>C</td><td>I</td><td>A</td></tr>
<tr><td>Risk escalation (&gt; programme level)</td><td>R</td><td>I</td><td>C</td><td>I</td><td>A</td></tr>
<tr><td>Budget approval (&gt; $50K)</td><td>C</td><td>—</td><td>—</td><td>—</td><td>A/R</td></tr>
<tr><td>Penetration test coordination</td><td>A</td><td>R</td><td>C</td><td>R</td><td>I</td></tr>
</table>
<p><em>R = Responsible · A = Accountable · C = Consulted · I = Informed</em></p>
<h3>8.3 Deliverable Acceptance Process</h3>
<ol>
<li>Slalom submits a Deliverable Acceptance Notice (DAN) to the Client's nominated contact</li>
<li>Client has <strong>10 business days</strong> to review and either accept or raise written defects</li>
<li>Slalom has <strong>10 business days</strong> to remediate raised defects</li>
<li>If no written response is received within 10 business days of DAN, the deliverable is deemed accepted</li>
<li>Milestone invoices are issued within 5 business days of formal acceptance</li>
</ol>
<hr>
<h2>9. Assumptions &amp; Client Dependencies</h2>
<table>
<tr><th>ID</th><th>Assumption / Dependency</th><th>Required By</th><th>Owner</th><th>Risk if Missed</th></tr>
<tr><td>A-001</td><td>Meridian Bank provides AWS account access and IAM baseline within 2 weeks of SOW execution</td><td>Feb 15, 2024</td><td>Meridian IT</td><td>Sprint 1–2 inception blocked; timeline impact</td></tr>
<tr><td>A-002</td><td>Temenos T24 API documentation and read-replica access provisioned</td><td>Feb 15, 2024</td><td>Meridian IT</td><td>Portal dashboard and payment flows cannot be developed</td></tr>
<tr><td>A-003</td><td>Auth0 tenant provisioned by Meridian IT or Slalom per agreed design</td><td>Mar 1, 2024</td><td>Slalom / Meridian IT</td><td>Authentication across all streams delayed</td></tr>
<tr><td>A-004</td><td>BioCatch SDK licensing (iOS + Android) executed and SDK access granted</td><td>Apr 1, 2024</td><td>Meridian Bank</td><td>Continuous authentication feature descoped to Phase 1.1</td></tr>
<tr><td>A-005</td><td>PSD2 sandbox credentials provisioned by Meridian IT</td><td>Jun 28, 2024</td><td>Meridian IT</td><td>Sprint 9 Open Banking development blocked; Phase 3 timeline at risk</td></tr>
<tr><td>A-006</td><td>NCC Group pen test window confirmed and scope agreed</td><td>Jul 15, 2024</td><td>Sarah Mitchell</td><td>D-004 Security Report and D-005 Portal go-live at risk</td></tr>
<tr><td>A-007</td><td>PCI-DSS tokenisation vendor achieves Level 1 certification (or alternative vendor selected)</td><td>Jul 15, 2024</td><td>Meridian Bank (escalated — RAID-001)</td><td>Phase 2 portal go-live blocked; Adyen / Braintree fallback adds 6-week integration</td></tr>
<tr><td>A-008</td><td>Meridian Bank assigns a dedicated Product Owner for sprint ceremonies (min. 50% allocation)</td><td>Feb 1, 2024</td><td>Meridian Bank</td><td>Backlog prioritisation delayed; sprint velocity reduced</td></tr>
<tr><td>A-009</td><td>App Store and Google Play developer accounts provisioned under Meridian Bank entity</td><td>Jun 1, 2024</td><td>Meridian Bank</td><td>Mobile production release cannot proceed under Meridian brand</td></tr>
</table>
<hr>
<h2>10. Risk Allocation</h2>
<table>
<tr><th>Risk</th><th>Probability</th><th>Impact</th><th>Allocated To</th><th>Mitigation</th></tr>
<tr><td>PCI-DSS vendor certification delay (RAID-001)</td><td>High</td><td>Critical</td><td>Meridian Bank</td><td>Fallback to Adyen or Braintree; decision required by Jul 15</td></tr>
<tr><td>Temenos T24 rate limit constrains portal performance</td><td>Medium</td><td>High</td><td>Shared</td><td>Redis 30s cache; negotiate limit increase from 200 to 500 req/min</td></tr>
<tr><td>Apple App Store review delay (5–14 days)</td><td>Medium</td><td>Medium</td><td>Slalom</td><td>Submit 3 weeks before D-003 deadline; prepare expedited review request</td></tr>
<tr><td>iOS OAuth session bug blocking Sprint 8 (RAID-004)</td><td>High (active)</td><td>High</td><td>Slalom</td><td>P1 investigation in progress; Auth0 support case open; clock-skew fix targeted Sprint 8 day 3</td></tr>
<tr><td>NCC Group pen test scheduling gap (RAID-008)</td><td>High</td><td>High</td><td>Shared</td><td>Schedule no later than Aug 1; zero buffer for M2 remediation — alternate pen test vendor on standby</td></tr>
<tr><td>Key person dependency — Priya Sharma (iOS)</td><td>Low</td><td>High</td><td>Slalom</td><td>Knowledge transfer to James Okafor ongoing; pair programming on biometric auth module</td></tr>
<tr><td>PSD2 sandbox credentials late from Meridian IT</td><td>Medium</td><td>High</td><td>Meridian Bank</td><td>Escalation path: Sarah Mitchell → Alex Rivera → Steering Committee</td></tr>
</table>
<hr>
<h2>11. Change Management</h2>
<h3>11.1 Change Request Process</h3>
<ol>
<li>Either party may initiate a Change Request (CR) using the standard CR form (Appendix A)</li>
<li>The requesting party documents: description of change, reason, impact on scope / timeline / budget, risk assessment</li>
<li>Slalom provides an impact assessment within <strong>5 business days</strong> of CR receipt</li>
<li>Steering Committee approval required for CRs with budget impact &gt; $25,000 or timeline impact &gt; 5 business days</li>
<li>No change work commences until the CR is signed by both parties</li>
<li>All CRs are logged in the project RAID register</li>
</ol>
<h3>11.2 Scope Creep Policy</h3>
<p>Features or requirements not explicitly enumerated in Section 3 of this SOW are out of scope. Discovery of implicit requirements during delivery shall be raised as a CR within 3 business days of identification. Slalom shall not be held responsible for delays caused by undisclosed requirements.</p>
<hr>
<h2>12. Intellectual Property</h2>
<ul>
<li><strong>Bespoke deliverables</strong> (code, architecture documents, test plans, configuration) produced specifically for Meridian Bank under this SOW vest in Meridian Bank upon full payment of the corresponding milestone invoice</li>
<li><strong>Slalom frameworks and accelerators</strong> (pre-existing tools, reusable components, proprietary methodologies) remain the property of Slalom Consulting; Client is granted a perpetual, non-exclusive, royalty-free licence to use them as embedded in the deliverables</li>
<li><strong>Third-party components</strong> (Auth0, BioCatch, NCC Group, Temenos T24 connectors) are subject to their respective vendors' licensing terms; Client is responsible for maintaining those licences post-engagement</li>
</ul>
<hr>
<h2>13. Confidentiality &amp; Data Protection</h2>
<ul>
<li>Both parties shall maintain the confidentiality of the other's proprietary information and may not disclose it to third parties without prior written consent, subject to the terms of the MSA (MSA-SLM-MBK-2023-007)</li>
<li>Slalom personnel shall not have access to Meridian Bank customer personal data except where strictly required for testing purposes, in which case synthetic or anonymised data must be used</li>
<li>Any accidental access to live customer data must be reported to the Client's Data Protection Officer within 24 hours</li>
<li>Slalom shall comply with UK GDPR and the Data Protection Act 2018 in all activities under this SOW</li>
</ul>
<hr>
<h2>14. Warranties &amp; Limitation of Liability</h2>
<ul>
<li>Slalom warrants that services will be performed with reasonable care and skill by appropriately qualified personnel</li>
<li>Deliverables are warranted to conform to their documented acceptance criteria for <strong>90 days</strong> post-acceptance; defects reported within this period will be remediated at no additional charge</li>
<li>Limitation of liability: Slalom's total aggregate liability under this SOW shall not exceed the total fees paid by Client in the 12 months preceding the claim</li>
<li>Neither party shall be liable for indirect, consequential, or punitive damages arising from this engagement</li>
</ul>
<hr>
<h2>15. Termination</h2>
<ul>
<li><strong>Termination for convenience:</strong> Either party may terminate with <strong>30 business days' written notice</strong>; Client shall pay for all work completed and expenses incurred to the termination effective date</li>
<li><strong>Termination for cause:</strong> Either party may terminate immediately if the other commits a material breach that is not remedied within 15 business days of written notice of breach</li>
<li>On termination, Slalom shall deliver all work-in-progress materials and transfer applicable access credentials to Client within 10 business days</li>
</ul>
<hr>
<h2>16. Signatures</h2>
<p>By signing below, the parties agree to be bound by the terms of this Statement of Work and the Master Services Agreement referenced herein.</p>
<table>
<tr><th>Party</th><th>Name</th><th>Title</th><th>Signature</th><th>Date</th></tr>
<tr><td>Meridian Bank PLC</td><td>Diana Foster</td><td>VP Digital Banking</td><td>D. Foster</td><td>January 30, 2024</td></tr>
<tr><td>Meridian Bank PLC</td><td>Jonathan Hale</td><td>Chief Financial Officer</td><td>J. Hale</td><td>January 30, 2024</td></tr>
<tr><td>Slalom Consulting</td><td>Alex Rivera</td><td>Program Manager</td><td>A. Rivera</td><td>January 30, 2024</td></tr>
<tr><td>Slalom Consulting</td><td>Rachel Kim</td><td>Client Partner</td><td>R. Kim</td><td>January 30, 2024</td></tr>
</table>
<p><em>This document was reviewed and approved at the Programme Governance Review on February 15, 2024. Version 2.0 supersedes all prior versions.</em></p>`

const SOW_PLATFORM_HTML = `<h1>Statement of Work</h1>
<h2>SOW — Digital Banking Platform</h2>
<h2>Slalom Consulting × Meridian Bank PLC</h2>
<p><strong>SOW Reference:</strong> SLM-MBK-2024-SOW-002 &nbsp;·&nbsp; <strong>Version:</strong> 1.0 &nbsp;·&nbsp; <strong>Status:</strong> Approved &nbsp;·&nbsp; <strong>Issue Date:</strong> February 1, 2024 &nbsp;·&nbsp; <strong>Programme End:</strong> December 31, 2024</p>
<p><strong>MSA Reference:</strong> MSA-SLM-MBK-2023-007 &nbsp;·&nbsp; <strong>Engagement Lead:</strong> Alex Rivera &nbsp;·&nbsp; <strong>Client Sponsor:</strong> Diana Foster, VP Digital Banking</p>
<hr>
<h2>Table of Contents</h2>
<ol>
<li>Executive Summary</li>
<li>Background &amp; Strategic Context</li>
<li>Programme Objectives &amp; Success Metrics</li>
<li>Scope of Services — Full Platform</li>
<li>Deliverables Schedule</li>
<li>Staffing &amp; Resource Plan</li>
<li>Sprint &amp; Delivery Cadence</li>
<li>Commercial Terms</li>
<li>Governance &amp; Reporting</li>
<li>Assumptions &amp; Client Dependencies</li>
<li>Risk Register Summary</li>
<li>Change Management</li>
<li>Intellectual Property &amp; Licensing</li>
<li>Confidentiality &amp; Data Protection</li>
<li>Warranties, Liability &amp; Termination</li>
<li>Signatories</li>
</ol>
<hr>
<h2>1. Executive Summary</h2>
<p>Slalom Consulting ("Slalom") is engaged by Meridian Bank PLC ("Meridian Bank" or "Client") to design, build, and deliver the <strong>Meridian Bank Digital Banking Platform</strong> — a comprehensive modernisation of the bank's retail digital estate spanning native mobile applications, a re-platformed online banking portal, and a PSD2-compliant Open Banking API Gateway.</p>
<p>The programme runs from <strong>February 1 to December 31, 2024</strong> (11 months, 21 sprints) and has a total contract value of <strong>USD $5,950,000</strong>. At completion, Meridian Bank will possess a fully certified, regulatory-compliant digital banking suite serving its 2.3 million retail customers across iOS, Android, and web channels, with open banking capability enabling fintech partner integrations under the PSD2 framework.</p>
<p>This Statement of Work is the primary commercial and technical contract governing the engagement and is subordinate to the Master Services Agreement (MSA-SLM-MBK-2023-007). All prior SOW versions are superseded on execution of this document.</p>
<hr>
<h2>2. Background &amp; Strategic Context</h2>
<h3>2.1 Current State</h3>
<p>Meridian Bank's digital channels are materially behind market peers on three dimensions:</p>
<table>
<tr><th>Dimension</th><th>Current State</th><th>Market Benchmark</th><th>Business Impact</th></tr>
<tr><td>Mobile authentication</td><td>Password + OTP only; no biometric</td><td>89% of UK banks offer Face ID / fingerprint</td><td>63% login abandonment rate; 18% app uninstall rate post-login</td></tr>
<tr><td>Web security</td><td>No MFA; no PCI-DSS Level 1 certification</td><td>MFA standard; PCI-DSS L1 required for card-present merchants</td><td>Regulatory exposure; blocked from card-processing contract renewal in Q3 2024</td></tr>
<tr><td>Open banking</td><td>No PSD2 capability</td><td>UK Open Banking mandate since Jan 2018</td><td>FCA enforcement risk; zero fintech partnership revenue</td></tr>
</table>
<h3>2.2 Strategic Drivers</h3>
<ul>
<li><strong>Regulatory compliance:</strong> PSD2 non-compliance exposes Meridian Bank to FCA fines of up to 4% of global annual turnover. PCI-DSS Level 1 certification is required to renew the card-processing contract expiring September 30, 2024</li>
<li><strong>Customer retention:</strong> NPS of 31 (below the 42 sector average); mobile app store rating of 2.8/5; active customer churn rate of 7.2% annually attributable to poor digital experience</li>
<li><strong>Revenue growth:</strong> Open banking enables revenue-sharing agreements with fintech partners (projected £4.2M incremental annual revenue by 2026 per Meridian Bank CFO model)</li>
<li><strong>Operational efficiency:</strong> Modernised stack reduces mobile maintenance cost by an estimated 40% vs the legacy UIKit/Java codebase (Meridian Bank internal estimate)</li>
</ul>
<h3>2.3 Programme Approach</h3>
<p>The programme uses <strong>Scaled Agile</strong> with three parallel workstreams converging at quarterly integration points. Two-week sprints with a shared Kanban workflow provide real-time delivery visibility. Meridian Bank Product Owners are embedded in ceremonies for continuous backlog alignment. The Slalom Delivery Platform (SDP) serves as the engagement command centre — all work items, RAID items, escalations, and sprint metrics are tracked within SDP throughout the engagement.</p>
<hr>
<h2>3. Programme Objectives &amp; Success Metrics</h2>
<table>
<tr><th>Objective</th><th>KPI</th><th>Baseline</th><th>Target</th><th>Measurement Date</th></tr>
<tr><td>Eliminate biometric authentication gap</td><td>Biometric login adoption rate</td><td>0%</td><td>≥ 60% within 90 days of launch</td><td>Dec 15, 2024</td></tr>
<tr><td>Reduce mobile login abandonment</td><td>Login completion rate</td><td>37%</td><td>≥ 75%</td><td>Dec 15, 2024</td></tr>
<tr><td>Achieve PCI-DSS Level 1 certification</td><td>Coalfire audit pass</td><td>Not certified</td><td>Certified before Oct 1, 2024</td><td>Oct 1, 2024</td></tr>
<tr><td>Pass OWASP penetration test</td><td>NCC Group ASVS Level 2</td><td>Not assessed</td><td>Zero Critical findings at go-live</td><td>Sep 15, 2024</td></tr>
<tr><td>Launch PSD2-compliant open banking</td><td>First TPP production transaction</td><td>None</td><td>≥ 1 TPP integrated in production</td><td>Dec 1, 2024</td></tr>
<tr><td>Improve app store ratings</td><td>App Store / Google Play rating</td><td>2.8 / 5</td><td>≥ 4.0 / 5 within 60 days of launch</td><td>Nov 15, 2024</td></tr>
<tr><td>Meet performance SLAs</td><td>p95 API latency; cold-start time</td><td>Unmeasured</td><td>p95 ≤ 800ms; cold start ≤ 3s on 4G</td><td>Oct 1, 2024</td></tr>
<tr><td>Achieve portal availability SLA</td><td>Monthly uptime</td><td>97.1% (measured)</td><td>≥ 99.9%</td><td>Dec 31, 2024</td></tr>
</table>
<hr>
<h2>4. Scope of Services — Full Platform</h2>
<h3>4.1 Stream 1 — Mobile Banking Application (Phase 1: Feb – Sep 2024)</h3>
<h4>4.1.1 iOS Application</h4>
<ul>
<li>Full UI/UX redesign using <strong>SwiftUI</strong> (Swift 5.9), replacing all UIKit screens</li>
<li>Biometric authentication: Face ID and Touch ID via <strong>LocalAuthentication API</strong>; PIN fallback; 30-minute inactivity timeout; background re-authentication gate</li>
<li>Behavioural biometrics: <strong>BioCatch SDK</strong> integration for continuous fraud detection</li>
<li>Instant payments: Faster Payments-compatible transfer (IBAN format: GB29NWBK…); £10,000 single / £25,000 daily limits; real-time confirmation ≤ 2 seconds; step-up re-auth for transactions &gt; £1,000</li>
<li>Push notifications: <strong>APNs</strong> — transaction alerts, login attempt notifications, silent refresh; background fetch for balance updates</li>
<li>Certificate pinning on all URLSession connections; App Transport Security (ATS) enforced</li>
<li>Crash reporting: Firebase Crashlytics; alert threshold ≤ 0.5% crash-free session rate</li>
<li>Submission pipeline: TestFlight beta → App Store (includes Apple App Privacy questionnaire completion)</li>
</ul>
<h4>4.1.2 Android Application</h4>
<ul>
<li>Full UI rebuild using <strong>Jetpack Compose</strong> (Kotlin 1.9); Material Design 3 tokens aligned to Meridian Bank brand</li>
<li>Biometric authentication: <strong>BiometricPrompt API</strong> — fingerprint, face unlock, device credential fallback; identical session logic to iOS</li>
<li>Behavioural biometrics: <strong>BioCatch SDK for Android</strong></li>
<li>Instant payments: mirrors iOS flow with Android-specific UX conventions (bottom sheets, gesture navigation)</li>
<li>Push notifications: <strong>Firebase Cloud Messaging (FCM)</strong> — Data and Notification message types; battery-optimised delivery via WorkManager</li>
<li>Certificate pinning: OkHttp 4 CertificatePinner; network security config</li>
<li>Submission pipeline: Firebase App Distribution beta → Google Play (includes Data Safety declaration)</li>
</ul>
<h4>4.1.3 Shared Mobile Services</h4>
<ul>
<li>Auth0 OIDC token integration (access token 15-min TTL; refresh token rotation) — shared identity plane with the portal</li>
<li>Firebase Analytics (anonymised; GDPR consent gate; UK ICO compliant)</li>
<li>Deeplink scheme: <code>meridianbank://</code> for notification tap-through routing</li>
</ul>
<h3>4.2 Stream 2 — Online Banking Portal (Phase 2: Aug – Oct 2024)</h3>
<ul>
<li><strong>Framework:</strong> Next.js 14 (App Router), TypeScript 5, Tailwind CSS — server-side rendered for SEO and Core Web Vitals (LCP &lt; 2.5s target)</li>
<li><strong>Authentication:</strong> Auth0 SDK (OIDC/PKCE); TOTP (RFC 6238) as primary MFA; SMS OTP via Twilio as fallback (max 3 attempts/session); LDAP federation during 90-day migration window; session cookie: HttpOnly, Secure, SameSite=Strict</li>
<li><strong>Account dashboard:</strong> Current balance, available balance, 5 pending transactions; 30-day spend trend by category; quick-action row (transfer, pay, statement)</li>
<li><strong>Balance data:</strong> ElastiCache Redis 30s TTL against Temenos T24 rate limit (200 req/min); write-through cache invalidation on payment completion</li>
<li><strong>Transaction history:</strong> Server-side paginated (20/page); filter by date range, amount, merchant category code; CSV and PDF export</li>
<li><strong>Payee management:</strong> Add/edit/delete with duplicate-payee detection and IBAN validation</li>
<li><strong>Security hardening:</strong> Content Security Policy (CSP) Level 2; HSTS with preload; CSRF tokens on all state-changing endpoints; rate limiting on auth routes (5 req/min); input sanitisation (DOMPurify); Coalfire PCI-DSS gap assessment and Level 1 certification</li>
<li><strong>Tokenisation:</strong> Vault by HashiCorp (PCI-DSS Level 1 certified vendor) for card number and CVV at rest</li>
<li><strong>Accessibility:</strong> WCAG 2.1 AA — axe-core automated testing in CI; manual screen reader audit (NVDA + VoiceOver)</li>
<li><strong>Infrastructure:</strong> AWS ECS Fargate (EU-West-2, Meridian Bank data residency); Aurora PostgreSQL 15; ElastiCache Redis 7; CloudFront CDN; AWS Secrets Manager (30-day automated rotation)</li>
</ul>
<h3>4.3 Stream 3 — Open Banking API Gateway (Phase 3: Oct – Dec 2024)</h3>
<ul>
<li><strong>PSD2 scope:</strong> Berlin Group NextGenPSD2 v1.3 — Payment Initiation Service (PIS), Account Information Service (AIS), Funds Confirmation Service (FCS)</li>
<li><strong>Consent management:</strong> Customer grant/revocation UI (90-day consent expiry; 7-day advance email notification); EBA-compliant consent scopes; consent audit log in Aurora PostgreSQL</li>
<li><strong>TPP authorisation:</strong> Auth0 Machine-to-Machine; eIDAS qualified certificate validation; MTLS for all TPP connections; TPP registration and onboarding workflow</li>
<li><strong>API runtime:</strong> Node.js 20 / Fastify; OpenAPI 3.1 specification published on developer portal; Redis sliding-window rate limiting (1,000 req/min per TPP); structured JSON logging (Datadog ingest)</li>
<li><strong>T24 integration:</strong> Payment instruction proxy to Temenos T24 Transact; read-replica for account information; sandbox environment for TPP testing</li>
<li><strong>Developer portal:</strong> Swagger UI; sandbox environment with synthetic test accounts; TPP onboarding documentation; API changelog</li>
</ul>
<h3>4.4 Cross-Cutting Services</h3>
<h4>4.4.1 Infrastructure &amp; DevOps</h4>
<ul>
<li><strong>Infrastructure as Code:</strong> Terraform modules for all AWS resources; state in S3 + DynamoDB lock; workspaces per environment (dev / staging / prod)</li>
<li><strong>CI/CD:</strong> GitHub Actions — lint, unit tests (Vitest / Jest / XCTest / JUnit), type-check, SAST (SonarQube; block at CVSS &gt; 7.0), Docker build &amp; scan (Trivy), ECS blue/green deploy</li>
<li><strong>Observability:</strong> Datadog APM — SLO dashboards (p95 latency ≤ 800ms; availability ≥ 99.9%); synthetic monitoring on critical user journeys; PagerDuty escalation</li>
<li><strong>Secrets management:</strong> AWS Secrets Manager; 30-day automated rotation; no secrets in environment variables or source code</li>
<li><strong>DR / backup:</strong> Aurora automated snapshots (7-day retention); cross-region replica in EU-West-1 for RTO ≤ 4h / RPO ≤ 1h</li>
</ul>
<h4>4.4.2 Security &amp; Compliance</h4>
<ul>
<li><strong>SAST:</strong> SonarQube integrated in CI — blocking threshold CVSS &gt; 7.0; weekly full scan reports to Security Lead</li>
<li><strong>DAST:</strong> OWASP ZAP in staging pipeline on every release candidate</li>
<li><strong>Penetration test:</strong> NCC Group — full-scope OWASP ASVS Level 2 assessment; scope: portal, API gateway, mobile apps; report to CISO by Sep 1, 2024 (interim) and Dec 15, 2024 (final)</li>
<li><strong>PCI-DSS:</strong> Coalfire gap assessment + Level 1 certification audit targeting Oct 1, 2024</li>
<li><strong>Bug bounty:</strong> Slalom to recommend HackerOne programme launch Q1 2025 (post go-live)</li>
</ul>
<h4>4.4.3 Programme Management</h4>
<ul>
<li>Weekly RAG status reports to Meridian Bank Steering Committee (5-minute read; RAID delta, velocity, budget burn)</li>
<li>Bi-weekly Steering Committee presentations (30 minutes; milestone progress, risk review, upcoming decisions)</li>
<li>Sprint ceremonies: planning, daily stand-up, review (demo), retrospective — 2-week cadence; 21 sprints total</li>
<li>RAID log maintained in SDP: all risks, assumptions, issues, decisions tracked with owner, probability, impact, and resolution plan</li>
<li>Change request log maintained in SDP; all approved CRs reflected in baseline schedule and budget</li>
<li>End-of-phase lessons learned workshop after each milestone; consolidated close-out report at D-008</li>
</ul>
<hr>
<h2>5. Deliverables Schedule</h2>
<table>
<tr><th>ID</th><th>Deliverable</th><th>Phase</th><th>Owner</th><th>Due Date</th><th>Acceptance Criteria</th></tr>
<tr><td>D-001</td><td>Inception &amp; Architecture Baseline</td><td>0</td><td>Alex Rivera</td><td>Feb 28, 2024</td><td>Architecture doc signed off; Auth0 tenant live; AWS accounts active; T24 read-replica confirmed; Terraform workspaces created</td></tr>
<tr><td>D-002</td><td>Mobile App Beta (iOS + Android)</td><td>1</td><td>Priya Sharma</td><td>Jul 31, 2024</td><td>Biometric login functional on iOS 16+ and Android 12+; instant payment end-to-end; crash rate &lt; 2% on TestFlight and Firebase</td></tr>
<tr><td>D-003</td><td>Mobile App Production Release</td><td>1</td><td>Priya Sharma</td><td>Sep 15, 2024</td><td>Live on App Store and Google Play; crash rate ≤ 0.5%; p95 cold-start ≤ 3s on 4G; App Store rating ≥ 3.5 at launch</td></tr>
<tr><td>D-004</td><td>Security Assessment Report (Interim)</td><td>1</td><td>Sarah Mitchell</td><td>Sep 1, 2024</td><td>NCC Group OWASP ASVS Level 2 report delivered; all Critical findings have accepted remediation plans; no open Critical findings</td></tr>
<tr><td>D-005</td><td>Online Banking Portal Go-Live</td><td>2</td><td>Sarah Mitchell</td><td>Oct 1, 2024</td><td>PCI-DSS Level 1 certified (Coalfire); OWASP ASVS Level 2 passed; MFA enabled on 100% of accounts; WCAG 2.1 AA audit clean; uptime monitoring active</td></tr>
<tr><td>D-006</td><td>Open Banking API Gateway Launch</td><td>3</td><td>Tom Bradley</td><td>Dec 1, 2024</td><td>PSD2 PIS and AIS endpoints in production; at least 1 TPP live; eIDAS cert validation active; rate limiting verified; developer portal published</td></tr>
<tr><td>D-007</td><td>Final Security Assessment Report</td><td>3</td><td>Sarah Mitchell</td><td>Dec 15, 2024</td><td>Full-scope NCC Group report (all 3 streams); zero open Critical findings; signed off by Meridian Bank CISO</td></tr>
<tr><td>D-008</td><td>Programme Close-Out Report</td><td>All</td><td>Alex Rivera</td><td>Dec 31, 2024</td><td>Lessons learned documented; financial reconciliation complete; knowledge transfer sessions conducted; all access credentials handed over; runbooks accepted by Meridian Bank operations</td></tr>
</table>
<hr>
<h2>6. Staffing &amp; Resource Plan</h2>
<table>
<tr><th>Role</th><th>Name</th><th>Grade</th><th>Ph.0</th><th>Ph.1 (Feb–Sep)</th><th>Ph.2 (Oct)</th><th>Ph.3 (Nov–Dec)</th><th>Day Rate (USD)</th></tr>
<tr><td>Program Manager</td><td>Alex Rivera</td><td>Principal</td><td>100%</td><td>50%</td><td>50%</td><td>50%</td><td>$2,400</td></tr>
<tr><td>Project Manager</td><td>Sarah Mitchell</td><td>Manager</td><td>100%</td><td>100%</td><td>100%</td><td>100%</td><td>$1,900</td></tr>
<tr><td>Scrum Master</td><td>Marcus Johnson</td><td>Consultant</td><td>50%</td><td>100%</td><td>100%</td><td>100%</td><td>$1,600</td></tr>
<tr><td>iOS Lead Engineer</td><td>Priya Sharma</td><td>Senior Consultant</td><td>100%</td><td>100%</td><td>25%</td><td>—</td><td>$2,100</td></tr>
<tr><td>Android Engineer</td><td>James Okafor</td><td>Consultant</td><td>50%</td><td>100%</td><td>25%</td><td>—</td><td>$1,900</td></tr>
<tr><td>Full-Stack Engineer</td><td>Elena Vasquez</td><td>Senior Consultant</td><td>50%</td><td>50%</td><td>100%</td><td>100%</td><td>$1,900</td></tr>
<tr><td>Business Analyst / PO</td><td>Tom Bradley</td><td>Consultant</td><td>100%</td><td>100%</td><td>100%</td><td>100%</td><td>$1,700</td></tr>
<tr><td>DevOps Engineer</td><td>Ravi Patel</td><td>Consultant</td><td>100%</td><td>75%</td><td>75%</td><td>75%</td><td>$1,800</td></tr>
<tr><td>QA Lead</td><td>Anya Kowalski</td><td>Consultant</td><td>—</td><td>Spr.6–12 100%</td><td>100%</td><td>100%</td><td>$1,500</td></tr>
<tr><td>Pen Test (subcontract)</td><td>NCC Group</td><td>Fixed fee</td><td>—</td><td>Sep 2024</td><td>—</td><td>Dec 2024</td><td>Fixed $150K</td></tr>
</table>
<p><em>Slalom may substitute named resources with personnel of equivalent or greater seniority upon 10 business days' advance written notice to the Client.</em></p>
<hr>
<h2>7. Sprint &amp; Delivery Cadence</h2>
<table>
<tr><th>Sprint</th><th>Dates</th><th>Focus</th><th>Milestone</th></tr>
<tr><td>Spr 1–2</td><td>Feb 1 – Feb 28</td><td>Inception: Auth0, AWS, T24 access, architecture</td><td>D-001 Architecture Baseline</td></tr>
<tr><td>Spr 3–4</td><td>Mar 1 – Mar 28</td><td>Mobile — biometric auth (iOS + Android)</td><td>Biometric prototype in staging</td></tr>
<tr><td>Spr 5–6</td><td>Apr 1 – Apr 25</td><td>Mobile — instant payments, push notifications</td><td>Payment flow end-to-end in staging</td></tr>
<tr><td>Spr 7–8</td><td>Apr 26 – May 23</td><td>Mobile — hardening, BioCatch, Crashlytics / Portal — Auth0 framework</td><td>Mobile beta candidate build</td></tr>
<tr><td>Spr 9–10</td><td>May 24 – Jun 20</td><td>Mobile — App Store prep / Portal — dashboard, transactions</td><td>PSD2 sandbox credentials due Jun 28</td></tr>
<tr><td>Spr 11</td><td>Jun 21 – Jul 4</td><td>Mobile — App Store submission / Portal — payee management</td><td>iOS + Android submitted to stores</td></tr>
<tr><td>Spr 12</td><td>Jul 5 – Jul 31</td><td>Mobile — beta / Portal — MFA</td><td>D-002 Mobile App Beta</td></tr>
<tr><td>Spr 13–14</td><td>Aug 1 – Aug 29</td><td>Portal — PCI-DSS hardening, Coalfire assessment, WCAG audit</td><td>PCI-DSS gap assessment complete</td></tr>
<tr><td>Spr 15</td><td>Sep 1 – Sep 15</td><td>Mobile — production release / NCC Group pen test</td><td>D-003 Mobile Production · D-004 Security Report</td></tr>
<tr><td>Spr 16</td><td>Sep 16 – Oct 1</td><td>Portal — go-live, final hardening</td><td>D-005 Portal Go-Live</td></tr>
<tr><td>Spr 17–18</td><td>Oct 2 – Oct 31</td><td>Open Banking — consent management, AIS endpoints, TPP portal</td><td>Developer portal live</td></tr>
<tr><td>Spr 19–20</td><td>Nov 1 – Nov 28</td><td>Open Banking — PIS endpoints, first TPP integration in UAT</td><td>First TPP UAT transaction</td></tr>
<tr><td>Spr 21</td><td>Dec 1 – Dec 15</td><td>Open Banking — go-live / NCC final report</td><td>D-006 API Gateway · D-007 Final Security Report</td></tr>
<tr><td>Close-out</td><td>Dec 16 – Dec 31</td><td>Knowledge transfer, handover, close-out report</td><td>D-008 Programme Close-Out</td></tr>
</table>
<hr>
<h2>8. Commercial Terms</h2>
<h3>8.1 Contract Structure &amp; Total Value</h3>
<table>
<tr><th>Phase</th><th>Stream</th><th>T&amp;M Ceiling</th><th>Fixed Milestone</th><th>Phase Total</th></tr>
<tr><td>Phase 0</td><td>Inception &amp; Architecture</td><td>$120,000</td><td>—</td><td>$120,000</td></tr>
<tr><td>Phase 1</td><td>Mobile Banking Application</td><td>$1,480,000</td><td>$800,000 at D-002</td><td>$2,280,000</td></tr>
<tr><td>Phase 2</td><td>Online Banking Portal</td><td>$700,000</td><td>$1,200,000 at D-005</td><td>$1,900,000</td></tr>
<tr><td>Phase 3</td><td>Open Banking API Gateway</td><td>$700,000</td><td>$800,000 at D-006</td><td>$1,500,000</td></tr>
<tr><td>All phases</td><td>NCC Group Penetration Test</td><td>—</td><td>$150,000 fixed</td><td>$150,000</td></tr>
<tr><td colspan="4"><strong>Total Contract Value</strong></td><td><strong>$5,950,000</strong></td></tr>
</table>
<h3>8.2 Milestone Payment Schedule</h3>
<table>
<tr><th>Milestone</th><th>Trigger</th><th>Amount</th><th>Invoice Timing</th></tr>
<tr><td>M0 — Mobilisation</td><td>SOW execution and kick-off</td><td>$250,000</td><td>Feb 1, 2024</td></tr>
<tr><td>M1 — Mobile Beta</td><td>Client acceptance of D-002</td><td>$800,000</td><td>Within 5 business days of acceptance</td></tr>
<tr><td>M2 — Portal Go-Live</td><td>Client acceptance of D-005</td><td>$1,200,000</td><td>Within 5 business days of acceptance</td></tr>
<tr><td>M3 — API Gateway</td><td>Client acceptance of D-006</td><td>$800,000</td><td>Within 5 business days of acceptance</td></tr>
<tr><td>M4 — Close-Out</td><td>Client acceptance of D-008</td><td>$150,000</td><td>Within 5 business days of acceptance</td></tr>
</table>
<h3>8.3 T&amp;M Billing</h3>
<ul>
<li><strong>Frequency:</strong> Monthly in arrears; invoices by the 5th of the following month</li>
<li><strong>Timesheets:</strong> Approved by Client contract manager by the 3rd of each month</li>
<li><strong>Payment terms:</strong> Net 30; late payments accrue interest at 2% per month</li>
<li><strong>Expenses:</strong> Reimbursable at cost; receipts required; pre-approval for any item &gt; $500</li>
<li><strong>Currency:</strong> USD; Meridian Bank bears FX conversion costs</li>
<li><strong>Overrun policy:</strong> Slalom must notify Client 15 business days before any phase T&amp;M ceiling is projected to be exceeded by &gt; 10%; a signed CR is required before incurring hours above the ceiling</li>
</ul>
<hr>
<h2>9. Governance &amp; Reporting</h2>
<table>
<tr><th>Forum</th><th>Participants</th><th>Frequency</th><th>Purpose</th></tr>
<tr><td>Steering Committee</td><td>Diana Foster (Chair), Alex Rivera, CTO, CFO</td><td>Bi-weekly</td><td>Milestone acceptance, programme health, escalation decisions</td></tr>
<tr><td>Programme Review</td><td>Alex Rivera, Sarah Mitchell, Tom Bradley, Meridian BA</td><td>Weekly</td><td>RAG status, RAID delta, dependency tracking, upcoming risks</td></tr>
<tr><td>Sprint Review</td><td>Delivery team, Meridian PO, selected stakeholders</td><td>End of each sprint</td><td>Demo of completed stories; acceptance confirmation</td></tr>
<tr><td>Sprint Planning</td><td>Delivery team + Meridian PO</td><td>Start of each sprint</td><td>Backlog grooming; sprint commitment</td></tr>
<tr><td>Daily Stand-Up</td><td>Delivery team</td><td>Daily 09:00 GMT</td><td>Progress, blockers, coordination</td></tr>
<tr><td>Security Review</td><td>Sarah Mitchell, Ravi Patel, Meridian CISO</td><td>Monthly</td><td>SAST report review; vulnerability triage; pen test coordination</td></tr>
</table>
<h3>Deliverable Acceptance Process</h3>
<ol>
<li>Slalom submits Deliverable Acceptance Notice (DAN) to Client nominated contact</li>
<li>Client has <strong>10 business days</strong> to accept or raise written defects</li>
<li>Slalom has <strong>10 business days</strong> to remediate raised defects</li>
<li>No written response within 10 business days = deemed accepted</li>
<li>Milestone invoice issued within 5 business days of formal acceptance</li>
</ol>
<hr>
<h2>10. Assumptions &amp; Client Dependencies</h2>
<table>
<tr><th>ID</th><th>Assumption / Dependency</th><th>Required By</th><th>Owner</th><th>Risk if Missed</th></tr>
<tr><td>A-001</td><td>AWS account access and IAM baseline provisioned</td><td>Feb 15, 2024</td><td>Meridian IT</td><td>Inception sprint blocked; programme start delayed</td></tr>
<tr><td>A-002</td><td>Temenos T24 API documentation and read-replica access</td><td>Feb 15, 2024</td><td>Meridian IT</td><td>Dashboard and payment flows cannot be developed in Phase 1</td></tr>
<tr><td>A-003</td><td>Auth0 tenant provisioned to agreed specification</td><td>Mar 1, 2024</td><td>Slalom / Meridian IT</td><td>Authentication across all streams delayed by ≥ 1 sprint</td></tr>
<tr><td>A-004</td><td>BioCatch SDK licensing executed (iOS + Android)</td><td>Apr 1, 2024</td><td>Meridian Bank</td><td>Continuous auth descoped; manual fraud review required</td></tr>
<tr><td>A-005</td><td>PSD2 sandbox credentials from Meridian IT</td><td>Jun 28, 2024</td><td>Meridian IT</td><td>Sprint 9 Open Banking development blocked; Phase 3 at risk</td></tr>
<tr><td>A-006</td><td>NCC Group pen test window confirmed and scope agreed</td><td>Jul 15, 2024</td><td>Sarah Mitchell</td><td>D-004 and D-005 at risk; fallback vendor required</td></tr>
<tr><td>A-007</td><td>PCI-DSS tokenisation vendor achieves Level 1 certification</td><td>Jul 15, 2024</td><td>Meridian Bank (RAID-001 escalated)</td><td>Phase 2 go-live blocked; Adyen / Braintree fallback adds 6 weeks</td></tr>
<tr><td>A-008</td><td>Meridian Bank Product Owner dedicated ≥ 50% to ceremonies</td><td>Feb 1, 2024</td><td>Meridian Bank</td><td>Backlog prioritisation delayed; sprint velocity reduced by est. 20%</td></tr>
<tr><td>A-009</td><td>App Store and Google Play developer accounts under Meridian entity</td><td>Jun 1, 2024</td><td>Meridian Bank</td><td>Mobile production release cannot proceed under Meridian brand</td></tr>
</table>
<hr>
<h2>11. Risk Register Summary</h2>
<table>
<tr><th>Risk ID</th><th>Description</th><th>Prob.</th><th>Impact</th><th>Owner</th><th>Mitigation</th></tr>
<tr><td>RAID-001</td><td>PCI-DSS tokenisation vendor not Level 1 certified at go-live</td><td>High</td><td>Critical</td><td>Meridian Bank</td><td>Fallback to Adyen or Braintree; board decision required by Jul 15</td></tr>
<tr><td>RAID-004</td><td>iOS OAuth session bug (401 after 14 min) blocking Sprint 8</td><td>High (active)</td><td>High</td><td>Slalom</td><td>Auth0 support case open (case #0083412); clock-skew fix in Sprint 8 day 3</td></tr>
<tr><td>RAID-005</td><td>Apple App Store review delay (5–14 business days)</td><td>Medium</td><td>Medium</td><td>Slalom</td><td>Submit 21 days before D-003; expedited review request prepared</td></tr>
<tr><td>RAID-006</td><td>Temenos T24 rate limit (200 req/min) constrains portal response time</td><td>Medium</td><td>High</td><td>Shared</td><td>Redis 30s cache; negotiate rate limit increase to 500 req/min with Meridian IT</td></tr>
<tr><td>RAID-007</td><td>Key person dependency — Priya Sharma (iOS)</td><td>Low</td><td>High</td><td>Slalom</td><td>Pair programming on all biometric auth modules; James Okafor cross-training</td></tr>
<tr><td>RAID-008</td><td>NCC Group unavailable until late September — zero remediation buffer</td><td>High</td><td>High</td><td>Shared</td><td>Alternative vendor (Cobalt / Bishop Fox) on standby; scope agreed by Jul 15</td></tr>
<tr><td>RAID-009</td><td>LDAP migration to Auth0 takes longer than 90-day window</td><td>Medium</td><td>Medium</td><td>Meridian IT</td><td>Parallel-run LDAP federation; rollback plan if migration incomplete by May 30</td></tr>
</table>
<hr>
<h2>12. Change Management</h2>
<h3>12.1 Change Request Process</h3>
<ol>
<li>Either party initiates a Change Request (CR) using the SDP Change Request form</li>
<li>Requesting party documents: description, business reason, scope/timeline/budget impact, risk assessment</li>
<li>Slalom delivers impact assessment within <strong>5 business days</strong></li>
<li>Steering Committee approval required for CRs with budget impact &gt; $25,000 or timeline impact &gt; 5 business days</li>
<li>No change work commences without a CR signed by both parties</li>
<li>All CRs logged in SDP RAID register and reflected in the project baseline</li>
</ol>
<h3>12.2 Scope Boundary</h3>
<p>Requirements not explicitly enumerated in Section 4 are out of scope. Implicit requirements discovered during delivery must be raised as a CR within 3 business days. Slalom shall not bear responsibility for schedule impacts caused by undisclosed requirements.</p>
<hr>
<h2>13. Intellectual Property &amp; Licensing</h2>
<ul>
<li><strong>Bespoke deliverables</strong> — all code, configurations, architecture documents, test plans, and runbooks produced exclusively for this engagement vest in Meridian Bank upon receipt of the corresponding milestone payment</li>
<li><strong>Slalom IP</strong> — pre-existing frameworks, accelerators, and proprietary methodologies remain Slalom's property; Meridian Bank receives a perpetual, non-exclusive, royalty-free licence to use them as embedded in the deliverables</li>
<li><strong>Third-party components</strong> — Auth0, BioCatch, NCC Group, HashiCorp Vault, Temenos T24 connectors are governed by their respective vendor licences; Meridian Bank is responsible for maintaining those licences post-engagement</li>
<li><strong>Open-source components</strong> — all OSS used in the platform must be Apache 2.0, MIT, or BSD licensed; GPL-licensed components require Steering Committee approval before inclusion</li>
</ul>
<hr>
<h2>14. Confidentiality &amp; Data Protection</h2>
<ul>
<li>Both parties shall protect the other's proprietary information under the terms of MSA-SLM-MBK-2023-007; disclosure to third parties requires prior written consent</li>
<li>Slalom personnel shall not access Meridian Bank customer personal data except where strictly necessary for testing, in which case synthetic or fully anonymised data must be used</li>
<li>Any accidental access to live customer data must be reported to the Meridian Bank Data Protection Officer within <strong>24 hours</strong> and logged in the RAID register</li>
<li>Slalom shall comply with UK GDPR, the Data Protection Act 2018, and Meridian Bank's Information Security Policy throughout the engagement</li>
<li>All Slalom personnel on this engagement shall complete Meridian Bank's mandatory security awareness training within 5 business days of onboarding</li>
</ul>
<hr>
<h2>15. Warranties, Liability &amp; Termination</h2>
<h3>Warranties</h3>
<ul>
<li>Slalom warrants services will be performed with reasonable professional care and skill by appropriately qualified personnel</li>
<li>Deliverables are warranted to conform to their documented acceptance criteria for <strong>90 days</strong> post-acceptance; defects reported within this window will be remediated at no additional charge</li>
</ul>
<h3>Limitation of Liability</h3>
<ul>
<li>Slalom's total aggregate liability shall not exceed fees paid by Client in the 12 months preceding the claim</li>
<li>Neither party shall be liable for indirect, consequential, or punitive damages</li>
</ul>
<h3>Termination</h3>
<ul>
<li><strong>Convenience:</strong> Either party may terminate with 30 business days' written notice; Client pays for all work and expenses incurred to the effective date</li>
<li><strong>Cause:</strong> Either party may terminate immediately for material breach not remedied within 15 business days of written notice</li>
<li>On termination: Slalom delivers all work-in-progress materials and transfers access credentials within 10 business days</li>
</ul>
<hr>
<h2>16. Signatories</h2>
<p>By signing below, the parties agree to be bound by this Statement of Work and the Master Services Agreement referenced herein. This document is effective on the date of the last signature.</p>
<table>
<tr><th>Party</th><th>Name</th><th>Title</th><th>Signature</th><th>Date</th></tr>
<tr><td>Meridian Bank PLC</td><td>Diana Foster</td><td>VP Digital Banking</td><td>D. Foster</td><td>February 1, 2024</td></tr>
<tr><td>Meridian Bank PLC</td><td>Jonathan Hale</td><td>Chief Financial Officer</td><td>J. Hale</td><td>February 1, 2024</td></tr>
<tr><td>Meridian Bank PLC</td><td>Richard Osei</td><td>Chief Information Security Officer</td><td>R. Osei</td><td>February 1, 2024</td></tr>
<tr><td>Slalom Consulting</td><td>Alex Rivera</td><td>Program Manager</td><td>A. Rivera</td><td>January 31, 2024</td></tr>
<tr><td>Slalom Consulting</td><td>Rachel Kim</td><td>Client Partner</td><td>R. Kim</td><td>January 31, 2024</td></tr>
</table>
<p><em>SOW Reference: SLM-MBK-2024-SOW-002 — Digital Banking Platform &nbsp;·&nbsp; Version 1.0 &nbsp;·&nbsp; Effective February 1, 2024</em></p>`

const PRD_HTML = `<h1>Product Requirements Document</h1>
<h2>Meridian Bank Digital Banking Platform — PRD v1.5</h2>
<p><strong>Status:</strong> In Review &nbsp;·&nbsp; <strong>Owner:</strong> Tom Bradley (Product Owner) &nbsp;·&nbsp; <strong>Last Updated:</strong> May 20, 2024</p>
<hr>
<h2>1. Product Overview</h2>
<p>The Meridian Bank Digital Banking Platform modernises the bank's retail customer experience across three digital channels: native mobile apps (iOS + Android), an online banking web portal, and an Open Banking API Gateway for third-party fintech integrations.</p>
<h2>2. User Personas</h2>
<h3>Persona A — Digital Native (Maya, 28)</h3>
<ul>
<li>Primary channel: mobile app</li>
<li>Goals: biometric login, instant payments, real-time notifications</li>
<li>Pain points: current app requires username/password + OTP every login; no payment tracking</li>
</ul>
<h3>Persona B — Desktop Banker (Robert, 52)</h3>
<ul>
<li>Primary channel: online banking portal</li>
<li>Goals: account overview, statement downloads, payee management</li>
<li>Pain points: portal is slow, no MFA, PDF statements buried in menus</li>
</ul>
<h3>Persona C — Fintech Developer (Aisha, 31)</h3>
<ul>
<li>Primary channel: Open Banking API</li>
<li>Goals: PSD2-compliant access to payment initiation and account data</li>
<li>Pain points: Meridian Bank has no open banking offering today</li>
</ul>
<h2>3. Feature Requirements</h2>
<h3>FR-001: Biometric Authentication</h3>
<p><strong>Priority:</strong> Critical &nbsp;·&nbsp; <strong>Stream:</strong> Mobile &nbsp;·&nbsp; <strong>Sprint:</strong> 8</p>
<ul>
<li>iOS: Face ID / Touch ID via LocalAuthentication API with fallback to PIN</li>
<li>Android: Fingerprint / PIN via BiometricPrompt API</li>
<li>Session: 30-minute inactivity timeout; background biometric re-auth</li>
<li>BioCatch behavioural biometric layer for continuous authentication</li>
</ul>
<h3>FR-002: Instant Payments</h3>
<p><strong>Priority:</strong> High &nbsp;·&nbsp; <strong>Stream:</strong> Mobile &nbsp;·&nbsp; <strong>Sprint:</strong> 9</p>
<ul>
<li>Faster Payments-compatible transfer with real-time confirmation (&lt; 2s)</li>
<li>IBAN-formatted payee entry with validation (format: GB29NWBK60161331926819)</li>
<li>Payment limits: £10,000 single transaction; £25,000 daily rolling</li>
<li>Push notification confirmation via FCM (Android) and APNs (iOS)</li>
</ul>
<h3>FR-003: Multi-Factor Authentication</h3>
<p><strong>Priority:</strong> Critical &nbsp;·&nbsp; <strong>Stream:</strong> Portal &nbsp;·&nbsp; <strong>Sprint:</strong> 8</p>
<ul>
<li>TOTP authenticator app (RFC 6238) as primary second factor</li>
<li>SMS OTP as fallback (max 3 attempts per session)</li>
<li>Delivered via Auth0; LDAP migration required before go-live</li>
<li>Step-up authentication for high-value transactions (&gt; £1,000)</li>
</ul>
<h3>FR-004: PSD2 Consent Management</h3>
<p><strong>Priority:</strong> High &nbsp;·&nbsp; <strong>Stream:</strong> Open Banking &nbsp;·&nbsp; <strong>Sprint:</strong> 9</p>
<ul>
<li>TPP authorisation flow with explicit customer consent grant/revocation UI</li>
<li>Consent records stored with expiry date; customer notified 7 days before expiry</li>
<li>EBA-compliant consent scope: account_info, payment_initiation, funds_confirmation</li>
<li>MTLS certificate validation for all TPP API calls</li>
</ul>
<h3>FR-005: Account Overview Dashboard</h3>
<p><strong>Priority:</strong> High &nbsp;·&nbsp; <strong>Stream:</strong> Portal &nbsp;·&nbsp; <strong>Status:</strong> Completed ✓</p>
<ul>
<li>Current balance, available balance, pending transactions</li>
<li>30-day spend trend chart (category breakdown)</li>
<li>Quick actions: transfer, pay bill, download statement</li>
<li>Real-time balance via 30s Redis cache (Temenos T24 rate limit: 200 req/min)</li>
</ul>
<h2>4. Non-Functional Requirements</h2>
<table>
<tr><th>Category</th><th>Requirement</th><th>Metric</th></tr>
<tr><td>Performance</td><td>Mobile app cold start</td><td>≤ 3 seconds on 4G</td></tr>
<tr><td>Performance</td><td>API response time (p95)</td><td>≤ 800ms</td></tr>
<tr><td>Availability</td><td>Portal and API uptime</td><td>99.9% monthly</td></tr>
<tr><td>Security</td><td>Penetration test standard</td><td>OWASP ASVS Level 2</td></tr>
<tr><td>Compliance</td><td>Payment data handling</td><td>PCI-DSS Level 1</td></tr>
<tr><td>Compliance</td><td>Open banking regulation</td><td>PSD2 (EU) compliant</td></tr>
<tr><td>Accessibility</td><td>Web portal standard</td><td>WCAG 2.1 AA</td></tr>
</table>
<h2>5. Out of Scope</h2>
<ul>
<li>Business / SME banking features</li>
<li>Loan origination or credit products</li>
<li>International SWIFT payments (Phase 2 roadmap)</li>
<li>Virtual card management</li>
<li>Customer onboarding / KYC flows</li>
</ul>`

const ARCH_HTML = `<h1>Technical Architecture Document</h1>
<h2>Meridian Bank Digital Banking Platform — v0.8 Draft</h2>
<p><strong>Author:</strong> Priya Sharma &nbsp;·&nbsp; <strong>Status:</strong> Draft — Pending Technical Review &nbsp;·&nbsp; <strong>Date:</strong> April 10, 2024</p>
<hr>
<h2>1. System Overview</h2>
<p>The Meridian Bank Digital Banking Platform consists of three principal systems: a Native Mobile Application layer (iOS + Android), a Web Portal (Next.js), and an Open Banking API Gateway. All three converge on a common authentication plane via <strong>Auth0 OIDC</strong> and communicate with the core banking system <strong>Temenos T24</strong> through a caching adapter layer.</p>
<h2>2. Technology Stack</h2>
<h3>Mobile (iOS)</h3>
<ul>
<li><strong>Language:</strong> Swift 5.9 / SwiftUI</li>
<li><strong>Auth:</strong> LocalAuthentication framework (Face ID / Touch ID); BioCatch SDK</li>
<li><strong>Push:</strong> APNs (Apple Push Notification service)</li>
<li><strong>Networking:</strong> URLSession with certificate pinning</li>
<li><strong>Distribution:</strong> TestFlight (beta) → App Store (production)</li>
</ul>
<h3>Mobile (Android)</h3>
<ul>
<li><strong>Language:</strong> Kotlin 1.9 / Jetpack Compose</li>
<li><strong>Auth:</strong> BiometricPrompt API; BioCatch SDK</li>
<li><strong>Push:</strong> Firebase Cloud Messaging (FCM)</li>
<li><strong>Networking:</strong> OkHttp 4 with certificate pinning</li>
<li><strong>Distribution:</strong> Firebase App Distribution (beta) → Google Play (production)</li>
</ul>
<h3>Web Portal</h3>
<ul>
<li><strong>Framework:</strong> Next.js 14 (App Router), TypeScript 5</li>
<li><strong>Auth:</strong> Auth0 SDK with OIDC / PKCE; MFA via TOTP and SMS OTP</li>
<li><strong>API:</strong> tRPC v10 for type-safe client-server calls</li>
<li><strong>Styling:</strong> Tailwind CSS</li>
</ul>
<h3>Open Banking API Gateway</h3>
<ul>
<li><strong>Runtime:</strong> Node.js 20 / Fastify</li>
<li><strong>Auth:</strong> Auth0 Machine-to-Machine; MTLS for TPP identity</li>
<li><strong>PSD2:</strong> Berlin Group NextGenPSD2 v1.3 specification</li>
<li><strong>Rate limiting:</strong> Redis-backed sliding window (1,000 req/min per TPP)</li>
</ul>
<h3>Infrastructure</h3>
<ul>
<li><strong>Cloud:</strong> AWS EU-West-2 (London — Meridian Bank data residency requirement)</li>
<li><strong>Compute:</strong> ECS Fargate (containerised services)</li>
<li><strong>Cache:</strong> ElastiCache Redis 7 (30s TTL for T24 account balance queries)</li>
<li><strong>Database:</strong> Aurora PostgreSQL 15 (consent records, audit logs)</li>
<li><strong>CDN:</strong> CloudFront (portal static assets)</li>
<li><strong>Secrets:</strong> AWS Secrets Manager (Auth0 credentials, T24 API keys)</li>
</ul>
<h2>3. Architecture Decision Records</h2>
<h3>ADR-001: Auth0 as Unified Identity Provider</h3>
<p><strong>Status:</strong> Accepted (RAID-009) &nbsp;·&nbsp; <strong>Date:</strong> February 5, 2024</p>
<p><strong>Decision:</strong> Replace Meridian Bank's legacy LDAP with Auth0 as the unified identity provider for all three digital channels. Auth0 will federate with LDAP during a 90-day migration window.</p>
<p><strong>Consequences:</strong> Enables OIDC token issuance, TOTP/SMS MFA, biometric passkeys, M2M credentials for the API Gateway. LDAP migration plan due June 30, 2024.</p>
<h3>ADR-002: Redis Caching for Temenos T24 Rate Limit</h3>
<p><strong>Status:</strong> Accepted &nbsp;·&nbsp; <strong>Date:</strong> March 1, 2024</p>
<p><strong>Decision:</strong> ElastiCache Redis with 30s TTL for account balance and transaction list queries. Write-through invalidation on payment completion. Parallel track: negotiate rate limit increase from 200 to 500 req/min with Meridian IT.</p>
<h3>ADR-003: Phased Mobile Release Strategy</h3>
<p><strong>Status:</strong> Accepted (RAID-005) &nbsp;·&nbsp; <strong>Date:</strong> May 5, 2024</p>
<p><strong>Decision:</strong> Two-phase mobile release — internal staff beta via TestFlight + Firebase App Distribution by July 31 (M1), followed by public App Store / Google Play release by September 15.</p>
<h3>ADR-004: PCI-DSS Tokenisation Vendor</h3>
<p><strong>Status:</strong> Open — Escalated (RAID-001) &nbsp;·&nbsp; <strong>Date:</strong> May 15, 2024</p>
<p><strong>Decision pending</strong> by July 15, 2024. Current vendor is not PCI-DSS Level 1 certified. Fallback options: Adyen or Braintree (both Level 1 certified; ~6-week integration estimate).</p>
<h2>4. Security Architecture</h2>
<ul>
<li><strong>Encryption in transit:</strong> TLS 1.3 minimum; certificate pinning on mobile apps</li>
<li><strong>Encryption at rest:</strong> AES-256 on Aurora PostgreSQL; KMS-managed keys</li>
<li><strong>API security:</strong> OAuth 2.0 Bearer tokens (15-min expiry); refresh token rotation</li>
<li><strong>Secrets:</strong> AWS Secrets Manager — no secrets in env vars or code</li>
<li><strong>SAST:</strong> SonarQube in CI pipeline (blocking threshold: CVSS &gt; 7.0)</li>
<li><strong>DAST:</strong> OWASP ZAP in staging; NCC Group full pen test scheduled September 2024</li>
</ul>
<h2>5. Open Issues</h2>
<ul>
<li><strong>iOS OAuth 2.0 session bug (RAID-004):</strong> Token refresh returns 401 after 14 min inactivity — suspected clock skew between Auth0 and API gateway. P1, blocking Sprint 8.</li>
<li><strong>PCI-DSS tokenisation gap (RAID-001):</strong> Vendor not yet Level 1 certified — escalated to Executive.</li>
<li><strong>Penetration test scheduling (RAID-008):</strong> NCC Group unavailable until late September — zero buffer for M2 go-live remediation.</li>
</ul>`

export const MOCK_DOCUMENTS: ProjectDocument[] = [
  {
    id:               "doc-001",
    projectId:        "prj-001",
    type:             "charter",
    title:            "Project Charter — Digital Banking Transformation",
    status:           "approved",
    content:          CHARTER_HTML,
    version:          "2.0",
    authorId:         "usr-001",
    reviewers:        ["usr-003", "usr-007"],
    approvedBy:       "usr-007",
    linkedWorkItems:  ["wi-001", "wi-010", "wi-030"],
    createdAt:        "2024-01-10T09:00:00Z",
    updatedAt:        "2024-01-18T14:30:00Z",
  },
  {
    id:               "doc-002",
    projectId:        "prj-001",
    type:             "sow",
    title:            "Statement of Work — SLM-MBK-2024-SOW-001 v2.0",
    status:           "approved",
    content:          SOW_HTML,
    version:          "2.0",
    authorId:         "usr-001",
    reviewers:        ["usr-003", "usr-006", "usr-007"],
    approvedBy:       "usr-007",
    linkedWorkItems:  ["wi-001", "wi-002", "wi-010", "wi-011", "wi-020", "wi-021", "wi-030", "wi-031", "wi-040", "wi-041"],
    createdAt:        "2024-01-20T10:00:00Z",
    updatedAt:        "2024-02-15T14:00:00Z",
  },
  {
    id:               "doc-003",
    projectId:        "prj-001",
    type:             "prd",
    title:            "Product Requirements Document — v1.5",
    status:           "review",
    content:          PRD_HTML,
    version:          "1.5",
    authorId:         "usr-006",
    reviewers:        ["usr-001", "usr-003", "usr-007"],
    linkedWorkItems:  ["wi-003", "wi-006", "wi-013", "wi-015", "wi-032", "wi-033"],
    createdAt:        "2024-02-05T09:00:00Z",
    updatedAt:        "2024-05-20T11:00:00Z",
  },
  {
    id:               "doc-004",
    projectId:        "prj-001",
    type:             "architecture",
    title:            "Technical Architecture Document — v0.8 Draft",
    status:           "draft",
    content:          ARCH_HTML,
    version:          "0.8",
    authorId:         "usr-005",
    reviewers:        ["usr-001"],
    linkedWorkItems:  ["wi-015", "wi-018", "wi-036", "wi-037"],
    createdAt:        "2024-03-01T09:00:00Z",
    updatedAt:        "2024-04-10T15:00:00Z",
  },
  {
    id:               "doc-005",
    projectId:        "prj-001",
    type:             "sow",
    title:            "SOW — Digital Banking Platform",
    status:           "approved",
    content:          SOW_PLATFORM_HTML,
    version:          "1.0",
    authorId:         "usr-001",
    reviewers:        ["usr-003", "usr-005", "usr-006", "usr-007"],
    approvedBy:       "usr-007",
    linkedWorkItems:  ["wi-001", "wi-002", "wi-003", "wi-010", "wi-011", "wi-020", "wi-021", "wi-030", "wi-031", "wi-035", "wi-040", "wi-041"],
    createdAt:        "2024-02-01T08:00:00Z",
    updatedAt:        "2024-02-01T16:00:00Z",
  },
]
