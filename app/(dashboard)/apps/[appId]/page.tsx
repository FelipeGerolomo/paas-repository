import { AppDetailClient } from "@/components/app-detail"
import { getApp, mockApps } from "@/lib/mock-data"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params
  const app = getApp(appId)
  return {
    title: app ? `${app.name} - Deploy Dashboard` : "App não encontrado",
  }
}

export default async function AppDetailPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params
  const app = getApp(appId)
  if (!app) notFound()
  return <AppDetailClient app={app} />
}
