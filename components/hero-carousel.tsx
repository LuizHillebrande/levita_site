'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  // Imagens do carrossel - adicione suas imagens aqui
  const slides = [
    {
      image: '/images/banners/home-01.jpg',
      mobileImage: '/images/banners/home-01-celular.png',
      title: 'Móveis Hospitalares de Alta Qualidade',
      description: 'Buscamos o aperfeiçoamento contínuo da qualidade de nossos produtos e serviços, visando atender e superar os requisitos de nossos clientes.',
      buttonText: 'Ver Produtos',
      buttonLink: '/produtos',
      text: 'A marca mais lembrada pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.',
    },
    {
      image: '/images/banners/home-02.jpg',
      mobileImage: '/images/banners/home-02-celular.png',
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

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return
    const distance = touchStartX - touchEndX
    if (distance > minSwipeDistance) nextSlide()
    if (distance < -minSwipeDistance) prevSlide()
  }

  return (
    <div
      className="relative w-full h-[91vh] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
              className="hidden md:block object-cover"
              priority={index === 0}
              quality={100}
              sizes="100vw"
              unoptimized
              style={{ boxShadow: 'none', imageRendering: 'auto' }}
            />
            <Image
              src={slide.mobileImage || slide.image}
              alt={slide.title}
              fill
              className="md:hidden object-cover"
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
            <div className="absolute top-20 md:top-auto md:bottom-32 right-4 md:right-8 z-20 max-w-[calc(100%-2rem)] md:max-w-md">
              <div className="p-0">
                <h2 className="text-base md:text-xl lg:text-2xl font-bold text-white mb-2 leading-tight">
                  Muito mais recursos para as equipes de cuidado e para a segurança do paciente
                </h2>
                {slide.text && (
                  <p className="text-white text-sm md:text-base leading-relaxed mb-3">
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

