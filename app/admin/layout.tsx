import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Button } from '@/components/ui/button'
import { LogOut, LayoutDashboard, Images, Package, Zap, Users, Briefcase, Layers } from 'lucide-react'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-extrabold text-xl tracking-wider text-primary uppercase">
            GlobalSpec Admin
          </Link>
          <span className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-full font-semibold">
            CMS Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Logged in as <strong className="text-slate-200">{session.user.email}</strong>
          </span>
          <form action={async () => {
            'use server'
            await auth.api.signOut({ headers: await headers() })
            redirect('/sign-in')
          }}>
            <Button type="submit" variant="outline" size="sm" className="gap-2 border-slate-700 hover:bg-slate-800 text-slate-200">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
