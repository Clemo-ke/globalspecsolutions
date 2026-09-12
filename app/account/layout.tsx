import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { MainHeader } from '@/components/main-header'
import { getSiteSettings, getProductCategories } from '@/lib/db-data'
import { Button } from '@/components/ui/button'
import { AccountNav } from '@/components/account-nav'
import { LogOut } from 'lucide-react'
import { getRoleBySlug } from '@/lib/permissions'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const [session, siteSettings, categories] = await Promise.all([
    auth.api.getSession({ headers: await headers() }).catch(() => null),
    getSiteSettings(),
    getProductCategories(),
  ])

  if (!session?.user) {
    redirect('/sign-in?next=/account')
  }

  const role = String((session.user as any).role || '').toLowerCase()
  const roleRecord = await getRoleBySlug(role)
  if (roleRecord?.isAdmin || role === 'admin' || role === 'super-admin') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader categories={categories} siteSettings={siteSettings} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Signed in as <span className="font-semibold text-foreground">{session.user.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-2">
            <AccountNav />
            <form
              action={async () => {
                'use server'
                await auth.api.signOut({ headers: await headers() })
                redirect('/')
              }}
            >
              <Button type="submit" variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-sm font-semibold">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </form>
          </aside>
          <div className="lg:col-span-9 space-y-5">{children}</div>
        </div>
      </main>
    </div>
  )
}