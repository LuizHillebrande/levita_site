import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'

const PAGE_SLUG = 'quem-somos-images'
const DEFAULT_IMAGES = [
  '/images/institutional/factory-01.jpg',
  '/images/institutional/factory-02.jpg',
  '/images/institutional/factory-03.jpg',
]

function safeParseImages(content: string | null | undefined): string[] {
  if (!content) return DEFAULT_IMAGES
  try {
    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed)) return DEFAULT_IMAGES
    const urls = parsed.filter((item) => typeof item === 'string' && item.trim() !== '')
    return urls.length > 0 ? urls : DEFAULT_IMAGES
  } catch {
    return DEFAULT_IMAGES
  }
}

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const page = await prisma.page.findUnique({ where: { slug: PAGE_SLUG } })
    return NextResponse.json({ images: safeParseImages(page?.content) })
  } catch (error) {
    console.error('Error fetching Quem Somos images:', error)
    return NextResponse.json({ images: DEFAULT_IMAGES })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const images = Array.isArray(body.images) ? body.images : []
    const cleanImages = images.filter((item: unknown) => typeof item === 'string' && item.trim() !== '')

    const { prisma } = await import('@/lib/prisma')
    const payload = JSON.stringify(cleanImages.length > 0 ? cleanImages : DEFAULT_IMAGES)

    const page = await prisma.page.upsert({
      where: { slug: PAGE_SLUG },
      update: {
        title: 'Imagens Quem Somos',
        content: payload,
        active: true,
      },
      create: {
        slug: PAGE_SLUG,
        title: 'Imagens Quem Somos',
        content: payload,
        active: true,
      },
    })

    return NextResponse.json({ success: true, page })
  } catch (error) {
    console.error('Error saving Quem Somos images:', error)
    return NextResponse.json({ error: 'Erro ao salvar imagens' }, { status: 500 })
  }
}
