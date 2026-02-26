"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Rocket } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/apps", label: "Apps" },
  { href: "/deploys", label: "Deploys" },
  { href: "/settings", label: "Configurações" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/apps" className="flex items-center gap-2 font-semibold tracking-tight">
          <Rocket className="size-5" />
          <span>Deploy</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            U
          </div>
        </div>
      </div>
    </header>
  )
}
