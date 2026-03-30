import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type QuoteBody = {
  name?: string
  email?: string
  phone?: string
  message?: string
  productName?: string
  productSlug?: string
  selectedOptionals?: string[]
  productId?: string
  /** `whatsapp` = só valida + log/telemetria, não envia e-mail */
  channel?: string
}

function formatOptionalLine(opt: {
  name: string
  showPrice: boolean
  price: number | null
  description: string | null
}) {
  const priceInfo =
    opt.showPrice && opt.price != null
      ? ` - R$ ${opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : ' - Sob consulta'
  let line = `✓ ${opt.name}${priceInfo}`
  if (opt.description) line += `\n  ${opt.description}`
  return line
}

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const data = (await request.json()) as QuoteBody
    const {
      name,
      email,
      phone,
      message,
      productName,
      productSlug,
      selectedOptionals = [],
      productId,
      channel,
    } = data

    const isWhatsApp = channel === 'whatsapp'

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Opcionais: só os que pertencem ao produto e estão ativos
    let optionals: Awaited<ReturnType<typeof prisma.productOptional.findMany>> = []
    if (selectedOptionals.length > 0 && productId) {
      optionals = await prisma.productOptional.findMany({
        where: {
          id: { in: selectedOptionals },
          productId,
          active: true,
        },
        orderBy: { order: 'asc' },
      })
    }

    if (isWhatsApp) {
      console.info(
        '[quote:whatsapp]',
        JSON.stringify({
          at: new Date().toISOString(),
          name,
          email,
          phone: phone || null,
          productName: productName || null,
          productSlug: productSlug || null,
          productId: productId || null,
          selectedOptionalsIds: selectedOptionals,
          resolvedOptionalIds: optionals.map((o) => o.id),
        })
      )

      return NextResponse.json({
        success: true,
        channel: 'whatsapp',
        optionals,
      })
    }

    // --- Canal e-mail (legado / outros usos) ---
    const emailEnv = process.env.EMAIL
    const senhaApp = process.env.SENHA_APP

    if (!emailEnv || !senhaApp) {
      console.error('Email credentials missing:', {
        email: !!emailEnv,
        senhaApp: !!senhaApp,
      })
      return NextResponse.json(
        {
          error:
            'Configuração de email não encontrada. Verifique as variáveis de ambiente EMAIL e SENHA_APP no arquivo .env',
        },
        { status: 500 }
      )
    }

    let optionalsInfo = ''
    let optionalsHtml = ''

    if (optionals.length > 0) {
      optionalsInfo = '\n\n🛏️ OPCIONAIS SELECIONADOS:\n'
      optionals.forEach((opt) => {
        optionalsInfo += `${formatOptionalLine(opt)}\n`
      })

      optionalsHtml = `
          <div style="background-color: #e8f5e9; padding: 20px; border-left: 4px solid #67CBDD; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #67CBDD;">🛏️ Opcionais Selecionados:</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${optionals
                .map((opt) => {
                  const priceInfo =
                    opt.showPrice && opt.price != null
                      ? ` - <strong>R$ ${opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>`
                      : ' - <em>Sob consulta</em>'
                  return `<li style="margin-bottom: 10px;">
                  <strong>✓ ${opt.name}</strong>${priceInfo}
                  ${opt.description ? `<br><span style="color: #666; font-size: 14px;">${opt.description}</span>` : ''}
                </li>`
                })
                .join('')}
            </ul>
          </div>
          `
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const productInfo = productName
      ? `\n\nProduto de interesse: ${productName}\nLink: ${baseUrl}/produtos/${productSlug || ''}`
      : ''

    const emailContent = `
Nova solicitação de orçamento recebida!

Nome: ${name}
Email: ${email}
Telefone: ${phone || 'Não informado'}
${productInfo}${optionalsInfo}

Mensagem:
${message}

---
Este email foi enviado automaticamente pelo sistema de solicitação de orçamento.
    `.trim()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailEnv,
        pass: senhaApp,
      },
    })

    const mailOptions = {
      from: `"Levita Móveis Hospitalares" <${emailEnv}>`,
      to: emailEnv,
      replyTo: email,
      subject: `Nova Solicitação de Orçamento - ${productName || 'Geral'}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #67CBDD;">Nova solicitação de orçamento recebida!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
            ${productName ? `<p><strong>Produto de interesse:</strong> ${productName}</p>` : ''}
            ${productSlug ? `<p><strong>Link do produto:</strong> <a href="${baseUrl}/produtos/${productSlug}">Ver produto</a></p>` : ''}
          </div>
          
          ${optionalsHtml}
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #67CBDD; margin: 20px 0;">
            <h3 style="margin-top: 0;">Mensagem:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Este email foi enviado automaticamente pelo sistema de solicitação de orçamento.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Solicitação de orçamento enviada com sucesso!',
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar solicitação de orçamento. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
