'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageCarousel } from './image-carousel'

const defaultImages = [
  '/images/institutional/factory-01.jpg',
  '/images/institutional/factory-02.jpg',
  '/images/institutional/factory-03.jpg',
]

export function QuemSomosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [images, setImages] = useState<string[]>(defaultImages)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    fetch('/api/pages/quem-somos-images')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images)
        }
      })
      .catch(() => {
        setImages(defaultImages)
      })
  }, [])

  return (
    <section id="quem-somos" ref={sectionRef} className="scroll-mt-28 py-20 md:py-24 bg-gradient-to-br from-white via-gray-50 to-[#67CBDD]/5 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#67CBDD]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
                Quem Somos
              </h2>
              <div className="w-24 h-1 bg-[#67CBDD] rounded-full mb-6"></div>
            </div>
            
            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="bg-gradient-to-r from-[#67CBDD]/10 to-transparent border-l-4 border-[#67CBDD] p-6 rounded-r-xl shadow-lg">
                  <p className="font-bold text-[#67CBDD] text-2xl md:text-3xl leading-tight">
                    Há mais de 40 anos fazendo história.
                  </p>
                </div>
              </div>
              <p className="text-lg">
                Através da qualidade e por meio de um sistema de distribuição eficaz, 
                nos consolidamos como a marca mais lembrada pelo paranaense na categoria 
                móveis hospitalares. Pioneiros na região de Londrina neste ramo, somos 
                conhecidos por manter um padrão técnico na confecção de nossos produtos, 
                que resulta em móveis de alta durabilidade e atende minuciosamente as 
                exigências do mercado.
              </p>
            </div>
          </div>

          {/* Carrossel de Imagens - Estilo Tecnológico */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#67CBDD] to-secondary rounded-xl blur opacity-20"></div>
            <div className="relative bg-white rounded-xl p-2 shadow-2xl">
              <ImageCarousel images={images} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

