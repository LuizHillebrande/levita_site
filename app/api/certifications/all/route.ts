import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const certifications = await prisma.certification.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ certifications })
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar certificações' },
      { status: 500 }
    )
  }
}
