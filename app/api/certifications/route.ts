import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')
    console.log('Fetching certifications from database...')
    const certifications = await prisma.certification.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })

    console.log(`Found ${certifications.length} active certifications`)
    return NextResponse.json({ certifications })
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar certificações', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const auth = await verifyAuth(request)

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, description, image, order } = data

    const certification = await prisma.certification.create({
      data: {
        name,
        description: description || null,
        image: image || null,
        order: order || 0,
        active: true,
      },
    })

    return NextResponse.json({ certification }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating certification:', error)
    return NextResponse.json(
      { error: 'Erro ao criar certificação' },
      { status: 500 }
    )
  }
}
