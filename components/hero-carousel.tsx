'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Imagens do carrossel - adicione suas imagens aqui
  const slides = [
    {
      image: '/images/banners/home-01.jpg',
      title: 'Móveis Hospitalares de Alta Qualidade',
      description: 'Buscamos o aperfeiçoamento contínuo da qualidade de nossos produtos e serviços, visando atender e superar os requisitos de nossos clientes.',
      buttonText: 'Ver Produtos',
      buttonLink: '/produtos',
      text: 'A marca mais lembrada pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.',
    },
    {
      image: '/images/banners/home-02.jpg',
      title: 'Soluções Hospitalares Completas',
      description: 'Pioneiros na região de Londrina, oferecemos móveis hospitalares de alta durabilidade que atendem minuciosamente as exigências do mercado.',
      buttonText: 'Solicitar Orçamento',
      buttonLink: '/contato',
      text: 'A marca mais lembrada pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.',
    },
    
  ]

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000) // Muda a cada 5 segundos

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-[91vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              quality={100}
              sizes="100vw"
              unoptimized
              style={{ boxShadow: 'none', imageRendering: 'auto' }}
            />
            {/* Overlay gradiente tecnológico */}
          {/* <div className="absolute inset-0 bg-gradient-to-r ..."></div> */}
          {/* <div className="absolute inset-0 bg-[#67CBDD]/15"></div> */}
            
            {/* Container de texto no canto inferior direito - menor */}
            <div className="absolute bottom-24 md:bottom-32 right-4 md:right-8 z-20 max-w-xs md:max-w-md">
            <div className="bg-white/10 border-l-4 border-[#67CBDD] p-3 md:p-4 rounded-r-xl shadow-2xl">
                <h2 className="text-sm md:text-base lg:text-lg font-bold text-white mb-2 leading-tight">
                  Muito mais recursos para as equipes de cuidado e para a segurança do paciente
                </h2>
                {slide.text && (
                  <p className="text-white/95 text-xs md:text-sm leading-relaxed mb-3">
                    {slide.text}
                  </p>
                )}
                <Button asChild size="sm" className="bg-[#67CBDD] hover:bg-[#4FA8B8] text-white border-2 border-white/30 shadow-lg font-semibold text-xs md:text-sm">
                  <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-secondary p-2 rounded-full transition-all"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-secondary p-2 rounded-full transition-all"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores de slide */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

