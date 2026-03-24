import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const data = await request.json()
    const { name, email, phone, subject, message, productId } = data

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, e-mail e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        productId: productId || null,
      },
    })

    // TODO: Enviar e-mail de notificação
    // Aqui você pode integrar com um serviço de e-mail como SendGrid, Resend, etc.

    return NextResponse.json({ contact, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}


