'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

type BuyerTypeRow = { buyerType: string; count: number }
type SubjectRow = { subject: string; count: number }
type PerDayRow = { date: string; total: number }

type AnalyticsPayload = {
  generatedAt: string
  leads: {
    total: number
    last7d: number
    last30d: number
    withPhone30d: number
    withBuyerType30d: number
    withProduct30d: number
    coverage: {
      phonePct30d: number
      buyerTypePct30d: number
      productPct30d: number
    }
    byBuyerType30d: BuyerTypeRow[]
    bySubject30d: SubjectRow[]
    perDay30d: PerDayRow[]
  }
  reviews: {
    total: number
    last30d: number
    byStatus: Record<string, number>
  }
}

function formatBuyerType(value: string) {
  if (value === 'nao-informado') return 'Não informado'
  const map: Record<string, string> = {
    distribuidor: 'Distribuidor',
    'orgao-publico': 'Órgão público',
    'pessoa-fisica': 'Pessoa física',
    hospital: 'Hospital / Clínica',
    'empresa-privada': 'Empresa privada',
    outro: 'Outro',
  }
  return map[value] || value
}

function formatSubject(value: string) {
  if (value === 'nao-informado') return 'Não informado'
  const map: Record<string, string> = {
    orcamento: 'Orçamento',
    duvida: 'Dúvida sobre produto',
    suporte: 'Suporte técnico',
    frete: 'Cotação de frete',
    outro: 'Outro',
  }
  return map[value] || value
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/admin/analytics/overview')
        const payload = (await response.json()) as AnalyticsPayload | { error?: string }
        if (!response.ok) {
          setError(payload && 'error' in payload ? payload.error || 'Erro ao carregar métricas' : 'Erro ao carregar métricas')
          return
        }
        setData(payload as AnalyticsPayload)
      } catch {
        setError('Erro ao carregar métricas')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const bestDay30d = useMemo(() => {
    if (!data || data.leads.perDay30d.length === 0) return null
    return data.leads.perDay30d.reduce((best, row) => (row.total > best.total ? row : best))
  }, [data])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#67CBDD]" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-4">Analytics</h1>
        <p className="text-red-600">{error || 'Não foi possível carregar dados.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Visão geral de leads e avaliações com dados reais do sistema.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Atualizado em {new Date(data.generatedAt).toLocaleString('pt-BR')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Leads totais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.leads.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Leads (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.leads.last7d}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Leads (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.leads.last30d}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Avaliações totais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.reviews.total}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Qualidade de dados (30 dias)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Com telefone: {data.leads.withPhone30d} ({data.leads.coverage.phonePct30d}%)</p>
            <p>
              Com tipo de comprador: {data.leads.withBuyerType30d} ({data.leads.coverage.buyerTypePct30d}
              %)
            </p>
            <p>
              Com produto vinculado: {data.leads.withProduct30d} ({data.leads.coverage.productPct30d}
              %)
            </p>
            {bestDay30d && (
              <p>
                Melhor dia: {new Date(bestDay30d.date).toLocaleDateString('pt-BR')} ({bestDay30d.total}{' '}
                lead{bestDay30d.total === 1 ? '' : 's'})
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status de avaliações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Pendentes: {data.reviews.byStatus.PENDING || 0}</p>
            <p>Aprovadas: {data.reviews.byStatus.APPROVED || 0}</p>
            <p>Ocultas: {data.reviews.byStatus.HIDDEN || 0}</p>
            <p>Novas avaliações (30 dias): {data.reviews.last30d}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads por tipo de comprador (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leads.byBuyerType30d.length === 0 ? (
              <p className="text-sm text-gray-500">Sem dados no período.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-600">
                      <th className="pb-2 pr-4 font-medium">Tipo</th>
                      <th className="pb-2 font-medium">Leads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leads.byBuyerType30d.map((row) => (
                      <tr key={row.buyerType} className="border-b border-gray-100">
                        <td className="py-2 pr-4">{formatBuyerType(row.buyerType)}</td>
                        <td className="py-2 font-semibold">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads por assunto (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leads.bySubject30d.length === 0 ? (
              <p className="text-sm text-gray-500">Sem dados no período.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-600">
                      <th className="pb-2 pr-4 font-medium">Assunto</th>
                      <th className="pb-2 font-medium">Leads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leads.bySubject30d.map((row) => (
                      <tr key={row.subject} className="border-b border-gray-100">
                        <td className="py-2 pr-4">{formatSubject(row.subject)}</td>
                        <td className="py-2 font-semibold">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução diária de leads (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="pb-2 pr-4 font-medium">Data</th>
                  <th className="pb-2 font-medium">Leads</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.perDay30d.map((row) => (
                  <tr key={row.date} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{new Date(row.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-2">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
