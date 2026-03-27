'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ImageUploadCropperProps {
  folder: string
  onUploaded: (payload: { url: string; alt: string }) => void
}

export function ImageUploadCropper({ folder, onUploaded }: ImageUploadCropperProps) {
  const [uploading, setUploading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const drawToCanvas = (canvas: HTMLCanvasElement, outputSize: number) => {
    const img = imageRef.current
    if (!img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = outputSize
    canvas.height = outputSize

    // Cover base: garante enquadramento completo no quadrado
    const baseScale = Math.max(outputSize / img.naturalWidth, outputSize / img.naturalHeight)
    const renderW = img.naturalWidth * baseScale * zoom
    const renderH = img.naturalHeight * baseScale * zoom
    const centerX = outputSize / 2 + offsetX
    const centerY = outputSize / 2 + offsetY

    ctx.clearRect(0, 0, outputSize, outputSize)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, outputSize, outputSize)
    ctx.drawImage(img, centerX - renderW / 2, centerY - renderH / 2, renderW, renderH)
  }

  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(selected.type)) {
      alert('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP')
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 10MB')
      return
    }

    const objectUrl = URL.createObjectURL(selected)
    setFile(selected)
    setPreviewUrl(objectUrl)
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    setModalOpen(true)
    e.target.value = ''
  }

  const closeModal = () => {
    setModalOpen(false)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
    setFile(null)
    imageRef.current = null
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
  }

  useEffect(() => {
    const canvas = previewCanvasRef.current
    if (!canvas || !imageRef.current) return
    drawToCanvas(canvas, 320)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, offsetX, offsetY, modalOpen])

  const cropAndUpload = async () => {
    if (!file || !previewUrl) return
    setUploading(true)
    try {
      if (!imageRef.current) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.onerror = reject
          image.src = previewUrl
        })
        imageRef.current = img
      }

      const outputSize = 1200
      const canvas = document.createElement('canvas')
      drawToCanvas(canvas, outputSize)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('Falha ao gerar imagem'))), 'image/jpeg', 0.92)
      })

      const croppedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
      const uploadFormData = new FormData()
      uploadFormData.append('file', croppedFile)
      uploadFormData.append('folder', folder)

      // Mantém o mesmo fluxo de upload atual do projeto (Cloudinary via /api/upload)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao fazer upload')
      onUploaded({ url: data.url, alt: file.name })
      closeModal()
    } catch (error: any) {
      alert(error.message || 'Erro ao processar imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleImageLoad = async () => {
    if (!previewUrl) return
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
      image.src = previewUrl
    })
    imageRef.current = img
    const canvas = previewCanvasRef.current
    if (canvas) {
      drawToCanvas(canvas, 320)
    }
  }

  const resetAdjustments = () => {
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
  }

  return (
    <>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#67CBDD] transition-colors">
        <input
          type="file"
          id={`image-upload-${folder}`}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleChooseFile}
          className="hidden"
          disabled={uploading}
        />
        <label htmlFor={`image-upload-${folder}`} className={`flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 text-[#67CBDD] animate-spin mb-4" />
              <p className="text-gray-600">Processando imagem...</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Clique para enviar imagem</p>
              <p className="text-sm text-gray-500">Você poderá ajustar zoom e enquadramento</p>
            </>
          )}
        </label>
      </div>

      <Dialog open={modalOpen} onOpenChange={(open) => (!open ? closeModal() : setModalOpen(true))}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajustar imagem</DialogTitle>
            <DialogDescription>Preview real do corte final antes de enviar.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Carrega imagem em memória para desenhar no canvas */}
            {previewUrl && <img src={previewUrl} alt="" className="hidden" onLoad={handleImageLoad} />}

            <div className="mx-auto h-80 w-80 overflow-hidden rounded-lg border bg-gray-100">
              <canvas ref={previewCanvasRef} className="h-full w-full" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Zoom</label>
                <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-sm font-medium">Mover horizontal</label>
                <input type="range" min="-140" max="140" step="1" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-sm font-medium">Mover vertical</label>
                <input type="range" min="-140" max="140" step="1" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetAdjustments} disabled={uploading}>
              Resetar
            </Button>
            <Button type="button" variant="outline" onClick={closeModal} disabled={uploading}>
              Cancelar
            </Button>
            <Button type="button" onClick={cropAndUpload} disabled={uploading} className="bg-[#67CBDD] hover:bg-[#4FA8B8]">
              {uploading ? 'Salvando...' : 'Aplicar e enviar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
