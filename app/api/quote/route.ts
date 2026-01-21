import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, phone, message, productName, productSlug } = data

    // Validar campos obrigatórios
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar variáveis de ambiente
    const emailEnv = process.env.EMAIL
    const senhaApp = process.env.SENHA_APP

    if (!emailEnv || !senhaApp) {
      console.error('Email credentials missing:', {
        email: !!emailEnv,
        senhaApp: !!senhaApp,
      })
      return NextResponse.json(
        { error: 'Configuração de email não encontrada. Verifique as variáveis de ambiente EMAIL e SENHA_APP no arquivo .env' },
        { status: 500 }
      )
    }

    // Configurar transporter do Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailEnv,
        pass: senhaApp,
      },
    })

    // Montar o conteúdo do email
    const productInfo = productName 
      ? `\n\nProduto de interesse: ${productName}\nLink: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/produtos/${productSlug || ''}`
      : ''

    const emailContent = `
Nova solicitação de orçamento recebida!

Nome: ${name}
Email: ${email}
Telefone: ${phone || 'Não informado'}
${productInfo}

Mensagem:
${message}

---
Este email foi enviado automaticamente pelo sistema de solicitação de orçamento.
    `.trim()

    // Enviar email
    const mailOptions = {
      from: `"Levita Móveis Hospitalares" <${emailEnv}>`,
      to: emailEnv, // Envia para o próprio email configurado
      replyTo: email, // Permite responder diretamente ao cliente
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
            ${productSlug ? `<p><strong>Link do produto:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/produtos/${productSlug}">Ver produto</a></p>` : ''}
          </div>
          
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
      message: 'Solicitação de orçamento enviada com sucesso!' 
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar solicitação de orçamento. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
