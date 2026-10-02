'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2, ImagePlus, X } from 'lucide-react'

const MAX_REVIEW_IMAGES = 5
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

interface ReviewPhoto {
  file: File
  preview: string
}

interface Review {
  id: string
  rating: number
  comment: string
  authorName: string | null
  images?: string[]
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
  const [photos, setPhotos] = useState<ReviewPhoto[]>([])
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const photosRef = useRef<ReviewPhoto[]>([])

  const setReviewPhotos = (next: ReviewPhoto[]) => {
    const kept = new Set(next.map((photo) => photo.preview))
    photosRef.current.forEach((photo) => {
      if (!kept.has(photo.preview)) URL.revokeObjectURL(photo.preview)
    })
    photosRef.current = next
    setPhotos(next)
  }

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

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview))
    }
  }, [])

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    e.target.value = ''
    if (selected.length === 0) return

    const accepted: ReviewPhoto[] = []
    for (const file of selected) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP')
        continue
      }
      if (file.size > MAX_IMAGE_BYTES) {
        alert('Arquivo muito grande. Tamanho máximo: 8MB')
        continue
      }
      accepted.push({ file, preview: URL.createObjectURL(file) })
    }

    const room = MAX_REVIEW_IMAGES - photosRef.current.length
    if (room <= 0 || accepted.length === 0) {
      accepted.forEach((photo) => URL.revokeObjectURL(photo.preview))
      if (room <= 0) alert(`Você pode enviar no máximo ${MAX_REVIEW_IMAGES} fotos`)
      return
    }

    const next = accepted.slice(0, room)
    accepted.slice(room).forEach((photo) => URL.revokeObjectURL(photo.preview))
    if (accepted.length > room) {
      alert(`Você pode enviar no máximo ${MAX_REVIEW_IMAGES} fotos`)
    }
    setReviewPhotos([...photosRef.current, ...next])
  }

  const uploadReviewPhotos = async (files: ReviewPhoto[]) => {
    const urls: string[] = []
    for (const photo of files) {
      const formData = new FormData()
      formData.append('file', photo.file)
      formData.append('folder', 'reviews')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok || typeof data.url !== 'string') {
        throw new Error(typeof data.error === 'string' ? data.error : 'Erro ao enviar foto')
      }
      urls.push(data.url)
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const images = await uploadReviewPhotos(photosRef.current)
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, authorName, images }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Não foi possível enviar a avaliação')
        return
      }
      setComment('')
      setAuthorName('')
      setRating(5)
      setReviewPhotos([])
      alert(
        typeof data.message === 'string'
          ? data.message
          : 'Avaliação enviada. Ela será publicada após análise da nossa equipe.'
      )
      load()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao enviar avaliação')
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
              <div>
                <Label htmlFor="review-photos">Fotos (opcional)</Label>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                  Até {MAX_REVIEW_IMAGES} fotos, JPG, PNG ou WEBP, com no máximo 8MB cada.
                </p>
                <input
                  id="review-photos"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  className="hidden"
                  disabled={submitting || photos.length >= MAX_REVIEW_IMAGES}
                  onChange={handlePhotos}
                />
                <label
                  htmlFor="review-photos"
                  className={`flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 ${
                    submitting || photos.length >= MAX_REVIEW_IMAGES
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:border-[#67CBDD]'
                  }`}
                >
                  <ImagePlus className="h-4 w-4" />
                  Adicionar fotos
                </label>
                {photos.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {photos.map((photo) => (
                      <li key={photo.preview} className="relative">
                        <img
                          src={photo.preview}
                          alt=""
                          className="h-20 w-20 rounded-md border border-gray-200 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow border border-gray-200"
                          aria-label="Remover foto"
                          disabled={submitting}
                          onClick={() =>
                            setReviewPhotos(photosRef.current.filter((item) => item.preview !== photo.preview))
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
                  {Array.isArray(r.images) && r.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.images.map((url) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setActiveImage(url)}
                          className="overflow-hidden rounded-md border border-gray-200"
                        >
                          <img src={url} alt="" className="h-20 w-20 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {activeImage && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveImage(null)}
          aria-label="Fechar foto"
        >
          <img
            src={activeImage}
            alt=""
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
        </button>
      )}
    </section>
  )
}
