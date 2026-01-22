import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certification = await prisma.certification.findUnique({
      where: { id: params.id },
    })

    if (!certification) {
      return NextResponse.json(
        { error: 'Certificação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ certification })
  } catch (error) {
    console.error('Error fetching certification:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar certificação' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request)

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, description, image, order, active } = data

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image
    if (order !== undefined) updateData.order = order
    if (active !== undefined) updateData.active = active

    const certification = await prisma.certification.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ certification })
  } catch (error: any) {
    console.error('Error updating certification:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Certificação não encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar certificação' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request)

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    await prisma.certification.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting certification:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Certificação não encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao deletar certificação' },
      { status: 500 }
    )
  }
}
