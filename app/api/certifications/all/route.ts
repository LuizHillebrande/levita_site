import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching all certifications (admin)...')
    const auth = await verifyAuth(request)

    if (!auth || auth.role !== 'admin') {
      console.log('Unauthorized access attempt to /api/certifications/all')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.log('Admin authenticated, fetching all certifications...')
    const certifications = await prisma.certification.findMany({
      orderBy: { order: 'asc' },
    })

    console.log(`Found ${certifications.length} certifications (all)`)
    return NextResponse.json({ certifications })
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar certificações', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
