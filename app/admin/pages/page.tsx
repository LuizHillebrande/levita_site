'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { ImageCarousel } from '@/components/image-carousel'

export default function AdminPagesPage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/pages/quem-somos-images')
      .then((res) => res.json())
      .then((data) => {
        setImages(Array.isArray(data.images) ? data.images : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'institutional')
      const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao fazer upload')
      setImages((prev) => [...prev, data.url])
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar imagem')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const saveImages = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/pages/quem-somos-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar')
      }
      alert('Imagens atualizadas com sucesso')
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar imagens')
    } finally {
      setSaving(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-6">Páginas Institucionais</h1>

      <Card>
        <CardHeader>
          <CardTitle>Quem Somos - Imagens</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#67CBDD]" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="upload-quem-somos"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <label htmlFor="upload-quem-somos" className="cursor-pointer flex flex-col items-center gap-2">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[#67CBDD]" /> : <Upload className="h-8 w-8 text-gray-400" />}
                  <span className="text-sm text-gray-600">Adicionar imagem para seção Quem Somos</span>
                </label>
              </div>

              {images.length > 0 && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative border rounded-lg overflow-hidden aspect-square group">
                        <Image src={url} alt={`Imagem ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border p-3 bg-gray-50">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Preview na página</p>
                    <ImageCarousel images={images} autoPlay={false} />
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={saveImages} disabled={saving} className="bg-[#67CBDD] hover:bg-[#4FA8B8]">
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


