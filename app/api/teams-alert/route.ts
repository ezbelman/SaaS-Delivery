import { NextResponse } from "next/server"

// Temporary demo fallback URLs. Replace with Vercel env vars after the demo.
const DEMO_DAILY_ALERT_WEBHOOK_URL =
  "https://default9ca75128a2444596877bf24828e476.e2.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f4ede95462c141e995a895dda424f00f/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X24b9hDKpo9OntSZ0Xq2L6cPPfzZvAIMHgHy3IA4IX4"

const DEMO_INDIVIDUAL_ALERT_WEBHOOK_URL =
  "https://default9ca75128a2444596877bf24828e476.e2.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3ad36634f9af4d098aa43df7e7b1edc3/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=J4jp16RWf4orLjpdPxdfITsNL2Sn9fx2FcuJd9-lE7A"

interface TeamsAlertRequest {
  alertType?: "daily" | "individual"
  webhookUrl?: string
  messageText?: string
  projectName?: string
  projectHealthLabel?: string
  alertTitle?: string
  ownerAlerts?: {
    userId: string
    name: string
    email: string
    blockedTaskTitles: string[]
    raidTitles: string[]
  }[]
}

function getAppBaseUrl(request: Request) {
  const explicitOrigin = request.headers.get("origin")?.trim()
  if (explicitOrigin) return explicitOrigin

  const forwardedProto = request.headers.get("x-forwarded-proto")?.trim()
  const forwardedHost = request.headers.get("x-forwarded-host")?.trim()
  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const host = request.headers.get("host")?.trim()
  if (host) {
    const proto = host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https"
    return `${proto}://${host}`
  }

  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000"
}

function getConfiguredWebhookUrl(alertType: TeamsAlertRequest["alertType"]) {
  if (alertType === "individual") {
    return (
      process.env.TEAMS_INDIVIDUAL_ALERT_WEBHOOK_URL?.trim() ||
      DEMO_INDIVIDUAL_ALERT_WEBHOOK_URL
    )
  }

  return process.env.TEAMS_DAILY_ALERT_WEBHOOK_URL?.trim() || DEMO_DAILY_ALERT_WEBHOOK_URL
}

function buildAdaptiveCardPayload({
  alertTitle,
  messageText,
  projectName,
  projectHealthLabel,
  ownerAlerts,
  appBaseUrl,
}: {
  alertTitle?: string
  messageText: string
  projectName?: string
  projectHealthLabel?: string
  ownerAlerts?: TeamsAlertRequest["ownerAlerts"]
  appBaseUrl: string
}) {
  const mentionEmailOverride = process.env.TEAMS_ALERT_MENTION_EMAIL?.trim()
  const ownerSections = (ownerAlerts ?? []).slice(0, 3).flatMap((owner) => {
    const blockedLabel =
      owner.blockedTaskTitles.length > 0
        ? `${owner.blockedTaskTitles.length} blocker${owner.blockedTaskTitles.length === 1 ? "" : "s"}`
        : "0 blockers"
    const raidLabel =
      owner.raidTitles.length > 0
        ? `${owner.raidTitles.length} RAID item${owner.raidTitles.length === 1 ? "" : "s"}`
        : "0 RAID items"
    const firstBlocked = owner.blockedTaskTitles[0]
    const firstRaid = owner.raidTitles[0]

    return [
      {
        type: "TextBlock",
        text: `<at>${owner.name}</at> — ${blockedLabel}, ${raidLabel}`,
        wrap: true,
        spacing: "Medium",
      },
      {
        type: "TextBlock",
        text: [
          firstBlocked ? `Top blocker: ${firstBlocked}` : "",
          firstRaid ? `RAID owner: ${firstRaid}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        wrap: true,
        isSubtle: true,
        spacing: "Small",
      },
    ]
  })

  const mentionEntities = (ownerAlerts ?? []).slice(0, 3).map((owner) => ({
    type: "mention",
    text: `<at>${owner.name}</at>`,
    mentioned: {
      id: mentionEmailOverride || owner.email,
      name: owner.name,
    },
  }))

  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "TextBlock",
              text:
                ownerAlerts?.length === 1
                  ? alertTitle || "RAID Ticket"
                  : "Slalom Delivery Platform Alert",
              weight: "Bolder",
              size: "Medium",
              wrap: true,
            },
            ...(projectName
              ? [
                  {
                    type: "TextBlock",
                    text: projectName,
                    spacing: "Small",
                    wrap: true,
                  },
                ]
              : []),
            ...(projectHealthLabel && (!ownerAlerts || ownerAlerts.length !== 1)
              ? [
                  {
                    type: "TextBlock",
                    text: `Health: ${projectHealthLabel}`,
                    color: projectHealthLabel.toLowerCase().includes("risk") ? "Attention" : "Good",
                    wrap: true,
                  },
              ] 
              : []),
            {
              type: "TextBlock",
              text: messageText,
              wrap: true,
              spacing: "Medium",
            },
            ...(ownerSections.length > 0
              ? [
                  {
                    type: "TextBlock",
                    text: ownerAlerts?.length === 1 ? "Assigned To" : "Action Owners",
                    weight: "Bolder",
                    spacing: "Large",
                    wrap: true,
                  },
                  ...ownerSections,
                ]
              : []),
          ],
          actions: [
            {
              type: "Action.OpenUrl",
              title: ownerAlerts?.length === 1 ? "Open RAID Item" : "View RAID Log",
              url: `${appBaseUrl}/raid`,
            },
            ...(ownerAlerts?.length === 1
              ? []
              : [
                  {
                    type: "Action.OpenUrl",
                    title: "Open Overview",
                    url: `${appBaseUrl}/overview`,
                  },
                  {
                    type: "Action.OpenUrl",
                    title: "View Schedule",
                    url: `${appBaseUrl}/schedule`,
                  },
                ]),
          ],
          msteams: {
            entities: mentionEntities,
          },
        },
      },
    ],
  }
}

function isValidWebhookUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:"
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as TeamsAlertRequest | null
  const alertType = body?.alertType === "individual" ? "individual" : "daily"
  const webhookUrl = body?.webhookUrl?.trim() || getConfiguredWebhookUrl(alertType)
  const messageText = body?.messageText?.trim() || ""
  const appBaseUrl = getAppBaseUrl(request)

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Paste a Teams workflow webhook URL before sending." },
      { status: 400 }
    )
  }

  if (!isValidWebhookUrl(webhookUrl)) {
    return NextResponse.json(
      { error: "Webhook URL must be a valid https URL." },
      { status: 400 }
    )
  }

  if (!messageText) {
    return NextResponse.json(
      { error: "Alert message cannot be empty." },
      { status: 400 }
    )
  }

  const upstreamResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildAdaptiveCardPayload({
        alertTitle: body?.alertTitle?.trim() || "",
        messageText,
        projectName: body?.projectName?.trim() || "",
        projectHealthLabel: body?.projectHealthLabel?.trim() || "",
        ownerAlerts: body?.ownerAlerts ?? [],
        appBaseUrl,
      })
    ),
  })

  if (!upstreamResponse.ok) {
    const errorText = await upstreamResponse.text().catch(() => "")
    return NextResponse.json(
      {
        error: errorText || `Teams workflow webhook failed with status ${upstreamResponse.status}.`,
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  return NextResponse.json({
    dailyConfigured: Boolean(
      process.env.TEAMS_DAILY_ALERT_WEBHOOK_URL?.trim() || DEMO_DAILY_ALERT_WEBHOOK_URL
    ),
    individualConfigured: Boolean(
      process.env.TEAMS_INDIVIDUAL_ALERT_WEBHOOK_URL?.trim() || DEMO_INDIVIDUAL_ALERT_WEBHOOK_URL
    ),
  })
}
