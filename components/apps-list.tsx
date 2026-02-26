"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, MoreVertical, Play, FileText, Pause, Trash2, ExternalLink, Rocket } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { mockApps, formatRelativeTime, getStatusColor, getFrameworkLabel, type App } from "@/lib/mock-data"

export function AppsListClient() {
  const router = useRouter()
  const [apps, setApps] = useState<App[]>(mockApps)
  const [search, setSearch] = useState("")
  const [deleteApp, setDeleteApp] = useState<App | null>(null)

  const filtered = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleDeploy(app: App) {
    toast.success(`Deploy iniciado para ${app.name}`)
  }

  function handleTogglePause(app: App) {
    setApps((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? { ...a, status: a.status === "paused" ? "live" : "paused" }
          : a
      )
    )
    toast.success(
      app.status === "paused"
        ? `${app.name} retomado`
        : `${app.name} pausado`
    )
  }

  function handleDelete() {
    if (!deleteApp) return
    setApps((prev) => prev.filter((a) => a.id !== deleteApp.id))
    toast.success(`${deleteApp.name} removido`)
    setDeleteApp(null)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Apps</h1>
          <Button asChild>
            <Link href="/apps/new">
              <Plus className="mr-2 size-4" />
              Novo App
            </Link>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {filtered.length === 0 && search === "" ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-muted">
              <Rocket className="size-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 font-medium">Nenhum app ainda</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Conecte um repositório e faça deploy em minutos.
            </p>
            <Button asChild>
              <Link href="/apps/new">
                <Plus className="mr-2 size-4" />
                Novo App
              </Link>
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <p className="text-sm text-muted-foreground">
              {"Nenhum app encontrado para \""}{search}{"\""}
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y rounded-lg border">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/30"
              >
                <Link
                  href={`/apps/${app.id}`}
                  className="flex min-w-0 flex-1 items-center gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{app.name}</span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {getFrameworkLabel(app.framework)}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{app.domain}</span>
                      <span>{"·"}</span>
                      <span className="shrink-0">{formatRelativeTime(app.lastDeployTime)}</span>
                    </div>
                  </div>
                </Link>

                <Badge className={getStatusColor(app.status)} variant="outline">
                  {app.status === "live" ? "Live" : app.status === "building" ? "Building" : app.status === "failed" ? "Failed" : "Paused"}
                </Badge>

                <a
                  href={`https://${app.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="size-4" />
                  <span className="sr-only">Abrir {app.domain}</span>
                </a>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 shrink-0">
                      <MoreVertical className="size-4" />
                      <span className="sr-only">Ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDeploy(app)}>
                      <Play className="mr-2 size-4" />
                      Deploy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/apps/${app.id}?tab=logs`)}>
                      <FileText className="mr-2 size-4" />
                      Ver logs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTogglePause(app)}>
                      <Pause className="mr-2 size-4" />
                      {app.status === "paused" ? "Retomar" : "Pausar"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteApp(app)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteApp} onOpenChange={() => setDeleteApp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir app</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteApp?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
