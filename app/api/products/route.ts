import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
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

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

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
    const auth = await verifyAuth(request)

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, description, shortDescription, categoryId, featured, specifications, technicalSpecs, documentation, price, images } = data

    const slug = slugify(name)

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
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe um produto com este nome' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}

