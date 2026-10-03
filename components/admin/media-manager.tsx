'use client'

import React, { useRef, useState } from 'react'
import { Upload, Trash2, Copy, Check, Image, Monitor } from 'lucide-react'

interface Props {
  mediaList: any[]
  flash: (msg: string, ok?: boolean) => void
}

export function MediaManager({ mediaList, flash }: Props) {
  const [items, setItems] = useState<any[]>(mediaList)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (altText) fd.append('altText', altText)
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (res.ok) {
        setItems((prev) => [{ ...data, createdAt: new Date().toISOString() }, ...prev])
        setAltText('')
        flash(`Uploaded ${file.name}`)
      } else {
        flash(data.error || 'Upload failed', false)
      }
    } catch {
      flash('Upload failed', false)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const copyUrl = async (item: any) => {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopied(item.id)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      flash('Copy failed', false)
    }
  }

  const remove = async (item: any) => {
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== item.id))
        flash(`Deleted ${item.filename}`)
      }
    } catch {
      flash('Failed to delete media', false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">Upload Media</h3>
          <p className="text-[11px] text-gray-500">
            Uploaded images are saved as server assets and can be referenced from CMS fields (logo, hero, products, partners).
          </p>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Alt text / description"
            className="w-full sm:w-80 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Choose Image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
          <Monitor className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-xs">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img src={item.url} alt={item.altText || item.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-[10px] text-gray-500 truncate" title={item.filename}>{item.filename}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyUrl(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300"
                  >
                    {copied === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copied === item.id ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => remove(item)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}