import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import { slugify } from '@/lib/utils'

function isProductVideoTableMissing(error: unknown) {
  const prismaError = error as { code?: string; message?: string }
  const message = String(prismaError.message || '')
  return (
    prismaError.code === 'P2021' ||
    message.includes('ProductVideo') ||
    message.includes('Unknown field `videos`') ||
    message.includes('Unknown argument `videos`')
  )
}

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const where: any = {
      active: true,
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      }
    }

    if (search) {
      // SQLite não suporta mode: 'insensitive', então fazemos busca case-insensitive manualmente
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (featured === 'true') {
      where.featured = true
    }

    let products
    try {
      products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
          videos: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      if (!isProductVideoTableMissing(error)) throw error

      const productsWithoutVideos = await prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      products = productsWithoutVideos.map((product) => ({ ...product, videos: [] }))
    }

    // Parse specifications, technicalSpecs e documentation de String para JSON
    const productsWithParsedSpecs = products.map(product => ({
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
      technicalSpecs: product.technicalSpecs ? JSON.parse(product.technicalSpecs) : null,
      documentation: product.documentation ? JSON.parse(product.documentation) : null,
    }))

    return NextResponse.json({ products: productsWithParsedSpecs })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
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
    const {
      name,
      description,
      shortDescription,
      categoryId,
      featured,
      specifications,
      technicalSpecs,
      documentation,
      price,
      images,
      videos,
    } = data

    const slug = slugify(name)

    const hasVideos = Array.isArray(videos) && videos.length > 0
    const canWriteProductVideos =
      typeof (prisma as any).productVideo?.deleteMany === 'function'

    if (hasVideos && !canWriteProductVideos) {
      return NextResponse.json(
        { error: 'Reinicie o servidor e aplique a migration de vídeos antes de salvar vídeos.' },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: price || null,
        categoryId: categoryId || null,
        featured: featured || false,
        specifications: specifications ? JSON.stringify(specifications) : null,
        technicalSpecs: technicalSpecs ? JSON.stringify(technicalSpecs) : null,
        documentation: documentation ? JSON.stringify(documentation) : null,
        images: images && images.length > 0 ? {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || name,
            order: img.order !== undefined ? img.order : index,
          })),
        } : undefined,
        videos: hasVideos && canWriteProductVideos ? {
          create: videos.map((video: any, index: number) => ({
            url: video.url,
            title: video.title || name,
            order: video.order !== undefined ? video.order : index,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json({ product: { ...product, videos: hasVideos ? videos : [] } }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe um produto com este nome' },
        { status: 400 }
      )
    }
    if (isProductVideoTableMissing(error)) {
      return NextResponse.json(
        { error: 'A tabela de vídeos ainda não foi criada no banco. Aplique a migration antes de salvar vídeos.' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}

