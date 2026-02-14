'use client'

import { Copy, Mail, Search, MapPin, Building2, ChevronDown, ChevronUp, Send, CheckCircle, Clock, Users } from 'lucide-react'
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
  hookEmail: string | null
  followUpEmail: string | null
}

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
  const [followUpExpanded, setFollowUpExpanded] = useState(false)
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

  const hasHookEmail = !!contact.hookEmail
  const hasFollowUpEmail = !!contact.followUpEmail
  
  const parseEmail = (emailText: string | null) => {
    if (!emailText) return { subject: '', body: '' }
    const lines = emailText.split('\n')
    let subject = ''
    let body = ''
    let inBody = false
    for (const line of lines) {
      if (line.startsWith('Subject:')) {
        subject = line.replace('Subject:', '').trim()
      } else if (inBody) {
        body += line + '\n'
      } else if (line.trim() === '') {
        inBody = true
      }
    }
    return { subject: subject.trim(), body: body.trim() }
  }

  const hookData = {
    businessType: contact.businessType || 'local business',
    city: contact.city || 'your area',
    businessName: contact.businessName
  }

  const dbHook = parseEmail(contact.hookEmail)
  const hookSubject = dbHook.subject || templates.hook.subject(hookData)
  const hookBody = dbHook.body || templates.hook.body(hookData)
  
  const dbProof = parseEmail(contact.followUpEmail)
  const proofSubject = dbProof.subject || templates.proof.subject(hookData)
  const proofBody = dbProof.body || templates.proof.body()

  const statusColor = contact.initialContact 
    ? 'border-l-4 border-l-green-500' 
    : contact.followUp 
      ? 'border-l-4 border-l-amber-500' 
      : 'border-l-4 border-l-slate-300'

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${statusColor} transition-all hover:shadow-md`}>
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg truncate">{contact.businessName}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
              <button 
                onClick={(e) => { e.stopPropagation(); copyToClipboard(contact.email, 'email-' + contact.id) }}
                className={`hover:text-indigo-600 transition-colors font-medium ${copied === 'email-' + contact.id ? 'text-green-600' : ''}`}
                title="Click to copy email"
              >
                {copied === 'email-' + contact.id ? '✓ Copied!' : contact.email}
              </button>
              {contact.website && (
                <>
                  <span className="text-slate-300">|</span>
                  <a 
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-indigo-600 transition-colors text-blue-600 hover:underline"
                    title="Click to open website"
                  >
                    {contact.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {contact.businessType && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                  <Building2 size={12} />
                  {contact.businessType}
                </span>
              )}
              {contact.city && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                  <MapPin size={12} />
                  {contact.city}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              {contact.initialContact ? (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={12} />
                  Contacted
                </span>
              ) : (
                <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                  Pending
                </span>
              )}
            </div>
            {contact.followUp && (
              <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock size={12} />
                Follow-up sent
              </span>
            )}
            {expanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 p-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-slate-200">
            <button
              onClick={(e) => { e.stopPropagation(); toggleContact('initialContact') }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                contact.initialContact 
                  ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
                  : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              <Send size={14} />
              {contact.initialContact ? `Sent (${contact.initialContact})` : 'Mark as Contacted'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleContact('followUp') }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                contact.followUp 
                  ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600' 
                  : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              <Clock size={14} />
              {contact.followUp ? `Sent (${contact.followUp})` : 'Mark as Follow-up'}
            </button>
          </div>

          <div className="grid gap-4">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Initial Email
                </h4>
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(hookSubject, 'hook-subject') }}
                    className="flex items-center gap-1 text-xs bg-white border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded"
                  >
                    <Copy size={10} />
                    {copied === 'hook-subject' ? 'Copied!' : 'Copy Subject'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(hookBody, 'hook-body') }}
                    className="flex items-center gap-1 text-xs bg-white border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded"
                  >
                    <Copy size={10} />
                    {copied === 'hook-body' ? 'Copied!' : 'Copy Body'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); openEmail(hookSubject, hookBody) }}
                    className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium"
                  >
                    <Mail size={10} />
                    Send
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-slate-500 mb-1">Subject:</p>
                <p className="text-sm font-medium text-slate-800 mb-3">{hookSubject}</p>
                <p className="text-xs text-slate-500 mb-1">Body:</p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{hookBody}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div 
                className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={(e) => { e.stopPropagation(); setFollowUpExpanded(!followUpExpanded) }}
              >
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Follow-up Email
                  <span className="text-slate-400 ml-1">
                    {followUpExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </h4>
                {followUpExpanded && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(proofSubject, 'proof-subject') }}
                      className="flex items-center gap-1 text-xs bg-white border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded"
                    >
                      <Copy size={10} />
                      {copied === 'proof-subject' ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openEmail(proofSubject, proofBody) }}
                      className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded font-medium"
                    >
                      <Mail size={10} />
                      Send
                    </button>
                  </div>
                )}
              </div>
              {followUpExpanded && (
                <div className="p-3">
                  <p className="text-xs text-slate-500 mb-1">Subject:</p>
                  <p className="text-sm font-medium text-slate-800 mb-3">{proofSubject}</p>
                  <p className="text-xs text-slate-500 mb-1">Body:</p>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{proofBody}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ClientHome({ contacts, cities, onUpdate }: { contacts: Contact[], cities: string[], onUpdate: (id: number, field: 'initialContact' | 'followUp', value: string | null) => void }) {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const businessTypes = [...new Set(contacts.map(c => c.businessType).filter(Boolean))] as string[]

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !search || 
      contact.businessName.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
    const matchesCity = !cityFilter || contact.city === cityFilter
    const matchesType = !typeFilter || contact.businessType === typeFilter
    return matchesSearch && matchesCity && matchesType
  })

  const contactedCount = contacts.filter(c => c.initialContact).length
  const pendingCount = contacts.length - contactedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Outreach Manager
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Track and manage your outreach campaigns</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                {contacts.length} leads
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{contacts.length}</p>
                <p className="text-sm text-slate-500">Total Leads</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{contactedCount}</p>
                <p className="text-sm text-slate-500">Contacted</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {(search || cityFilter || typeFilter) && (
              <button
                onClick={() => { setSearch(''); setCityFilter(''); setTypeFilter('') }}
                className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
          {filteredContacts.length !== contacts.length && (
            <p className="text-sm text-slate-500 mt-3">
              Showing {filteredContacts.length} of {contacts.length} leads
            </p>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pb-8">
        <div className="space-y-3">
          {filteredContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} onUpdate={onUpdate} />
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No leads found</h3>
            <p className="text-slate-500">Try adjusting your filters or search term</p>
          </div>
        )}
      </main>
    </div>
  )
}
