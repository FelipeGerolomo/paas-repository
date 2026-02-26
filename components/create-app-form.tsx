"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Github } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Framework = "nextjs" | "node" | "static"
type DeployStep = "idle" | "queued" | "building" | "deploying" | "live"

const frameworks: { value: Framework; label: string; desc: string }[] = [
  { value: "nextjs", label: "Next.js", desc: "React full-stack" },
  { value: "node", label: "Node API", desc: "Servidor Express/Fastify" },
  { value: "static", label: "Static", desc: "HTML/CSS/JS" },
]

const defaultCommands: Record<Framework, { build: string; start: string; output: string }> = {
  nextjs: { build: "next build", start: "next start", output: ".next" },
  node: { build: "npm run build", start: "node dist/index.js", output: "" },
  static: { build: "npm run build", start: "", output: "dist" },
}

const deploySteps: { key: DeployStep; label: string }[] = [
  { key: "queued", label: "Na fila" },
  { key: "building", label: "Construindo" },
  { key: "deploying", label: "Deployando" },
  { key: "live", label: "Live" },
]

export function CreateAppForm() {
  const router = useRouter()
  const [framework, setFramework] = useState<Framework>("nextjs")
  const [autoDetect, setAutoDetect] = useState(true)
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([])
  const [deployStep, setDeployStep] = useState<DeployStep>("idle")
  const [buildCommand, setBuildCommand] = useState(defaultCommands.nextjs.build)
  const [startCommand, setStartCommand] = useState(defaultCommands.nextjs.start)
  const [outputDir, setOutputDir] = useState(defaultCommands.nextjs.output)

  function handleFrameworkChange(fw: Framework) {
    setFramework(fw)
    setBuildCommand(defaultCommands[fw].build)
    setStartCommand(defaultCommands[fw].start)
    setOutputDir(defaultCommands[fw].output)
  }

  function addEnvVar() {
    setEnvVars((prev) => [...prev, { key: "", value: "" }])
  }

  function removeEnvVar(index: number) {
    setEnvVars((prev) => prev.filter((_, i) => i !== index))
  }

  function updateEnvVar(index: number, field: "key" | "value", val: string) {
    setEnvVars((prev) =>
      prev.map((ev, i) => (i === index ? { ...ev, [field]: val } : ev))
    )
  }

  function handleDeploy() {
    setDeployStep("queued")
    toast("Deploy iniciado")
    setTimeout(() => setDeployStep("building"), 1000)
    setTimeout(() => setDeployStep("deploying"), 3000)
    setTimeout(() => {
      setDeployStep("live")
      toast.success("Deploy concluído com sucesso")
    }, 5000)
    setTimeout(() => {
      router.push("/apps/app-1")
    }, 6500)
  }

  const isDeploying = deployStep !== "idle"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="size-8">
          <Link href="/apps">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Novo App</h1>
      </div>

      {isDeploying ? (
        <Card>
          <CardHeader>
            <CardTitle>Realizando deploy...</CardTitle>
            <CardDescription>Acompanhe o progresso do seu deploy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {deploySteps.map((step, i) => {
                const stepIndex = deploySteps.findIndex((s) => s.key === deployStep)
                const currentIndex = i
                const isComplete = currentIndex < stepIndex
                const isCurrent = currentIndex === stepIndex
                return (
                  <div key={step.key} className="flex flex-1 items-center gap-2">
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all",
                          isComplete
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isCurrent
                              ? "border-primary bg-primary text-primary-foreground animate-pulse"
                              : "border-border bg-muted text-muted-foreground"
                        )}
                      >
                        {isComplete ? (
                          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        isCurrent ? "text-foreground" : isComplete ? "text-emerald-600" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                    </div>
                    {i < deploySteps.length - 1 && (
                      <div className={cn(
                        "h-0.5 flex-1 rounded-full mb-5",
                        isComplete ? "bg-emerald-500" : "bg-border"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Section A - Source */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Origem</CardTitle>
              <CardDescription>Conecte seu repositório Git</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
                <Github className="size-5 text-foreground" />
                <span className="text-sm font-medium">GitHub</span>
                <span className="ml-auto text-xs text-muted-foreground">Conectado</span>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="repo">URL do repositório</Label>
                <Input
                  id="repo"
                  placeholder="https://github.com/usuario/repo"
                  defaultValue="https://github.com/usuario/meu-app"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" defaultValue="main" />
              </div>
            </CardContent>
          </Card>

          {/* Section B - Framework */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Framework</CardTitle>
                  <CardDescription>Selecione o tipo de projeto</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="auto-detect" className="text-xs text-muted-foreground">
                    Auto-detectar
                  </Label>
                  <Switch id="auto-detect" checked={autoDetect} onCheckedChange={setAutoDetect} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {frameworks.map((fw) => (
                  <button
                    key={fw.value}
                    onClick={() => handleFrameworkChange(fw.value)}
                    className={cn(
                      "flex flex-col items-start rounded-lg border p-3 text-left transition-colors",
                      framework === fw.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                    )}
                  >
                    <span className="text-sm font-medium">{fw.label}</span>
                    <span className="text-xs text-muted-foreground">{fw.desc}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section C - Build & Start */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Build e Inicialização</CardTitle>
              <CardDescription>Configure os comandos de build</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="build-cmd">Comando de build</Label>
                <Input
                  id="build-cmd"
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              {(framework === "nextjs" || framework === "node") && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="start-cmd">Comando de inicialização</Label>
                  <Input
                    id="start-cmd"
                    value={startCommand}
                    onChange={(e) => setStartCommand(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              )}
              {framework === "static" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="output-dir">Diretório de saída</Label>
                  <Input
                    id="output-dir"
                    value={outputDir}
                    onChange={(e) => setOutputDir(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="port">Porta</Label>
                <Input id="port" defaultValue="3000" className="font-mono text-sm w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Section D - Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variáveis de Ambiente</CardTitle>
              <CardDescription>Adicione variáveis para produção</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {envVars.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma variável adicionada.</p>
              ) : (
                envVars.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="CHAVE"
                      value={ev.key}
                      onChange={(e) => updateEnvVar(i, "key", e.target.value)}
                      className="font-mono text-sm flex-1"
                    />
                    <Input
                      placeholder="valor"
                      value={ev.value}
                      onChange={(e) => updateEnvVar(i, "value", e.target.value)}
                      type="password"
                      className="font-mono text-sm flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => removeEnvVar(i)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remover variável</span>
                    </Button>
                  </div>
                ))
              )}
              <Button variant="outline" size="sm" onClick={addEnvVar} className="w-fit">
                <Plus className="mr-2 size-4" />
                Adicionar variável
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <Separator />
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" asChild>
              <Link href="/apps">Cancelar</Link>
            </Button>
            <Button onClick={handleDeploy}>Deploy</Button>
          </div>
        </>
      )}
    </div>
  )
}
