export function orderStatusColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Contacted': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'Confirmed': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Processing': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200'
    case 'Pending': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Failed': return 'bg-red-50 text-red-600 border-red-200'
    case 'Refunded': return 'bg-slate-100 text-slate-600 border-slate-200'
    default: return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

export function quoteStatusColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Under Review': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Quotation Sent': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'Negotiating': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Converted to Order': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Rejected': return 'bg-red-50 text-red-600 border-red-200'
    case 'Expired': return 'bg-red-50 text-red-600 border-red-200'
    default: return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}