'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Certification {
  id: string
  name: string
  description: string | null
  image: string | null
  order: number
  active: boolean
}

export default function AdminCertificationsPage() {
  const router = useRouter()
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    try {
      const res = await fetch('/api/certifications')
      const data = await res.json()
      // Buscar todas as certificações (incluindo inativas) para o admin
      const allRes = await fetch('/api/certifications/all')
      const allData = await allRes.json()
      setCertifications(allData.certifications || [])
    } catch (error) {
      console.error('Error fetching certifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta certificação?')) return

    try {
      const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCertifications()
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Certificações</h1>
        <Button asChild className="bg-[#67CBDD] hover:bg-[#4FA8B8] text-white">
          <Link href="/admin/certifications/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova Certificação
          </Link>
        </Button>
      </div>

      {certifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">Nenhuma certificação cadastrada.</p>
            <Button asChild className="bg-[#67CBDD] hover:bg-[#4FA8B8] text-white">
              <Link href="/admin/certifications/new">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Certificação
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="relative aspect-square w-full bg-gray-100">
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl text-gray-400">🏆</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{cert.name}</CardTitle>
                {cert.description && (
                  <p className="text-sm text-gray-600 mt-2">{cert.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${cert.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {cert.active ? 'Ativa' : 'Inativa'}
                  </span>
                  <span className="text-xs text-gray-500">Ordem: {cert.order}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link href={`/admin/certifications/${cert.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
