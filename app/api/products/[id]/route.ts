import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import { slugify } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Parse specifications, technicalSpecs e documentation de String para JSON
    const productWithParsedSpecs = {
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
      technicalSpecs: product.technicalSpecs ? JSON.parse(product.technicalSpecs) : null,
      documentation: product.documentation ? JSON.parse(product.documentation) : null,
    }

    return NextResponse.json({ product: productWithParsedSpecs })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const { name, description, shortDescription, categoryId, featured, active, specifications, technicalSpecs, documentation, price, images } = data

    const slug = name ? slugify(name) : undefined

    const updateData: any = {}
    if (name) updateData.name = name
    if (name) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription
    if (price !== undefined) updateData.price = price || null
    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (featured !== undefined) updateData.featured = featured
    if (active !== undefined) updateData.active = active
    if (specifications !== undefined) {
      updateData.specifications = specifications ? JSON.stringify(specifications) : null
    }
    if (technicalSpecs !== undefined) {
      updateData.technicalSpecs = technicalSpecs ? JSON.stringify(technicalSpecs) : null
    }
    if (documentation !== undefined) {
      updateData.documentation = documentation ? JSON.stringify(documentation) : null
    }

    // Atualizar imagens se fornecidas
    if (images !== undefined) {
      // Deletar todas as imagens antigas
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      })

      // Criar novas imagens se houver
      if (images && images.length > 0) {
        updateData.images = {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || name,
            order: img.order !== undefined ? img.order : index,
          })),
        }
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    // Parse specifications, technicalSpecs e documentation de String para JSON
    const productWithParsedSpecs = {
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
      technicalSpecs: product.technicalSpecs ? JSON.parse(product.technicalSpecs) : null,
      documentation: product.documentation ? JSON.parse(product.documentation) : null,
    }

    return NextResponse.json({ product: productWithParsedSpecs })
  } catch (error: any) {
    console.error('Error updating product:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    )
  }
}

