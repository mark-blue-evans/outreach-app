'use client'

import { ClientHome } from '@/components/ClientHome'
import { useState, useEffect, useMemo, useCallback } from 'react'

type Contact = {
  id: number
  businessName: string
  email: string
  website: string | null
  websiteGenerator: string | null
  businessType: string | null
  city: string | null
  initialContact: string | null
  followUp: string | null
  notes: string | null
  hookEmail: string | null
  followUpEmail: string | null
}

type PaginationInfo = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  
  // Cache for fetched pages
  const [pageCache, setPageCache] = useState<Map<number, Contact[]>>(new Map())

  const loadPage = useCallback(async (pageNum: number) => {
    // Check cache first
    if (pageCache.has(pageNum)) {
      setContacts(pageCache.get(pageNum)!)
      setPage(pageNum)
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/contacts?page=${pageNum}&limit=20`)
      const data = await res.json()
      
      // Cache the results
      setPageCache(prev => new Map(prev).set(pageNum, data.contacts))
      setContacts(data.contacts)
      setPagination(data.pagination)
      setPage(pageNum)
    } catch (e) {
      console.error('Failed to load contacts:', e)
    } finally {
      setLoading(false)
    }
  }, [pageCache])

  // Initial load
  useEffect(() => {
    loadPage(1)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      loadPage(newPage)
    }
  }

  const handleUpdate = async (id: number, field: 'initialContact' | 'followUp', value: string | null) => {
    // Optimistic update
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
    
    // Call API
    await fetch('/api/contacts/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, field, value })
    })
  }

  const cities = useMemo(() => {
    // Get unique cities from all cached pages
    const allContacts = Array.from(pageCache.values()).flat()
    return [...new Set(allContacts.map(c => c.city).filter(Boolean))] as string[]
  }, [pageCache])

  if (loading && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading contacts...</p>
      </div>
    )
  }

  return (
    <ClientHome 
      contacts={contacts} 
      cities={cities} 
      onUpdate={handleUpdate}
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  )
}
