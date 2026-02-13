import { ClientHome } from '@/components/ClientHome'
import contactsData from '@/data/contacts.json'

type Contact = {
  id: number
  businessName: string
  email: string
  website: string | null
  websiteGenerator: string | null
  businessType: string | null
  city: string | null
  initialContact: string
  followUp: string
  notes: string | null
}

export default function Home() {
  const contacts = contactsData as Contact[]
  const cities = [...new Set(contacts.map(c => c.city).filter(Boolean))] as string[]

  return <ClientHome contacts={contacts} cities={cities} />
}
