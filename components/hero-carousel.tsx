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
      text: 'Referência no mercado em que atuamos por todo território nacional, por manter um padrão técnico na confecção de nossos produtos.',
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
    <div className="relative w-full h-screen min-h-[500px] max-h-[800px] overflow-hidden">
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
            />
            {/* Overlay sutil para melhor legibilidade do botão */}
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Botão no canto superior esquerdo */}
            <div className="absolute top-6 left-6 z-20">
              <Button asChild size="lg" className="bg-white/50 backdrop-blur-md text-secondary hover:bg-white/70 border border-white/40">
                <Link href={slide.buttonLink}>{slide.buttonText}</Link>
              </Button>
            </div>

            {/* Texto no meio direito - cada slide tem seu próprio texto */}
            {slide.text && (
              <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-22 lg:right-32 z-20 max-w-lg">
                <p className="text-white text-lg md:text-xl lg:text-2xl drop-shadow-lg text-justify">
                  {slide.text}
                </p>
              </div>
            )}
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

