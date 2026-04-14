import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await request.json()
    const { name, email, phone, subject, message, buyerType, productId } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, e-mail e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    const createData: any = {
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      productId: productId || null,
    }

    if (buyerType !== undefined) {
      createData.buyerType = buyerType || null
    }

    let contact
    try {
      contact = await prisma.contact.create({
        data: createData,
      })
    } catch (error: any) {
      // Compatibilidade para runtime antigo do Prisma sem buyerType.
      const message = String(error?.message || '')
      if (message.includes('Unknown argument `buyerType`')) {
        const { buyerType: _ignored, ...fallbackData } = createData
        contact = await prisma.contact.create({
          data: fallbackData,
        })
      } else {
        throw error
      }
    }

    return NextResponse.json({ success: true, contactId: contact.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Erro ao salvar contato' }, { status: 500 })
  }
}
