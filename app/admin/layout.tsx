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

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/hero', label: 'Hero Slides', icon: Images },
    { href: '/admin/categories', label: 'Categories', icon: Layers },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/solutions', label: 'Solutions', icon: Zap },
    { href: '/admin/services', label: 'Services', icon: Briefcase },
    { href: '/admin/clients', label: 'Clients', icon: Users },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">{session.user.email}</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-colors group"
              >
                <Icon className="w-5 h-5 group-hover:text-accent" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <form action={async () => {
            'use server'
            await auth.api.signOut({ headers: await headers() })
            redirect('/sign-in')
          }}>
            <Button type="submit" variant="outline" className="w-full gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
