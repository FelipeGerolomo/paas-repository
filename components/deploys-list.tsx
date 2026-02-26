"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { mockApps, formatRelativeTime, getStatusColor, type Deploy } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface DeployWithAppName extends Deploy {
  appName: string
}

function getAllDeploys(): DeployWithAppName[] {
  return mockApps
    .flatMap((app) =>
      app.deploys.map((deploy) => ({ ...deploy, appName: app.name }))
    )
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

export function DeploysListClient() {
  const allDeploys = getAllDeploys()
  const [appFilter, setAppFilter] = useState<string>("all")
  const [selectedDeploy, setSelectedDeploy] = useState<DeployWithAppName | null>(null)

  const filtered = appFilter === "all"
    ? allDeploys
    : allDeploys.filter((d) => d.appId === appFilter)

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Deploys</h1>
        </div>

        <div className="flex items-center gap-3">
          <Select value={appFilter} onValueChange={setAppFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por app" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os apps</SelectItem>
              {mockApps.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <p className="text-sm text-muted-foreground">Nenhum deploy encontrado.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y rounded-lg border">
            {filtered.slice(0, 30).map((deploy) => (
              <button
                key={deploy.id}
                onClick={() => setSelectedDeploy(deploy)}
                className="flex items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-accent/30"
              >
                <Badge className={cn(getStatusColor(deploy.status), "shrink-0")} variant="outline">
                  {deploy.status === "live" ? "Live" : deploy.status === "building" ? "Building" : deploy.status === "failed" ? "Failed" : "Queued"}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm truncate">{deploy.commitMessage}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">{deploy.appName}</span>
                    {" · "}
                    <code className="font-mono">{deploy.sha}</code>
                    {" · "}por {deploy.author}
                    {" · "}{formatRelativeTime(deploy.time)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Deploy Detail Sheet */}
      <Sheet open={!!selectedDeploy} onOpenChange={() => setSelectedDeploy(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalhes do Deploy</SheetTitle>
            <SheetDescription>
              {selectedDeploy?.commitMessage}
            </SheetDescription>
          </SheetHeader>
          {selectedDeploy && (
            <div className="flex flex-col gap-4 px-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedDeploy.status)} variant="outline">
                  {selectedDeploy.status === "live" ? "Live" : selectedDeploy.status === "building" ? "Building" : selectedDeploy.status === "failed" ? "Failed" : "Queued"}
                </Badge>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  {selectedDeploy.sha}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/70">{selectedDeploy.appName}</span>
                {" · "}por {selectedDeploy.author}
                {" · "}{formatRelativeTime(selectedDeploy.time)}
              </p>
              <Separator />
              <div>
                <h4 className="mb-2 text-sm font-medium">Build Log</h4>
                <ScrollArea className="h-60">
                  <div className="rounded-md bg-muted/50 p-3 font-mono text-xs">
                    {selectedDeploy.buildLog.map((line, i) => (
                      <div key={i} className={cn(
                        "py-0.5",
                        line.startsWith("ERROR") ? "text-red-600" : "text-foreground"
                      )}>
                        {line}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <Button variant="outline" size="sm" className="w-fit">
                Ver logs completos
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
