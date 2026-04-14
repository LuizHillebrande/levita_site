import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(request)
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const status = body.status as string
    if (!['PENDING', 'APPROVED', 'HIDDEN'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido. Use PENDING, APPROVED ou HIDDEN.' },
        { status: 400 }
      )
    }

    const review = await prisma.productReview.update({
      where: { id: params.id },
      data: { status: status as 'PENDING' | 'APPROVED' | 'HIDDEN' },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Erro ao atualizar avaliação' }, { status: 500 })
  }
}
