'use client'

import { ClientHome } from '@/components/ClientHome'
import { useState, useEffect } from 'react'

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
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const loadContacts = () => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setContacts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadContacts()
  }, [])

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

  const cities = [...new Set(contacts.map(c => c.city).filter(Boolean))] as string[]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading contacts...</p>
      </div>
    )
  }

  return <ClientHome contacts={contacts} cities={cities} onUpdate={handleUpdate} />
}
