'use client'

import React, { useState } from 'react'
import { Search, ChevronDown, Users, ShoppingBag, FileText, Mail, Phone } from 'lucide-react'

interface Props {
  customersList: any[]
  ordersList: any[]
  quotesList: any[]
}

export function CustomersManager({ customersList, ordersList, quotesList, activeAccordion, onAccordionChange }: Props & { activeAccordion: {section:string, id:number|null}, onAccordionChange: (section:string, id:number|null) => void }) {
  const [search, setSearch] = useState('')
  // use accordion state from parent for auto-close across sections
  const expanded = activeAccordion.section === 'customers' ? activeAccordion.id : null

  const ordersFor = (c: any) =>
    ordersList.filter((o: any) =>
      o.customerId != null ? o.customerId === c.id : String(o.customerEmail || '').toLowerCase() === String(c.email || '').toLowerCase()
    )

  const quotesFor = (c: any) =>
    quotesList.filter((q: any) =>
      q.customerId != null ? q.customerId === c.id : String(q.customerEmail || '').toLowerCase() === String(c.email || '').toLowerCase()
    )

  const filtered = customersList.filter((c: any) => {
    if (search && !(`${c.name} ${c.email || ''} ${c.phone || ''} ${c.company || ''}`).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalSpend = (orders: any[]) => orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + parseFloat(o.total || '0'), 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400"
          />
        </div>
        <span className="text-xs text-gray-400 font-semibold">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
              <tr>{['Customer', 'Contact', 'Company', 'Orders', 'Total Spend', 'Joined', ''].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c: any) => {
                const orders = ordersFor(c)
                const quotes = quotesFor(c)
                const spend = totalSpend(orders)
                const isOpen = expanded === c.id
                return (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onAccordionChange('customers', isOpen ? null : c.id)}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-800">{c.name}</span>
                          {c.userId && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold uppercase border border-blue-100">Account</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-gray-500"><Mail className="w-3 h-3" /> {c.email}</div>
                          {c.phone && <div className="flex items-center gap-1.5 text-gray-500"><Phone className="w-3 h-3" /> {c.phone}</div>}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{c.company || '—'}</td>
                      <td className="p-3 text-gray-700">{orders.length}</td>
                      <td className="p-3 font-bold text-gray-900 whitespace-nowrap">KES {spend.toLocaleString()}</td>
                      <td className="p-3 text-gray-400 whitespace-nowrap">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="p-3 text-right">
                        <ChevronDown className={`w-4 h-4 text-gray-400 inline transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-gray-50 border-y border-gray-100">
                        <td colSpan={7} className="p-0">
                          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><ShoppingBag className="w-3 h-3" /> Orders ({orders.length})</h4>
                              {orders.length > 0 ? (
                                <div className="space-y-1.5">
                                  {orders.map((o: any) => (
                                    <div key={o.id} className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs">
                                      <span className="font-mono text-primary font-bold">{o.orderNumber}</span>
                                      <span className="text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                                      <span className="text-gray-800 font-bold">KES {Number(o.total).toLocaleString()}</span>
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-600 border border-gray-200">{o.status}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">No orders yet.</p>
                              )}
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3 h-3" /> Quote Requests ({quotes.length})</h4>
                              {quotes.length > 0 ? (
                                <div className="space-y-1.5">
                                  {quotes.map((q: any) => (
                                    <div key={q.id} className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs">
                                      <span className="font-mono text-primary font-bold">{q.quoteNumber}</span>
                                      <span className="text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-600 border border-gray-200">{q.status}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">No quote requests yet.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
