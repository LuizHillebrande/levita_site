import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Validar variáveis de ambiente do Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary credentials missing:', {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
      })
      return NextResponse.json(
        { error: 'Configuração do Cloudinary não encontrada. Verifique as variáveis de ambiente CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no arquivo .env' },
        { status: 500 }
      )
    }

    // Configurar Cloudinary (dentro da função para garantir que as variáveis sejam lidas)
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'products'
    const resourceType = formData.get('resourceType') === 'video' ? 'video' : 'image'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes =
      resourceType === 'video'
        ? ['video/mp4', 'video/webm', 'video/quicktime']
        : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            resourceType === 'video'
              ? 'Tipo de arquivo não permitido. Use MP4, WEBM ou MOV'
              : 'Tipo de arquivo não permitido. Use JPG, PNG ou WEBP',
        },
        { status: 400 }
      )
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Converter Buffer para base64
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    const uploadOptions =
      resourceType === 'image'
        ? {
            folder: `levita-moveis/${folder}`,
            resource_type: 'image' as const,
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          }
        : {
            folder: `levita-moveis/${folder}`,
            resource_type: 'video' as const,
          }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions)

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (error: any) {
    console.error('Error uploading file to Cloudinary:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    )
  }
}
