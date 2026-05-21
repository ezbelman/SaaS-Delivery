"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input, Textarea } from "@/components/ui/input"
import { CheckCircle2, RefreshCw, Send, XCircle } from "lucide-react"

interface TeamsDeliveryCardProps {
  projectName: string
  projectHealthLabel: string
  activeSprintName?: string
  activeSprintEndDate?: string
  programPct: number
  blockedItems: number
  openRaidItems: number
  overdueRaidItems: number
  ownerAlerts: {
    userId: string
    name: string
    email: string
    blockedTaskTitles: string[]
    raidTitles: string[]
  }[]
}

const WEBHOOK_STORAGE_KEY = "sdp-teams-workflow-webhook"

function buildAlertMessage({
  projectName,
  projectHealthLabel,
  activeSprintName,
  activeSprintEndDate,
  programPct,
  blockedItems,
  openRaidItems,
  overdueRaidItems,
}: TeamsDeliveryCardProps) {
  const sprintLabel = activeSprintName ? activeSprintName : "Current sprint"
  const sprintDueLine =
    activeSprintName && activeSprintEndDate
      ? `${activeSprintName} due: ${new Date(activeSprintEndDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`
      : ""
  const riskLine =
    overdueRaidItems > 0
      ? `${openRaidItems} open RAID items, including ${overdueRaidItems} overdue.`
      : `${openRaidItems} open RAID items and no overdue items today.`

  return [
    `Slalom Delivery Platform alert`,
    `${projectName}`,
    `${sprintLabel}: ${programPct}% complete`,
    sprintDueLine,
    `Active blockers: ${blockedItems}`,
    riskLine,
  ].filter(Boolean).join("\n")
}

export function TeamsDeliveryCard(props: TeamsDeliveryCardProps) {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    if (typeof window === "undefined") return ""
    return window.localStorage.getItem(WEBHOOK_STORAGE_KEY) ?? ""
  })
  const [serverConfigured, setServerConfigured] = useState(false)
  const [messageText, setMessageText] = useState(() => buildAlertMessage(props))
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const defaultMessage = useMemo(() => buildAlertMessage(props), [props])

  useEffect(() => {
    void fetch("/api/teams-alert")
      .then((response) => response.json())
      .then((payload: { dailyConfigured?: boolean }) => {
        setServerConfigured(Boolean(payload.dailyConfigured))
      })
      .catch(() => {
        setServerConfigured(false)
      })
  }, [])

  function handleWebhookUrlChange(value: string) {
    setWebhookUrl(value)
    window.localStorage.setItem(WEBHOOK_STORAGE_KEY, value)
  }

  async function handleSend() {
    setStatusMessage("")
    setErrorMessage("")
    setIsSending(true)

    try {
      const response = await fetch("/api/teams-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alertType: "daily",
          webhookUrl,
          messageText,
          projectName: props.projectName,
          projectHealthLabel: props.projectHealthLabel,
          ownerAlerts: props.ownerAlerts,
        }),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string; success?: boolean } | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Teams workflow alert failed.")
      }

      setStatusMessage("Teams channel alert sent through the workflow webhook.")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Teams workflow alert failed.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="animate-fade-up delay-150 border-info/20 bg-[linear-gradient(180deg,rgba(12,98,251,0.07),rgba(12,98,251,0.02))]">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>Channel Alerts</CardTitle>
              <Badge variant={webhookUrl.trim() || serverConfigured ? "info" : "warning"} dot>
                {webhookUrl.trim() || serverConfigured ? "Daily automation connected" : "Setup needed"}
              </Badge>
            </div>
            <CardDescription>
              Send a channel update for the current delivery status, or use the connected daily automation to keep the team informed without manual follow-up.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {!serverConfigured && (
          <Input
            label="Channel Workflow URL"
            type="url"
            placeholder="https://prod-00...logic.azure.com/..."
            value={webhookUrl}
            onChange={(event) => handleWebhookUrlChange(event.target.value)}
            hint="Used only when the shared daily workflow is not already configured."
          />
        )}

        <Textarea
          label="Channel Alert Preview"
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          className="min-h-[180px] font-mono text-xs"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMessageText(defaultMessage)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Preview
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            loading={isSending}
            disabled={(!webhookUrl.trim() && !serverConfigured) || !messageText.trim()}
          >
            <Send className="h-3.5 w-3.5" />
            Send Channel Update
          </Button>
        </div>

        {statusMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-success/20 bg-success/8 p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/8 p-3 text-sm text-danger">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
