import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'

// GET - Listar opcionais de um produto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const includeInactiveParam = request.nextUrl.searchParams.get('includeInactive')
    const wantsIncludeInactive = includeInactiveParam === '1'

    // Por padrão (site público): apenas ativos.
    // Quando ?includeInactive=1 e usuário autenticado: retorna ativos + inativos.
    let includeInactiveAllowed = false
    if (wantsIncludeInactive) {
      const auth = await verifyAuth(request)
      includeInactiveAllowed = !!auth
    }

    const optionals = await prisma.productOptional.findMany({
      where: includeInactiveAllowed
        ? { productId: params.id }
        : { productId: params.id, active: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ optionals })
  } catch (error) {
    console.error('Error fetching optionals:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar opcionais' },
      { status: 500 }
    )
  }
}

// POST - Criar opcional
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { name, description, price, showPrice, active, order, imageUrl } = data

    const optional = await prisma.productOptional.create({
      data: {
        name,
        description: description || null,
        price: price ?? null,
        showPrice: showPrice || false,
        active: active !== false,
        order: order || 0,
        imageUrl: imageUrl ?? null,
        productId: params.id,
      },
    })

    return NextResponse.json({ optional }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating optional:', error)
    return NextResponse.json(
      { error: 'Erro ao criar opcional' },
      { status: 500 }
    )
  }
}
