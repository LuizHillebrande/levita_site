import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'

// PUT - Atualizar opcional
export async function PUT(
  request: NextRequest,
  { params }: { params: { optionalId: string } }
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
    const { name, description, price, showPrice, active, order } = data

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (showPrice !== undefined) updateData.showPrice = showPrice
    if (active !== undefined) updateData.active = active
    if (order !== undefined) updateData.order = order

    const optional = await prisma.productOptional.update({
      where: { id: params.optionalId },
      data: updateData,
    })

    return NextResponse.json({ optional })
  } catch (error: any) {
    console.error('Error updating optional:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Opcional não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar opcional' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar opcional
export async function DELETE(
  request: NextRequest,
  { params }: { params: { optionalId: string } }
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

    await prisma.productOptional.delete({
      where: { id: params.optionalId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting optional:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Opcional não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao deletar opcional' },
      { status: 500 }
    )
  }
}
