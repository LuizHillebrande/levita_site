import { NextRequest, NextResponse } from 'next/server'

const MAX = 4

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const productId = params.id

    const current = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, categoryId: true },
    })

    if (!current) {
      return NextResponse.json({ products: [] }, { status: 404 })
    }

    const baseInclude = {
      category: true,
      images: { orderBy: { order: 'asc' as const }, take: 1 },
    }

    if (!current.categoryId) {
      return NextResponse.json({ products: [] })
    }

    const related = await prisma.product.findMany({
      where: {
        id: { not: productId },
        active: true,
        categoryId: current.categoryId,
      },
      include: baseInclude,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: MAX,
    })

    const products = related.map((p) => ({
      ...p,
      specifications: p.specifications ? JSON.parse(p.specifications) : null,
      technicalSpecs: p.technicalSpecs ? JSON.parse(p.technicalSpecs) : null,
      documentation: p.documentation ? JSON.parse(p.documentation) : null,
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos relacionados' }, { status: 500 })
  }
}
