import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

type BuyerTypeCount = {
  buyerType: string
  count: number
}

function toStartOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function formatDateLabel(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const now = new Date()
    const start30 = toStartOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000))
    const start7 = toStartOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000))

    const [
      totalContacts,
      contacts7d,
      contacts30d,
      contactsWithPhone30d,
      contactsWithBuyerType30d,
      contactsLast30,
      contactsByBuyerType30dRaw,
      contactsBySubject30dRaw,
      reviewStatusRaw,
      reviews30d,
      totalReviews,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { createdAt: { gte: start7 } } }),
      prisma.contact.count({ where: { createdAt: { gte: start30 } } }),
      prisma.contact.count({
        where: {
          createdAt: { gte: start30 },
          phone: { not: null },
        },
      }),
      prisma.contact.count({
        where: {
          createdAt: { gte: start30 },
          buyerType: { not: null },
        },
      }),
      prisma.contact.findMany({
        where: { createdAt: { gte: start30 } },
        select: { id: true, createdAt: true, productId: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.contact.groupBy({
        by: ['buyerType'],
        where: { createdAt: { gte: start30 } },
        _count: { _all: true },
      }),
      prisma.contact.groupBy({
        by: ['subject'],
        where: { createdAt: { gte: start30 } },
        _count: { _all: true },
      }),
      prisma.productReview.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.productReview.count({ where: { createdAt: { gte: start30 } } }),
      prisma.productReview.count(),
    ])

    const leadSeriesMap = new Map<string, number>()
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(start30.getTime() + i * 24 * 60 * 60 * 1000)
      leadSeriesMap.set(formatDateLabel(date), 0)
    }

    let leadsWithProduct30d = 0
    for (const contact of contactsLast30) {
      const key = formatDateLabel(contact.createdAt)
      leadSeriesMap.set(key, (leadSeriesMap.get(key) || 0) + 1)
      if (contact.productId) {
        leadsWithProduct30d += 1
      }
    }

    const leadsPerDay30d = Array.from(leadSeriesMap.entries()).map(([date, total]) => ({
      date,
      total,
    }))

    const contactsByBuyerType30d: BuyerTypeCount[] = contactsByBuyerType30dRaw
      .map((row) => ({
        buyerType: row.buyerType || 'nao-informado',
        count: row._count._all,
      }))
      .sort((a, b) => b.count - a.count)

    const contactsBySubject30d = contactsBySubject30dRaw
      .map((row) => ({
        subject: row.subject || 'nao-informado',
        count: row._count._all,
      }))
      .sort((a, b) => b.count - a.count)

    const reviewsByStatus = reviewStatusRaw.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count._all
      return acc
    }, {})

    return NextResponse.json({
      generatedAt: now.toISOString(),
      range: {
        start7d: start7.toISOString(),
        start30d: start30.toISOString(),
      },
      leads: {
        total: totalContacts,
        last7d: contacts7d,
        last30d: contacts30d,
        withPhone30d: contactsWithPhone30d,
        withBuyerType30d: contactsWithBuyerType30d,
        withProduct30d: leadsWithProduct30d,
        coverage: {
          phonePct30d: contacts30d > 0 ? Math.round((contactsWithPhone30d / contacts30d) * 100) : 0,
          buyerTypePct30d:
            contacts30d > 0 ? Math.round((contactsWithBuyerType30d / contacts30d) * 100) : 0,
          productPct30d:
            contacts30d > 0 ? Math.round((leadsWithProduct30d / contacts30d) * 100) : 0,
        },
        byBuyerType30d: contactsByBuyerType30d,
        bySubject30d: contactsBySubject30d,
        perDay30d: leadsPerDay30d,
      },
      reviews: {
        total: totalReviews,
        last30d: reviews30d,
        byStatus: reviewsByStatus,
      },
    })
  } catch (error) {
    console.error('Error building analytics overview:', error)
    return NextResponse.json({ error: 'Erro ao carregar analytics' }, { status: 500 })
  }
}
