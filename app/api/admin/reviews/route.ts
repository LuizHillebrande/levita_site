import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'HIDDEN' | null

  try {
    const reviews = await prisma.productReview.findMany({
      where: status && ['PENDING', 'APPROVED', 'HIDDEN'].includes(status) ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    })
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error listing reviews:', error)
    return NextResponse.json({ error: 'Erro ao listar avaliações' }, { status: 500 })
  }
}
