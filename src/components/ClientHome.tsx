'use client'

import { Copy, Mail, Search, MapPin, Building2, Globe, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
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

// Email templates
const templates = {
  hook: {
    name: "The Hook",
    subject: (data: { businessType: string; city: string; businessName: string }) => 
      `Question about ${data.businessType} | ${data.businessName}`,
    body: (data: { businessType: string; city: string; businessName: string }) => 
      `Hi there,

I was searching for a ${data.businessType} in ${data.city} today and came across the ${data.businessName} website. It looks a bit outdated and was difficult to navigate on mobile, which can cause potential customers to leave before they contact you.

I build high-speed sites for local trades, so I created a fully functional demo (including Services, Gallery, and Reviews pages) as an example of what's possible with modern tech. I recorded a 30-second walkthrough. Would you like to see it?

Best regards,
Radu`
  },
  proof: {
    name: "The Proof",
    subject: (data: { businessName: string }) => `Here is the video – ${data.businessName} Demo`,
    body: () => `Hi again,

Thanks for the reply! Here is the 30-second walkthrough I recorded for you: ${'[INSERT LOOM LINK]'}

This isn't just a website—it's a lead generation machine. It's built on the same technology as Netflix and Uber (Next.js), so it loads instantly on mobile and converts more visitors into paying customers.

Would you like me to send the LIVE link so you can click around and test it yourself?

Best,
Radu`
  }
}

function ContactCard({ contact, onUpdate }: { contact: Contact, onUpdate: (id: number, field: 'initialContact' | 'followUp', value: string | null) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const openEmail = (subject: string, body: string) => {
    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailto)
  }

  const toggleContact = (field: 'initialContact' | 'followUp') => {
    const newValue = contact[field] ? null : new Date().toISOString().split('T')[0]
    onUpdate(contact.id, field, newValue)
  }

  const hookData = {
    businessType: contact.businessType || 'local business',
    city: contact.city || 'your area',
    businessName: contact.businessName
  }

  const hookSubject = templates.hook.subject(hookData)
  const hookBody = templates.hook.body(hookData)
  const proofSubject = templates.proof.subject(hookData)
  const proofBody = templates.proof.body()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{contact.businessName}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {contact.businessType && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  <Building2 size={12} />
                  {contact.businessType}
                </span>
              )}
              {contact.city && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  <MapPin size={12} />
                  {contact.city}
                </span>
              )}
              {contact.websiteGenerator && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  <Globe size={12} />
                  {contact.websiteGenerator.length > 20 ? contact.websiteGenerator.substring(0, 20) + '...' : contact.websiteGenerator}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-2">{contact.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {contact.initialContact && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                <Check size={12} />
                Contacted {contact.initialContact}
              </span>
            )}
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          {/* Status Checkboxes */}
          <div className="flex gap-4 mb-4 pb-4 border-b border-slate-200">
            <button
              onClick={() => toggleContact('initialContact')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                contact.initialContact 
                  ? 'bg-green-100 border-green-300 text-green-800' 
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {contact.initialContact ? <Check size={16} /> : <X size={16} />}
              Initial Contact
              {contact.initialContact && <span className="text-xs">({contact.initialContact})</span>}
            </button>
            <button
              onClick={() => toggleContact('followUp')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                contact.followUp 
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {contact.followUp ? <Check size={16} /> : <X size={16} />}
              Follow Up
              {contact.followUp && <span className="text-xs">({contact.followUp})</span>}
            </button>
          </div>

          {/* The Hook Template */}
          <div className="mb-6">
            <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {templates.hook.name}
            </h4>
            <div className="bg-white rounded-md border border-slate-200 p-3 mb-3">
              <p className="text-xs text-slate-500 mb-1">Subject:</p>
              <p className="text-sm text-slate-900">{hookSubject}</p>
            </div>
            <div className="bg-white rounded-md border border-slate-200 p-3 mb-3">
              <p className="text-xs text-slate-500 mb-1">Body:</p>
              <p className="text-sm text-slate-900 whitespace-pre-wrap">{hookBody}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(hookSubject, 'hook-subject')}
                className="inline-flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded transition-colors"
              >
                <Copy size={14} />
                {copied === 'hook-subject' ? 'Copied!' : 'Copy Subject'}
              </button>
              <button
                onClick={() => copyToClipboard(hookBody, 'hook-body')}
                className="inline-flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded transition-colors"
              >
                <Copy size={14} />
                {copied === 'hook-body' ? 'Copied!' : 'Copy Body'}
              </button>
              <button
                onClick={() => openEmail(hookSubject, hookBody)}
                className="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
              >
                <Mail size={14} />
                Open in Email
              </button>
            </div>
          </div>

          {/* The Proof Template */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {templates.proof.name}
            </h4>
            <div className="bg-white rounded-md border border-slate-200 p-3 mb-3">
              <p className="text-xs text-slate-500 mb-1">Subject:</p>
              <p className="text-sm text-slate-900">{proofSubject}</p>
            </div>
            <div className="bg-white rounded-md border border-slate-200 p-3 mb-3">
              <p className="text-xs text-slate-500 mb-1">Body:</p>
              <p className="text-sm text-slate-900 whitespace-pre-wrap">{proofBody}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(proofSubject, 'proof-subject')}
                className="inline-flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded transition-colors"
              >
                <Copy size={14} />
                {copied === 'proof-subject' ? 'Copied!' : 'Copy Subject'}
              </button>
              <button
                onClick={() => copyToClipboard(proofBody, 'proof-body')}
                className="inline-flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded transition-colors"
              >
                <Copy size={14} />
                {copied === 'proof-body' ? 'Copied!' : 'Copy Body'}
              </button>
              <button
                onClick={() => openEmail(proofSubject, proofBody)}
                className="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-colors"
              >
                <Mail size={14} />
                Open in Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ClientHome({ contacts: initialContacts, cities, onUpdate }: { contacts: Contact[], cities: string[], onUpdate: (id: number, field: 'initialContact' | 'followUp', value: string | null) => void }) {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [contacts, setContacts] = useState(initialContacts)

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !search || 
      contact.businessName.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
    const matchesCity = !cityFilter || contact.city === cityFilter
    return matchesSearch && matchesCity
  })

  const handleUpdate = (id: number, field: 'initialContact' | 'followUp', value: string | null) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
    onUpdate(id, field, value)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Outreach Email Generator</h1>
          <p className="text-sm text-slate-500">{contacts.length} contacts in database</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by business name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} onUpdate={handleUpdate} />
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <p className="text-center text-slate-500 py-8">No contacts found</p>
        )}
      </main>
    </div>
  )
}
