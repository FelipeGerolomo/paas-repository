import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Login - Deploy Dashboard",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoginForm />
    </div>
  )
}
