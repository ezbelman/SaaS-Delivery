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
]
