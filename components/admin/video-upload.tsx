'use client'

import { useState } from 'react'
import { Loader2, Upload, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VideoUploadProps {
  folder: string
  onUploaded: (payload: { url: string; title: string }) => void
}

export function VideoUpload({ folder, onUploaded }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleChooseFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(selected.type)) {
      alert('Tipo de arquivo não permitido. Use MP4, WEBM ou MOV')
      return
    }

    if (selected.size > 100 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 100MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selected)
      formData.append('folder', folder)
      formData.append('resourceType', 'video')

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar vídeo')

      onUploaded({ url: data.url, title: selected.name })
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar vídeo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#67CBDD] transition-colors">
      <input
        type="file"
        id={`video-upload-${folder}`}
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleChooseFile}
        className="hidden"
        disabled={uploading}
      />
      <label
        htmlFor={`video-upload-${folder}`}
        className={`flex flex-col items-center justify-center cursor-pointer ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-12 w-12 text-[#67CBDD] animate-spin mb-4" />
            <p className="text-gray-600">Enviando vídeo...</p>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Clique para enviar vídeo</p>
            <p className="text-sm text-gray-500">Formatos aceitos: MP4, WEBM ou MOV</p>
          </>
        )}
      </label>
      {!uploading && (
        <Button type="button" variant="ghost" size="sm" className="mt-3 text-gray-500" asChild>
          <label htmlFor={`video-upload-${folder}`} className="cursor-pointer">
            <Video className="h-4 w-4 mr-2" />
            Selecionar arquivo
          </label>
        </Button>
      )}
    </div>
  )
}
