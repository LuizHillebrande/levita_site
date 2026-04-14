import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const reviews = await prisma.productReview.findMany({
      where: { productId: params.id, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Erro ao buscar avaliações' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await request.json()
    const rating = Number(body.rating)
    const comment = typeof body.comment === 'string' ? body.comment.trim() : ''
    const authorName =
      typeof body.authorName === 'string' ? body.authorName.trim().slice(0, 120) : ''

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Avaliação deve ser de 1 a 5 estrelas' }, { status: 400 })
    }
    if (comment.length < 3 || comment.length > 2000) {
      return NextResponse.json(
        { error: 'Comentário deve ter entre 3 e 2000 caracteres' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findFirst({
      where: { id: params.id, active: true },
      select: { id: true },
    })
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const review = await prisma.productReview.create({
      data: {
        productId: params.id,
        rating,
        comment,
        authorName: authorName || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json(
      {
        review,
        message:
          'Avaliação enviada com sucesso. Ela será publicada após análise da nossa equipe.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Erro ao enviar avaliação' }, { status: 500 })
  }
}
