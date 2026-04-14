'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2 } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  authorName: string | null
  createdAt: string
}

interface ProductReviewsSectionProps {
  productId: string
  productName: string
}

export function ProductReviewsSection({ productId, productName }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const load = () => {
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((d) => setReviews(Array.isArray(d.reviews) ? d.reviews : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    load()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, authorName }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Não foi possível enviar a avaliação')
        return
      }
      setComment('')
      setAuthorName('')
      setRating(5)
      alert(
        typeof data.message === 'string'
          ? data.message
          : 'Avaliação enviada. Ela será publicada após análise da nossa equipe.'
      )
      load()
    } catch {
      alert('Erro ao enviar avaliação')
    } finally {
      setSubmitting(false)
    }
  }

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null

  return (
    <section className="mt-16 border-t border-gray-200 pt-12 pb-8">
      <h2 className="text-2xl font-bold text-secondary mb-2">Avaliações do produto</h2>
      <p className="text-gray-600 mb-8">
        Compartilhe sua experiência com <span className="font-medium">{productName}</span>. Não é
        necessário criar conta.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deixe sua avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="review-name">Nome (opcional)</Label>
                <Input
                  id="review-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  maxLength={120}
                />
              </div>
              <div>
                <Label>Nota</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1 rounded hover:bg-gray-100"
                      aria-label={`${n} estrelas`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-comment">Comentário *</Label>
                <Textarea
                  id="review-comment"
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte o que achou do produto, atendimento, entrega..."
                  maxLength={2000}
                />
              </div>
              <Button type="submit" disabled={submitting} className="bg-[#67CBDD] hover:bg-[#4FA8B8]">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Publicar avaliação'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          {avg != null && (
            <p className="text-lg text-gray-700 mb-4">
              Média: <strong>{avg.toFixed(1)}</strong> / 5 · {reviews.length}{' '}
              {reviews.length === 1 ? 'avaliação' : 'avaliações'}
            </p>
          )}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#67CBDD]" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 py-8">Ainda não há avaliações. Seja o primeiro!</p>
          ) : (
            <ul className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`${r.id}-star-${i}`}
                          className={`h-4 w-4 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="font-medium text-secondary">
                    {r.authorName || 'Cliente'}
                  </p>
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap text-sm">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
