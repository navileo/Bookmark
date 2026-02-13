'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Globe, Link as LinkIcon, Loader2 } from 'lucide-react'

export default function AddBookmarkForm({ user, onAdd }: { user: any, onAdd: (bookmark: any) => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    
    // Optimistic ID for instant feedback
    const tempId = Math.random().toString(36).substring(7)
    const newBookmark = {
      id: tempId,
      title,
      url,
      created_at: new Date().toISOString(),
      user_id: user.id
    }

    // Clear form immediately
    setTitle('')
    setUrl('')

    // Optimistically add to UI
    onAdd(newBookmark)

    const { data, error } = await supabase.from('bookmarks').insert([
      { title: newBookmark.title, url: newBookmark.url, user_id: user.id },
    ]).select()

    if (error) {
      console.error('Error adding bookmark:', error)
      // If error, the parent will re-fetch anyway due to real-time or we could handle rollback
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-3 p-2"
    >
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Globe className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Website Name (e.g. GitHub)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
            required
          />
        </div>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            placeholder="https://github.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="md:w-32 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </>
        )}
      </button>
    </form>
  )
}
