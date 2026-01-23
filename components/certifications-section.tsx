'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Certification {
  id: string
  name: string
  description: string | null
  image: string | null
  order: number
}

export function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/certifications')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        // Ordenar por campo 'order' e depois por nome
        const sortedCertifications = (data.certifications || []).sort((a: Certification, b: Certification) => {
          if (a.order !== b.order) {
            return a.order - b.order
          }
          return a.name.localeCompare(b.name)
        })
        setCertifications(sortedCertifications)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching certifications:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              Certificações
            </h2>
            <div className="w-24 h-1 bg-[#67CBDD] mx-auto rounded-full mb-8"></div>
          </div>
          <div className="text-center py-12 text-gray-600">Carregando certificações...</div>
        </div>
      </section>
    )
  }

  if (certifications.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Certificações
          </h2>
          <div className="w-24 h-1 bg-[#67CBDD] mx-auto rounded-full mb-8"></div>
          <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            Acreditamos que a tecnologia eficiente é aquela que se baseia no processo produtivo consistente, 
            assim como no preparo e qualificação da mão de obra. Nesse sentido promovemos capacitação constante 
            e trabalhamos em conformidade com as principais certificações existentes no país, tanto as específicas 
            para a atividade industrial quanto aquelas voltadas exclusivamente para o setor de saúde.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200 hover:border-[#67CBDD] group shadow-sm hover:shadow-md"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 mb-4 flex items-center justify-center">
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 112px, 144px"
                  />
                ) : (
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 group-hover:border-[#67CBDD] transition-colors">
                    <span className="text-xl md:text-2xl font-bold text-gray-400">
                      {cert.name.split(' ')[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xs md:text-sm font-semibold text-secondary mb-1">
                  {cert.name}
                </h3>
                {cert.description && (
                  <p className="text-[10px] md:text-xs text-gray-600 leading-tight">
                    {cert.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
