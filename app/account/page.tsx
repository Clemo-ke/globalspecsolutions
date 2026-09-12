import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
  getCustomerByUser,
  getCustomerByEmail,
  getOrdersByCustomer,
  getOrdersByEmail,
  getQuotesByCustomer,
  getQuotesByEmail,
  getCustomerAddresses,
  getOrderItemsByOrderId,
} from '@/lib/db-data'
import { ShoppingBag, FileText, MapPin, ChevronRight } from 'lucide-react'
import { orderStatusColor, quoteStatusColor } from '@/lib/order-meta'

export default async function AccountOverviewPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const email = session.user.email!
  let customer = await getCustomerByUser(session.user.id)
  if (!customer) customer = await getCustomerByEmail(email)

  const orders = customer ? await getOrdersByCustomer(customer.id) : await getOrdersByEmail(email)
  const quotes = customer ? await getQuotesByCustomer(customer.id) : await getQuotesByEmail(email)
  const addresses = customer ? await getCustomerAddresses(customer.id) : []

  const recentOrders = orders.slice(0, 3)
  const recentQuotes = quotes.slice(0, 3)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard href="/account/orders" icon={<ShoppingBag className="w-5 h-5" />} label="Total Orders" value={orders.length} />
        <StatCard href="/account/quotes" icon={<FileText className="w-5 h-5" />} label="Quote Requests" value={quotes.length} />
        <StatCard href="/account/addresses" icon={<MapPin className="w-5 h-5" />} label="Saved Addresses" value={addresses.length} />
      </div>

      <section className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <h2 className="text-sm font-bold">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">You have no orders yet.</p>
            <Link href="/shop" className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {recentOrders.map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-foreground">#{o.orderNumber}</p>
                  <p className="text-muted-foreground mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' — '}KES {Number(o.total).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${orderStatusColor(o.status)}`}>{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <h2 className="text-sm font-bold">Recent Quote Requests</h2>
          <Link href="/account/quotes" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">You have no quote requests yet.</p>
            <Link href="/quote" className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
              Request a quote
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {recentQuotes.map((q) => (
              <div key={q.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-foreground">{q.quoteNumber}</p>
                  <p className="text-muted-foreground mt-0.5">
                    {new Date(q.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${quoteStatusColor(q.status)}`}>{q.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: number }) {
  return (
    <Link href={href} className="bg-card border border-border/60 rounded-xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors">
      <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
    </Link>
  )
}