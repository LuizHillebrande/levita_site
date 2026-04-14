'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Loader2 } from 'lucide-react'

type ReviewStatus = 'PENDING' | 'APPROVED' | 'HIDDEN'

interface ReviewRow {
  id: string
  rating: number
  comment: string
  authorName: string | null
  status: ReviewStatus
  createdAt: string
  product: { id: string; name: string; slug: string }
}

const FILTERS: { value: '' | ReviewStatus; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'APPROVED', label: 'Aprovadas' },
  { value: 'HIDDEN', label: 'Ocultas' },
]

const statusLabel: Record<ReviewStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  HIDDEN: 'Oculta',
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'' | ReviewStatus>('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const q = filter ? `?status=${filter}` : ''
      const res = await fetch(`/api/admin/reviews${q}`)
      if (!res.ok) {
        setReviews([])
        return
      }
      const data = await res.json()
      setReviews(Array.isArray(data.reviews) ? data.reviews : [])
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const patchStatus = async (id: string, status: ReviewStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        fetchReviews()
      }
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary">Avaliações de produtos</h1>
        <p className="text-gray-600 mt-2">
          Aprove comentários para exibi-los no site ou oculte-os sem apagar.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <Button
            key={f.value || 'all'}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? 'bg-[#67CBDD] hover:bg-[#4FA8B8]' : ''}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comentários</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#67CBDD]" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Nenhuma avaliação neste filtro.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="pb-3 pr-4 font-medium">Produto</th>
                    <th className="pb-3 pr-4 font-medium">Nota</th>
                    <th className="pb-3 pr-4 font-medium">Comentário</th>
                    <th className="pb-3 pr-4 font-medium">Autor</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Data</th>
                    <th className="pb-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 align-top">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/produtos/${r.product.slug}`}
                          className="text-[#67CBDD] hover:underline font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {r.product.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-0.5">
                          {r.rating}
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        </span>
                      </td>
                      <td className="py-3 pr-4 max-w-xs">
                        <p className="text-gray-800 line-clamp-3 whitespace-pre-wrap">{r.comment}</p>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap text-gray-600">
                        {r.authorName || '—'}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            r.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-900'
                              : r.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {statusLabel[r.status]}
                        </span>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap text-gray-500">
                        {new Date(r.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col gap-1 min-w-[140px]">
                          {r.status !== 'APPROVED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              disabled={updatingId === r.id}
                              onClick={() => patchStatus(r.id, 'APPROVED')}
                            >
                              Aprovar
                            </Button>
                          )}
                          {r.status !== 'HIDDEN' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              disabled={updatingId === r.id}
                              onClick={() => patchStatus(r.id, 'HIDDEN')}
                            >
                              Ocultar
                            </Button>
                          )}
                          {r.status !== 'PENDING' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs text-gray-600"
                              disabled={updatingId === r.id}
                              onClick={() => patchStatus(r.id, 'PENDING')}
                            >
                              Marcar pendente
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
