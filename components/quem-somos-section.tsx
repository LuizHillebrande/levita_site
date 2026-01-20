'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageCarousel } from './image-carousel'

// Imagens do carrossel - adicione suas imagens aqui
const images = [
  '/images/institutional/factory-01.jpg',
  '/images/institutional/factory-02.jpg',
  '/images/institutional/factory-03.jpg',
  '/images/institutional/team-01.jpg',
]

export function QuemSomosSection() {
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Texto */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
              Quem Somos
            </h2>
            <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="font-bold text-[#67CBDD] text-xl md:text-2xl mb-2 relative pl-4 border-l-4 border-[#67CBDD] bg-[#67CBDD]/5 py-3 rounded-r-lg">
                  Há mais de 40 anos fazendo história.
                </p>
              </div>
              <p>
                Através da qualidade e por meio de um sistema de distribuição eficaz, 
                nos consolidamos como a marca mais lembrada pelo paranaense na categoria 
                móveis hospitalares. Pioneiros na região de Londrina neste ramo, somos 
                conhecidos por manter um padrão técnico na confecção de nossos produtos, 
                que resulta em móveis de alta durabilidade e atende minuciosamente as 
                exigências do mercado.
              </p>
            </div>
          </div>

          {/* Carrossel de Imagens */}
          <div>
            <ImageCarousel images={images} />
          </div>
        </div>
      </div>
    </section>
  )
}

