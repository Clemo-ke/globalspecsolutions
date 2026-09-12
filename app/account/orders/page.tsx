import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
  getCustomerByUser,
  getCustomerByEmail,
  getOrdersByCustomer,
  getOrdersByEmail,
  getOrderItemsByOrderId,
} from '@/lib/db-data'
import { orderStatusColor } from '@/lib/order-meta'
import { ShoppingBag } from 'lucide-react'

export default async function AccountOrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const email = session.user.email!
  let customer = await getCustomerByUser(session.user.id)
  if (!customer) customer = await getCustomerByEmail(email)

  const orders = customer ? await getOrdersByCustomer(customer.id) : await getOrdersByEmail(email)
  const itemsByOrder = new Map<number, any[]>()
  for (const o of orders) {
    itemsByOrder.set(o.id, await getOrderItemsByOrderId(o.id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-muted-foreground">You have no orders yet.</p>
          <Link href="/shop" className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            Browse the shop
          </Link>
        </div>
      ) : (
        orders.map((o) => {
          const items = itemsByOrder.get(o.id) || []
          return (
            <div key={o.id} className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">#{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(o.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${orderStatusColor(o.status)}`}>{o.status}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${orderStatusColor(o.paymentStatus || 'Pending')}`}>{o.paymentStatus || 'Pending'}</span>
                </div>
              </div>

              <div className="divide-y divide-border/50">
                {items.length === 0 ? (
                  <p className="p-4 text-xs text-muted-foreground">No items recorded.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground line-clamp-1">{item.productName}</p>
                        <p className="text-muted-foreground mt-0.5">x{item.quantity} @ KES {Number(item.unitPrice).toLocaleString()}</p>
                      </div>
                      <span className="font-bold whitespace-nowrap">KES {Number(item.totalPrice).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-muted/20 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-muted-foreground space-y-0.5">
                  {o.deliveryMethod && (
                    <span className="block">
                      Delivery: <span className="font-semibold text-foreground">{o.deliveryMethod}</span>
                      {o.shippingAddress ? ` — ${o.shippingAddress}` : ''}
                    </span>
                  )}
                  {Number(o.discountAmount || 0) > 0 && (
                    <span className="block text-emerald-600 font-semibold">
                      Coupon {o.couponCode ? `${o.couponCode} — ` : ''}discount: −KES {Number(o.discountAmount).toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="font-bold text-primary text-sm ml-auto">Total: KES {Number(o.total).toLocaleString()}</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}