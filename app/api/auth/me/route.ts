import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    let user: { id: string; email: string; name: string; role: string } | null = null
    try {
      const { prisma } = await import('@/lib/prisma')
      user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      })
    } catch (dbError) {
      console.error('Auth /me DB unavailable, using token payload:', dbError)
    }

    if (!user) {
      user = {
        id: auth.userId || 'admin-fallback',
        email: auth.email,
        name: 'Administrador',
        role: auth.role,
      }
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar autenticação' },
      { status: 500 }
    )
  }
}


