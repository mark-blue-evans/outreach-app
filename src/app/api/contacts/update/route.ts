import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { id, field, value } = await request.json()
    
    await prisma.contact.update({
      where: { id },
      data: { [field]: value }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
