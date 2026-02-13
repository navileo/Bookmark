'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bookmark as BookmarkIcon, Search, Plus } from 'lucide-react'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkForm from '@/components/AddBookmarkForm'

type BookmarkType = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const fetchBookmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookmarks:', error)
      } else {
        setBookmarks(data || [])
      }
    } catch (err) {
      console.error('Unexpected error fetching bookmarks:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        fetchBookmarks()
      } else {
        // If no session found immediately, we still wait for onAuthStateChange
        // in case the session is still being established from the hash
      }
    }
    
    checkUser()

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          setUser(session.user)
          fetchBookmarks()
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        router.push('/login')
      }
    })

    // Separate check for timeout or fallback
    const timeout = setTimeout(() => {
      if (loading && !user) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (!user) {
            setLoading(false)
            router.push('/login')
          }
        })
      }
    }, 3000)

    const subscription = supabase
      .channel('bookmarks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, () => {
        fetchBookmarks()
      })
      .subscribe()

    return () => {
      authListener.unsubscribe()
      supabase.removeChannel(subscription)
      clearTimeout(timeout)
    }
  }, [supabase, router, fetchBookmarks])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleAddBookmark = (newBookmark: BookmarkType) => {
    setBookmarks(prev => [newBookmark, ...prev])
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <BookmarkIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Bookmark</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search your bookmarks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm w-64 lg:w-80 transition-all outline-none"
              />
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search bookmarks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm outline-none"
          />
        </div>

        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Your Library</h2>
              <p className="text-slate-500 mt-1">Manage and organize your favorite links.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              Cloud Sync Active
            </div>
          </div>

          {/* Add Form */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <AddBookmarkForm user={user} onAdd={handleAddBookmark} />
          </div>

          {/* List Section */}
          <section>
            <BookmarkList 
              bookmarks={bookmarks} 
              loading={loading} 
              onDelete={handleDeleteBookmark} 
              searchQuery={searchQuery} 
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Smart Bookmark &bull; Built with Next.js & Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}
