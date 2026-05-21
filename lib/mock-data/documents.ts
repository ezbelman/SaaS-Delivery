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
<h2>Slalom Consulting × Meridian Bank — Digital Banking Transformation</h2>
<p><strong>SOW ID:</strong> SLM-MBK-2024-SOW-001 &nbsp;·&nbsp; <strong>Version:</strong> 1.2 &nbsp;·&nbsp; <strong>Effective:</strong> February 1, 2024 &nbsp;·&nbsp; <strong>Expiry:</strong> December 31, 2024</p>
<hr>
<h2>1. Background</h2>
<p>Meridian Bank has engaged Slalom Consulting to deliver a comprehensive digital banking modernisation programme as defined in the Project Charter (MBK-CHARTER-2024-001). This SOW defines the specific services, deliverables, timeline, commercial terms, and mutual obligations governing the engagement.</p>
<h2>2. Services</h2>
<h3>Stream 1 — Mobile Banking Application</h3>
<ul>
<li>iOS refactor: biometric authentication (Face ID / Touch ID), instant payment UX, APNs push notifications, App Store submission</li>
<li>Android refactor: fingerprint/PIN redesign (BiometricPrompt), Firebase Cloud Messaging (FCM), Google Play release pipeline</li>
</ul>
<h3>Stream 2 — Online Banking Portal</h3>
<ul>
<li>Frontend modernisation: account overview, transaction history, payee management, PDF statement download</li>
<li>Security hardening: MFA (TOTP/SMS via Auth0), PCI-DSS gap assessment, OAuth 2.0 session management, tokenisation</li>
</ul>
<h3>Stream 3 — Open Banking API Gateway</h3>
<ul>
<li>PSD2 compliance: consent management flow, TPP authorisation, Payment Initiation Service (PIS), Account Information Service (AIS)</li>
<li>API infrastructure: Auth0 OIDC, rate limiting, Temenos T24 gateway configuration, NCC Group pen test coordination</li>
</ul>
<h2>3. Deliverables</h2>
<table>
<tr><th>ID</th><th>Deliverable</th><th>Phase</th><th>Due Date</th><th>Acceptance Criteria</th></tr>
<tr><td>D-001</td><td>Mobile App Beta (TestFlight + Firebase)</td><td>1</td><td>Jul 31, 2024</td><td>Biometric login and instant payment functional in beta</td></tr>
<tr><td>D-002</td><td>Mobile App Production Release</td><td>1</td><td>Sep 15, 2024</td><td>Live on App Store and Google Play; ≤ 0.5% crash rate</td></tr>
<tr><td>D-003</td><td>Online Banking Portal Go-Live</td><td>2</td><td>Oct 1, 2024</td><td>OWASP ASVS Level 2 passed; PCI-DSS Level 1 certified</td></tr>
<tr><td>D-004</td><td>Open Banking API Gateway Launch</td><td>3</td><td>Dec 1, 2024</td><td>PSD2 PIS/AIS live; Auth0 OIDC operational; first TPP integrated</td></tr>
<tr><td>D-005</td><td>Security Assessment Report</td><td>All</td><td>Sep 1, 2024</td><td>NCC Group OWASP ASVS Level 2 report with remediation plan</td></tr>
</table>
<h2>4. Staffing</h2>
<table>
<tr><th>Role</th><th>Name</th><th>Allocation</th><th>Duration</th></tr>
<tr><td>Program Manager</td><td>Alex Rivera</td><td>50%</td><td>Feb – Dec 2024</td></tr>
<tr><td>Project Manager</td><td>Sarah Mitchell</td><td>100%</td><td>Feb – Dec 2024</td></tr>
<tr><td>Scrum Master</td><td>Marcus Johnson</td><td>100%</td><td>Feb – Dec 2024</td></tr>
<tr><td>iOS Lead Engineer</td><td>Priya Sharma</td><td>100%</td><td>Feb – Sep 2024</td></tr>
<tr><td>Business Analyst / PO</td><td>Tom Bradley</td><td>100%</td><td>Feb – Dec 2024</td></tr>
</table>
<h2>5. Commercial Terms</h2>
<ul>
<li><strong>Engagement type:</strong> Time &amp; Materials with fixed-price milestones</li>
<li><strong>Total contract value:</strong> USD $5,800,000</li>
<li><strong>Payment:</strong> Monthly invoicing + milestone payments at M1 ($800K), M2 ($1.2M), M3 ($800K)</li>
<li><strong>Expenses:</strong> Reimbursable at cost; pre-approval for items &gt; $500</li>
<li><strong>Payment terms:</strong> Net 30 from invoice date</li>
</ul>
<h2>6. Assumptions</h2>
<ul>
<li>Meridian Bank provides access to all required environments within 2 weeks of SOW execution</li>
<li>PSD2 sandbox credentials provisioned by Meridian IT by June 28, 2024</li>
<li>BioCatch SDK licensing for iOS and Android confirmed by July 1, 2024</li>
<li>Temenos T24 API documentation and read-replica access available from programme start</li>
<li>NCC Group pen test scheduled and completed by September 1, 2024</li>
</ul>
<h2>7. Change Management</h2>
<p>Any changes to scope, timeline, or commercial terms require a written Change Request agreed by both parties before implementation. CRs are logged in the project RAID log.</p>
<h2>8. Signatures</h2>
<table>
<tr><th>Party</th><th>Name</th><th>Title</th><th>Date</th></tr>
<tr><td>Meridian Bank</td><td>Diana Foster</td><td>VP Digital Banking</td><td>January 30, 2024</td></tr>
<tr><td>Slalom Consulting</td><td>Alex Rivera</td><td>Program Manager</td><td>January 30, 2024</td></tr>
</table>`

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
    title:            "Statement of Work — SLM-MBK-2024-SOW-001",
    status:           "approved",
    content:          SOW_HTML,
    version:          "1.2",
    authorId:         "usr-001",
    reviewers:        ["usr-003", "usr-007"],
    approvedBy:       "usr-007",
    linkedWorkItems:  ["wi-001", "wi-010", "wi-030", "wi-020", "wi-021", "wi-040"],
    createdAt:        "2024-01-20T10:00:00Z",
    updatedAt:        "2024-01-30T16:00:00Z",
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
