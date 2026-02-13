'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Globe, Trash2, ExternalLink, MoreVertical } from 'lucide-react'

type BookmarkType = {
  id: string
  title: string
  url: string
  created_at: string
}

interface BookmarkListProps {
  bookmarks: BookmarkType[]
  loading: boolean
  onDelete: (id: string) => void
  searchQuery?: string
}

export default function BookmarkList({ 
  bookmarks, 
  loading, 
  onDelete, 
  searchQuery = '' 
}: BookmarkListProps) {
  const supabase = createClient()

  const deleteBookmark = async (id: string) => {
    // Optimistic delete
    onDelete(id)

    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) {
      console.error('Error deleting bookmark:', error)
      // The parent will re-fetch on real-time change or we could handle rollback
    }
  }

  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
        ))}
      </div>
    )
  }

  if (filteredBookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          {searchQuery ? 'No matches found' : 'Your collection is empty'}
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          {searchQuery ? 'Try adjusting your search terms' : 'Add your first bookmark to get started'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col relative"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-blue-100 transition-colors">
              <img 
                src={`https://www.google.com/s2/favicons?sz=128&domain=${new URL(bookmark.url).hostname}`}
                alt=""
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGExYjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PGxpbmUgeDE9IjIiIHkxPSIxMiIgeDI9IjIyIiB5Mj0iMTIiPjwvbGluZT48cGF0aCBkPSJNMTIgMmExNS4zIDE1LjMgMCAwIDEgNCAxMCAxNS4zIDE1LjMgMCAwIDEgLTQgMTBBMTUuMyAxNS4zIDAgMCAxIDggMTJhMTUuMyAxNS4zIDAgMCAxIDQtMTBaIj48L3BhdGg+PC9zdmc+'
                }}
              />
            </div>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow">
            <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
              {bookmark.title}
            </h3>
            <p className="text-slate-400 text-xs truncate font-medium">
              {new URL(bookmark.url).hostname}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {new Date(bookmark.created_at).toLocaleDateString()}
            </span>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
