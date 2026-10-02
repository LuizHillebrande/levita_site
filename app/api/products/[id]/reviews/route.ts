import { NextRequest, NextResponse } from 'next/server'

const MAX_REVIEW_IMAGES = 5

function parseReviewImages(value: unknown): { images: string[] } | { error: string } {
  if (value == null || value === '') return { images: [] }
  if (!Array.isArray(value)) return { error: 'Imagens inválidas' }
  if (value.length > MAX_REVIEW_IMAGES) {
    return { error: `Envie no máximo ${MAX_REVIEW_IMAGES} fotos` }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const images: string[] = []

  for (const item of value) {
    if (typeof item !== 'string') return { error: 'Imagens inválidas' }
    const url = item.trim()
    if (!url) continue
    if (!cloudName || !isReviewImageUrl(url, cloudName)) {
      return { error: 'Uma das fotos enviadas é inválida' }
    }
    images.push(url)
  }

  return { images }
}

function isReviewImageUrl(url: string, cloudName: string) {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'res.cloudinary.com' &&
      parsed.pathname.startsWith(`/${cloudName}/`) &&
      parsed.pathname.includes('/levita-moveis/reviews/')
    )
  } catch {
    return false
  }
}

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
    const parsedImages = parseReviewImages(body.images)
    if ('error' in parsedImages) {
      return NextResponse.json({ error: parsedImages.error }, { status: 400 })
    }

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
        images: parsedImages.images,
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
