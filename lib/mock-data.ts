export type AppStatus = "live" | "building" | "failed" | "paused"
export type Framework = "nextjs" | "node" | "static"
export type DeployStatus = "live" | "building" | "failed" | "queued"
export type LogLevel = "info" | "warn" | "error"

export interface EnvVar {
  key: string
  value: string
}

export interface Deploy {
  id: string
  appId: string
  status: DeployStatus
  commitMessage: string
  sha: string
  author: string
  time: string
  buildLog: string[]
}

export interface App {
  id: string
  name: string
  framework: Framework
  status: AppStatus
  domain: string
  lastDeployTime: string
  envVars: EnvVar[]
  deploys: Deploy[]
}

function generateBuildLog(): string[] {
  return [
    "Clonando repositório...",
    "Instalando dependências...",
    "npm install concluído em 12.3s",
    "Executando build...",
    "next build",
    "Compilando páginas...",
    "Compilação concluída com sucesso.",
    "Gerando páginas estáticas (0/12)...",
    "Gerando páginas estáticas (12/12)...",
    "Build concluído em 34.2s",
    "Deploy iniciado...",
    "Enviando artefatos...",
    "Deploy concluído com sucesso.",
  ]
}

function generateFailedBuildLog(): string[] {
  return [
    "Clonando repositório...",
    "Instalando dependências...",
    "npm install concluído em 11.8s",
    "Executando build...",
    "next build",
    "Compilando páginas...",
    "ERROR: Module not found: '@/components/missing'",
    "Build falhou com código de saída 1.",
  ]
}

export const mockApps: App[] = [
  {
    id: "app-1",
    name: "portfolio-site",
    framework: "nextjs",
    status: "live",
    domain: "portfolio.deploy.app",
    lastDeployTime: "2026-02-26T10:30:00Z",
    envVars: [
      { key: "DATABASE_URL", value: "postgresql://..." },
      { key: "NEXT_PUBLIC_API_URL", value: "https://api.example.com" },
    ],
    deploys: [
      { id: "d-1a", appId: "app-1", status: "live", commitMessage: "feat: adicionar página de contato", sha: "a1b2c3d", author: "maria", time: "2026-02-26T10:30:00Z", buildLog: generateBuildLog() },
      { id: "d-1b", appId: "app-1", status: "live", commitMessage: "fix: corrigir responsividade do header", sha: "e4f5g6h", author: "maria", time: "2026-02-25T14:20:00Z", buildLog: generateBuildLog() },
      { id: "d-1c", appId: "app-1", status: "live", commitMessage: "chore: atualizar dependências", sha: "i7j8k9l", author: "maria", time: "2026-02-24T09:15:00Z", buildLog: generateBuildLog() },
      { id: "d-1d", appId: "app-1", status: "failed", commitMessage: "feat: integração com CMS", sha: "m0n1o2p", author: "joao", time: "2026-02-23T16:45:00Z", buildLog: generateFailedBuildLog() },
      { id: "d-1e", appId: "app-1", status: "live", commitMessage: "style: refatorar estilos globais", sha: "q3r4s5t", author: "maria", time: "2026-02-22T11:00:00Z", buildLog: generateBuildLog() },
      { id: "d-1f", appId: "app-1", status: "live", commitMessage: "feat: dark mode", sha: "u6v7w8x", author: "joao", time: "2026-02-21T08:30:00Z", buildLog: generateBuildLog() },
      { id: "d-1g", appId: "app-1", status: "live", commitMessage: "feat: SEO otimizado", sha: "y9z0a1b", author: "maria", time: "2026-02-20T13:10:00Z", buildLog: generateBuildLog() },
      { id: "d-1h", appId: "app-1", status: "live", commitMessage: "fix: meta tags", sha: "c2d3e4f", author: "maria", time: "2026-02-19T17:50:00Z", buildLog: generateBuildLog() },
      { id: "d-1i", appId: "app-1", status: "live", commitMessage: "feat: blog integrado", sha: "g5h6i7j", author: "joao", time: "2026-02-18T10:20:00Z", buildLog: generateBuildLog() },
      { id: "d-1j", appId: "app-1", status: "live", commitMessage: "init: projeto inicial", sha: "k8l9m0n", author: "maria", time: "2026-02-17T09:00:00Z", buildLog: generateBuildLog() },
    ],
  },
  {
    id: "app-2",
    name: "api-gateway",
    framework: "node",
    status: "live",
    domain: "api.gateway.deploy.app",
    lastDeployTime: "2026-02-26T08:15:00Z",
    envVars: [
      { key: "PORT", value: "3000" },
      { key: "JWT_SECRET", value: "super-secret-key" },
      { key: "REDIS_URL", value: "redis://..." },
    ],
    deploys: [
      { id: "d-2a", appId: "app-2", status: "live", commitMessage: "feat: rate limiting middleware", sha: "b1c2d3e", author: "pedro", time: "2026-02-26T08:15:00Z", buildLog: generateBuildLog() },
      { id: "d-2b", appId: "app-2", status: "live", commitMessage: "fix: CORS headers", sha: "f4g5h6i", author: "pedro", time: "2026-02-25T20:30:00Z", buildLog: generateBuildLog() },
      { id: "d-2c", appId: "app-2", status: "live", commitMessage: "feat: health check endpoint", sha: "j7k8l9m", author: "ana", time: "2026-02-24T15:00:00Z", buildLog: generateBuildLog() },
      { id: "d-2d", appId: "app-2", status: "live", commitMessage: "chore: upgrade express v5", sha: "n0o1p2q", author: "pedro", time: "2026-02-23T10:00:00Z", buildLog: generateBuildLog() },
      { id: "d-2e", appId: "app-2", status: "live", commitMessage: "feat: logging structured", sha: "r3s4t5u", author: "ana", time: "2026-02-22T18:00:00Z", buildLog: generateBuildLog() },
      { id: "d-2f", appId: "app-2", status: "live", commitMessage: "fix: memory leak no cache", sha: "v6w7x8y", author: "pedro", time: "2026-02-21T12:45:00Z", buildLog: generateBuildLog() },
      { id: "d-2g", appId: "app-2", status: "live", commitMessage: "feat: webhook integration", sha: "z9a0b1c", author: "ana", time: "2026-02-20T09:30:00Z", buildLog: generateBuildLog() },
      { id: "d-2h", appId: "app-2", status: "live", commitMessage: "feat: auth v2", sha: "d2e3f4g", author: "pedro", time: "2026-02-19T14:00:00Z", buildLog: generateBuildLog() },
      { id: "d-2i", appId: "app-2", status: "live", commitMessage: "feat: error handling global", sha: "h5i6j7k", author: "ana", time: "2026-02-18T07:00:00Z", buildLog: generateBuildLog() },
      { id: "d-2j", appId: "app-2", status: "live", commitMessage: "init: bootstrap API", sha: "l8m9n0o", author: "pedro", time: "2026-02-17T08:00:00Z", buildLog: generateBuildLog() },
    ],
  },
  {
    id: "app-3",
    name: "docs-site",
    framework: "static",
    status: "building",
    domain: "docs.deploy.app",
    lastDeployTime: "2026-02-26T12:00:00Z",
    envVars: [],
    deploys: [
      { id: "d-3a", appId: "app-3", status: "building", commitMessage: "feat: nova seção de tutoriais", sha: "p1q2r3s", author: "lucia", time: "2026-02-26T12:00:00Z", buildLog: ["Clonando repositório...", "Instalando dependências...", "Executando build..."] },
      { id: "d-3b", appId: "app-3", status: "live", commitMessage: "fix: links quebrados", sha: "t4u5v6w", author: "lucia", time: "2026-02-25T18:30:00Z", buildLog: generateBuildLog() },
      { id: "d-3c", appId: "app-3", status: "live", commitMessage: "feat: search docs", sha: "x7y8z9a", author: "carlos", time: "2026-02-24T11:00:00Z", buildLog: generateBuildLog() },
      { id: "d-3d", appId: "app-3", status: "live", commitMessage: "style: redesign sidebar", sha: "b0c1d2e", author: "lucia", time: "2026-02-23T13:30:00Z", buildLog: generateBuildLog() },
      { id: "d-3e", appId: "app-3", status: "live", commitMessage: "feat: versioning docs", sha: "f3g4h5i", author: "carlos", time: "2026-02-22T09:00:00Z", buildLog: generateBuildLog() },
      { id: "d-3f", appId: "app-3", status: "failed", commitMessage: "chore: migration MDX", sha: "j6k7l8m", author: "lucia", time: "2026-02-21T16:00:00Z", buildLog: generateFailedBuildLog() },
      { id: "d-3g", appId: "app-3", status: "live", commitMessage: "feat: API reference", sha: "n9o0p1q", author: "carlos", time: "2026-02-20T14:30:00Z", buildLog: generateBuildLog() },
      { id: "d-3h", appId: "app-3", status: "live", commitMessage: "feat: changelog page", sha: "r2s3t4u", author: "lucia", time: "2026-02-19T10:00:00Z", buildLog: generateBuildLog() },
      { id: "d-3i", appId: "app-3", status: "live", commitMessage: "fix: mobile nav", sha: "v5w6x7y", author: "carlos", time: "2026-02-18T15:00:00Z", buildLog: generateBuildLog() },
      { id: "d-3j", appId: "app-3", status: "live", commitMessage: "init: docs setup", sha: "z8a9b0c", author: "lucia", time: "2026-02-17T07:30:00Z", buildLog: generateBuildLog() },
    ],
  },
  {
    id: "app-4",
    name: "ecommerce-app",
    framework: "nextjs",
    status: "failed",
    domain: "shop.deploy.app",
    lastDeployTime: "2026-02-26T06:45:00Z",
    envVars: [
      { key: "STRIPE_SECRET_KEY", value: "sk_test_..." },
      { key: "DATABASE_URL", value: "postgresql://..." },
    ],
    deploys: [
      { id: "d-4a", appId: "app-4", status: "failed", commitMessage: "feat: checkout redesign", sha: "d1e2f3g", author: "rafael", time: "2026-02-26T06:45:00Z", buildLog: generateFailedBuildLog() },
      { id: "d-4b", appId: "app-4", status: "live", commitMessage: "feat: filtro de produtos", sha: "h4i5j6k", author: "rafael", time: "2026-02-25T12:00:00Z", buildLog: generateBuildLog() },
      { id: "d-4c", appId: "app-4", status: "live", commitMessage: "fix: cart sync", sha: "l7m8n9o", author: "bruna", time: "2026-02-24T17:00:00Z", buildLog: generateBuildLog() },
      { id: "d-4d", appId: "app-4", status: "live", commitMessage: "feat: wishlist", sha: "p0q1r2s", author: "rafael", time: "2026-02-23T08:30:00Z", buildLog: generateBuildLog() },
      { id: "d-4e", appId: "app-4", status: "live", commitMessage: "feat: reviews system", sha: "t3u4v5w", author: "bruna", time: "2026-02-22T14:00:00Z", buildLog: generateBuildLog() },
      { id: "d-4f", appId: "app-4", status: "live", commitMessage: "fix: payment webhook", sha: "x6y7z8a", author: "rafael", time: "2026-02-21T10:00:00Z", buildLog: generateBuildLog() },
      { id: "d-4g", appId: "app-4", status: "live", commitMessage: "feat: order tracking", sha: "b9c0d1e", author: "bruna", time: "2026-02-20T16:00:00Z", buildLog: generateBuildLog() },
      { id: "d-4h", appId: "app-4", status: "live", commitMessage: "feat: admin panel", sha: "f2g3h4i", author: "rafael", time: "2026-02-19T11:30:00Z", buildLog: generateBuildLog() },
      { id: "d-4i", appId: "app-4", status: "live", commitMessage: "chore: optimize images", sha: "j5k6l7m", author: "bruna", time: "2026-02-18T13:00:00Z", buildLog: generateBuildLog() },
      { id: "d-4j", appId: "app-4", status: "live", commitMessage: "init: ecommerce setup", sha: "n8o9p0q", author: "rafael", time: "2026-02-17T10:00:00Z", buildLog: generateBuildLog() },
    ],
  },
  {
    id: "app-5",
    name: "blog-platform",
    framework: "nextjs",
    status: "paused",
    domain: "blog.deploy.app",
    lastDeployTime: "2026-02-20T10:00:00Z",
    envVars: [
      { key: "CMS_API_KEY", value: "cms_..." },
    ],
    deploys: [
      { id: "d-5a", appId: "app-5", status: "live", commitMessage: "feat: RSS feed", sha: "r1s2t3u", author: "camila", time: "2026-02-20T10:00:00Z", buildLog: generateBuildLog() },
      { id: "d-5b", appId: "app-5", status: "live", commitMessage: "feat: MDX support", sha: "v4w5x6y", author: "camila", time: "2026-02-19T15:00:00Z", buildLog: generateBuildLog() },
      { id: "d-5c", appId: "app-5", status: "live", commitMessage: "fix: pagination", sha: "z7a8b9c", author: "diego", time: "2026-02-18T09:00:00Z", buildLog: generateBuildLog() },
      { id: "d-5d", appId: "app-5", status: "live", commitMessage: "feat: categorias", sha: "d0e1f2g", author: "camila", time: "2026-02-17T14:00:00Z", buildLog: generateBuildLog() },
      { id: "d-5e", appId: "app-5", status: "live", commitMessage: "init: blog setup", sha: "h3i4j5k", author: "diego", time: "2026-02-16T08:00:00Z", buildLog: generateBuildLog() },
    ],
  },
  {
    id: "app-6",
    name: "landing-page",
    framework: "static",
    status: "live",
    domain: "launch.deploy.app",
    lastDeployTime: "2026-02-25T20:00:00Z",
    envVars: [],
    deploys: [
      { id: "d-6a", appId: "app-6", status: "live", commitMessage: "feat: animações de scroll", sha: "l6m7n8o", author: "fernanda", time: "2026-02-25T20:00:00Z", buildLog: generateBuildLog() },
      { id: "d-6b", appId: "app-6", status: "live", commitMessage: "feat: seção de pricing", sha: "p9q0r1s", author: "fernanda", time: "2026-02-24T16:00:00Z", buildLog: generateBuildLog() },
      { id: "d-6c", appId: "app-6", status: "live", commitMessage: "fix: hero image", sha: "t2u3v4w", author: "tiago", time: "2026-02-23T11:00:00Z", buildLog: generateBuildLog() },
      { id: "d-6d", appId: "app-6", status: "live", commitMessage: "feat: testimonials", sha: "x5y6z7a", author: "fernanda", time: "2026-02-22T19:00:00Z", buildLog: generateBuildLog() },
      { id: "d-6e", appId: "app-6", status: "failed", commitMessage: "chore: webpack config", sha: "b8c9d0e", author: "tiago", time: "2026-02-21T14:30:00Z", buildLog: generateFailedBuildLog() },
      { id: "d-6f", appId: "app-6", status: "live", commitMessage: "feat: FAQ section", sha: "f1g2h3i", author: "fernanda", time: "2026-02-20T12:00:00Z", buildLog: generateBuildLog() },
      { id: "d-6g", appId: "app-6", status: "live", commitMessage: "feat: CTA section", sha: "j4k5l6m", author: "tiago", time: "2026-02-19T16:00:00Z", buildLog: generateBuildLog() },
      { id: "d-6h", appId: "app-6", status: "live", commitMessage: "style: tipografia", sha: "n7o8p9q", author: "fernanda", time: "2026-02-18T10:30:00Z", buildLog: generateBuildLog() },
      { id: "d-6i", appId: "app-6", status: "live", commitMessage: "feat: footer redesign", sha: "r0s1t2u", author: "tiago", time: "2026-02-17T13:00:00Z", buildLog: generateBuildLog() },
      { id: "d-6j", appId: "app-6", status: "live", commitMessage: "init: landing page", sha: "v3w4x5y", author: "fernanda", time: "2026-02-16T09:00:00Z", buildLog: generateBuildLog() },
    ],
  },
]

export function getApp(id: string): App | undefined {
  return mockApps.find((app) => app.id === id)
}

export function getAllDeploys(): Deploy[] {
  return mockApps
    .flatMap((app) =>
      app.deploys.map((deploy) => ({ ...deploy, appName: app.name }))
    )
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "agora"
  if (diffMin < 60) return `${diffMin}min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  return date.toLocaleDateString("pt-BR")
}

export function getStatusColor(status: AppStatus | DeployStatus): string {
  switch (status) {
    case "live":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/20"
    case "building":
      return "bg-amber-500/15 text-amber-700 border-amber-500/20"
    case "failed":
      return "bg-red-500/15 text-red-700 border-red-500/20"
    case "paused":
      return "bg-muted text-muted-foreground border-border"
    case "queued":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getFrameworkLabel(framework: Framework): string {
  switch (framework) {
    case "nextjs":
      return "Next.js"
    case "node":
      return "Node"
    case "static":
      return "Static"
  }
}

export const mockLogs = [
  { time: "12:00:01", level: "info" as LogLevel, message: "Servidor iniciado na porta 3000" },
  { time: "12:00:02", level: "info" as LogLevel, message: "Conexão com banco de dados estabelecida" },
  { time: "12:00:05", level: "info" as LogLevel, message: "GET /api/health 200 12ms" },
  { time: "12:00:08", level: "info" as LogLevel, message: "GET /api/users 200 45ms" },
  { time: "12:00:12", level: "warn" as LogLevel, message: "Cache miss para key: user:123" },
  { time: "12:00:15", level: "info" as LogLevel, message: "POST /api/auth/login 200 89ms" },
  { time: "12:00:18", level: "error" as LogLevel, message: "Failed to fetch external API: timeout after 5000ms" },
  { time: "12:00:20", level: "info" as LogLevel, message: "GET /api/products 200 34ms" },
  { time: "12:00:22", level: "info" as LogLevel, message: "WebSocket connection established" },
  { time: "12:00:25", level: "warn" as LogLevel, message: "Rate limit approaching for IP: 192.168.1.1" },
  { time: "12:00:28", level: "info" as LogLevel, message: "GET /api/orders 200 56ms" },
  { time: "12:00:30", level: "error" as LogLevel, message: "Unhandled promise rejection in worker thread" },
  { time: "12:00:33", level: "info" as LogLevel, message: "Cache invalidated for key: products:all" },
  { time: "12:00:35", level: "info" as LogLevel, message: "GET /api/health 200 8ms" },
  { time: "12:00:38", level: "info" as LogLevel, message: "Background job completed: email-queue" },
]
