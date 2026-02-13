import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { ClientHome } from '@/components/ClientHome'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

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

// Server-side data fetching
async function getContacts(): Promise<Contact[]> {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  
  try {
    const contacts = await prisma.$queryRaw<Contact[]>`
      SELECT 
        id,
        business_name as "businessName",
        email,
        website,
        website_generator as "websiteGenerator",
        business_type as "businessType",
        city,
        initial_contact as "initialContact",
        follow_up as "followUp",
        notes
      FROM contacts
      ORDER BY id
    `
    return contacts
  } catch (e) {
    console.error('DB Error:', e)
    return []
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

export default async function Home() {
  const contacts = await getContacts()
  const cities = [...new Set(contacts.map(c => c.city).filter(Boolean))] as string[]

  return <ClientHome contacts={contacts} cities={cities} />
}
