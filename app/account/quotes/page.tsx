import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
  getCustomerByUser,
  getCustomerByEmail,
  getQuotesByCustomer,
  getQuotesByEmail,
  getQuoteItemsByQuoteId,
} from '@/lib/db-data'
import { quoteStatusColor } from '@/lib/order-meta'
import { FileText } from 'lucide-react'

export default async function AccountQuotesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const email = session.user.email!
  let customer = await getCustomerByUser(session.user.id)
  if (!customer) customer = await getCustomerByEmail(email)

  const quotes = customer ? await getQuotesByCustomer(customer.id) : await getQuotesByEmail(email)
  const itemsByQuote = new Map<number, any[]>()
  for (const q of quotes) {
    itemsByQuote.set(q.id, await getQuoteItemsByQuoteId(q.id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">My Quotes</h2>
        </div>
        <Link href="/quote" className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          New Quote Request
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            No quote requests yet. Our engineering team prepares quotations for products that require one.
          </p>
          <Link href="/quote" className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            Request a quote
          </Link>
        </div>
      ) : (
        quotes.map((q) => {
          const items = itemsByQuote.get(q.id) || []
          return (
            <div key={q.id} className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">{q.quoteNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(q.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {q.companyName ? ` — ${q.companyName}` : ''}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${quoteStatusColor(q.status)}`}>{q.status}</span>
              </div>

              <div className="divide-y divide-border/50">
                {items.length === 0 ? (
                  <p className="p-4 text-xs text-muted-foreground">Requested via quote form (no items listed).</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground line-clamp-1">{item.productName}</p>
                        {item.notes && <p className="text-muted-foreground mt-0.5 line-clamp-1">{item.notes}</p>}
                      </div>
                      <span className="font-bold whitespace-nowrap">Qty {item.quantity}</span>
                    </div>
                  ))
                )}
              </div>

              {q.notes && (
                <div className="p-4 bg-muted/20 border-t border-border/60 text-xs text-muted-foreground">
                  Request notes: {q.notes}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}