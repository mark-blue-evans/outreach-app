'use client'

import { ClientHome } from '@/components/ClientHome'
import contactsData from '@/data/contacts.json'
import { useState } from 'react'

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
  const contacts = contactsData as Contact[]
  const cities = [...new Set(contacts.map(c => c.city).filter(Boolean))] as string[]

  const handleUpdate = async (id: number, field: 'initialContact' | 'followUp', value: string | null) => {
    // In production, this would call an API to update the database
    console.log(`Update contact ${id}: ${field} = ${value}`)
  }

  return <ClientHome contacts={contacts} cities={cities} onUpdate={handleUpdate} />
}
