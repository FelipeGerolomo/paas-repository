"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Play, Pause, RotateCcw, Search, Copy, Settings, Key } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  type App,
  type Deploy,
  formatRelativeTime,
  getStatusColor,
  getFrameworkLabel,
  mockLogs,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AppDetailClient({ app }: { app: App }) {
  const [status, setStatus] = useState(app.status)
  const [selectedDeploy, setSelectedDeploy] = useState<Deploy | null>(null)
  const [rollbackDeploy, setRollbackDeploy] = useState<Deploy | null>(null)
  const [logFilter, setLogFilter] = useState<"all" | "errors">("all")
  const [logSearch, setLogSearch] = useState("")
  const [liveTail, setLiveTail] = useState(true)

  const currentDeploy = app.deploys[0]
  const isPaused = status === "paused"

  function handleDeploy() {
    toast.success(`Deploy iniciado para ${app.name}`)
  }

  function handleTogglePause() {
    setStatus(isPaused ? "live" : "paused")
    toast.success(isPaused ? `${app.name} retomado` : `${app.name} pausado`)
  }

  function handleRollback() {
    if (!rollbackDeploy) return
    toast.success(`Rollback para ${rollbackDeploy.sha} iniciado`)
    setRollbackDeploy(null)
  }

  function handleCopyLogs() {
    const text = filteredLogs.map((l) => `[${l.time}] [${l.level}] ${l.message}`).join("\n")
    navigator.clipboard.writeText(text)
    toast.success("Logs copiados")
  }

  const filteredLogs = mockLogs.filter((log) => {
    if (logFilter === "errors" && log.level !== "error") return false
    if (logSearch && !log.message.toLowerCase().includes(logSearch.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="size-8">
            <Link href="/apps">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{app.name}</h1>
            <Badge className={getStatusColor(status)} variant="outline">
              {status === "live" ? "Live" : status === "building" ? "Building" : status === "failed" ? "Failed" : "Paused"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">
              {getFrameworkLabel(app.framework)}
            </Badge>
            <a
              href={`https://${app.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {app.domain}
              <ExternalLink className="size-3" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleTogglePause}>
              <Pause className="mr-2 size-4" />
              {isPaused ? "Retomar" : "Pausar"}
            </Button>
            <Button size="sm" onClick={handleDeploy}>
              <Play className="mr-2 size-4" />
              Deploy
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="deploys">Deploys</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="flex flex-col gap-4 mt-4">
          {/* Current Deploy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deploy Atual</CardTitle>
            </CardHeader>
            <CardContent>
              {currentDeploy ? (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        {currentDeploy.sha}
                      </code>
                      <Badge className={getStatusColor(currentDeploy.status)} variant="outline">
                        {currentDeploy.status === "live" ? "Live" : currentDeploy.status === "building" ? "Building" : currentDeploy.status === "failed" ? "Failed" : "Queued"}
                      </Badge>
                    </div>
                    <p className="text-sm">{currentDeploy.commitMessage}</p>
                    <p className="text-xs text-muted-foreground">
                      por {currentDeploy.author} {"·"} {formatRelativeTime(currentDeploy.time)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="mr-2 size-4" />
                        Rollback
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {app.deploys.slice(1, 4).map((deploy) => (
                        <DropdownMenuItem
                          key={deploy.id}
                          onClick={() => setRollbackDeploy(deploy)}
                        >
                          <code className="mr-2 text-xs font-mono">{deploy.sha}</code>
                          <span className="text-xs text-muted-foreground truncate">
                            {deploy.commitMessage}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum deploy realizado.</p>
              )}
            </CardContent>
          </Card>

          {/* Domain Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Domínio</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Settings className="mr-1 size-3" />
                  Gerenciar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500" />
                <a
                  href={`https://${app.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {app.domain}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Env Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Variáveis de Ambiente</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Key className="mr-1 size-3" />
                  Gerenciar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {app.envVars.length === 0
                  ? "Nenhuma variável configurada."
                  : `${app.envVars.length} variáve${app.envVars.length > 1 ? "is" : "l"} configurada${app.envVars.length > 1 ? "s" : ""}.`}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deploys Tab */}
        <TabsContent value="deploys" className="mt-4">
          {app.deploys.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <p className="text-sm text-muted-foreground">Nenhum deploy realizado.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y rounded-lg border">
              {app.deploys.map((deploy) => (
                <button
                  key={deploy.id}
                  onClick={() => setSelectedDeploy(deploy)}
                  className="flex items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-accent/30"
                >
                  <Badge className={cn(getStatusColor(deploy.status), "shrink-0")} variant="outline">
                    {deploy.status === "live" ? "Live" : deploy.status === "building" ? "Building" : deploy.status === "failed" ? "Failed" : "Queued"}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{deploy.commitMessage}</p>
                    <p className="text-xs text-muted-foreground">
                      <code className="font-mono">{deploy.sha}</code>
                      {" · "}por {deploy.author}{" · "}{formatRelativeTime(deploy.time)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base">Runtime Logs</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="live-tail" className="text-xs text-muted-foreground">
                      Live tail
                    </Label>
                    <Switch
                      id="live-tail"
                      checked={liveTail}
                      onCheckedChange={setLiveTail}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyLogs}>
                    <Copy className="mr-1 size-3" />
                    Copiar
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Button
                    variant={logFilter === "all" ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setLogFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={logFilter === "errors" ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setLogFilter("errors")}
                  >
                    Erros
                  </Button>
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar logs..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-8 h-7 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="rounded-md bg-muted/50 p-3 font-mono text-xs">
                  {filteredLogs.length === 0 ? (
                    <p className="text-muted-foreground">Nenhum log encontrado.</p>
                  ) : (
                    filteredLogs.map((log, i) => (
                      <div key={i} className="flex gap-2 py-0.5">
                        <span className="text-muted-foreground shrink-0">{log.time}</span>
                        <span
                          className={cn(
                            "shrink-0 uppercase w-12",
                            log.level === "error"
                              ? "text-red-600"
                              : log.level === "warn"
                                ? "text-amber-600"
                                : "text-muted-foreground"
                          )}
                        >
                          {log.level}
                        </span>
                        <span className="text-foreground">{log.message}</span>
                      </div>
                    ))
                  )}
                  {liveTail && filteredLogs.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 text-muted-foreground">
                      <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aguardando novos logs...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                por {selectedDeploy.author} {"·"} {formatRelativeTime(selectedDeploy.time)}
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

      {/* Rollback Confirm */}
      <AlertDialog open={!!rollbackDeploy} onOpenChange={() => setRollbackDeploy(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Rollback</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja voltar para o deploy <code className="font-mono">{rollbackDeploy?.sha}</code>?
              {" "}Isso vai substituir o deploy atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRollback}>Confirmar Rollback</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
