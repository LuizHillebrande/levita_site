'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  // Imagens do carrossel - adicione suas imagens aqui
  const slides = [
    {
      imageDesktop: '/images/banners/home-01-desktop.png',
      imageMobile: '/images/banners/home-01-mobile.png',
      title: 'Móveis Hospitalares de Alta Qualidade',
      description: 'Buscamos o aperfeiçoamento contínuo da qualidade de nossos produtos e serviços, visando atender e superar os requisitos de nossos clientes.',
      buttonText: 'Ver Produtos',
      buttonLink: '/produtos',
      text: 'A marca mais lembrada pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.',
    },
    {
      imageDesktop: '/images/banners/home-02-desktop.png',
      imageMobile: '/images/banners/home-02-mobile.png',
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
    <>
      <section className="relative overflow-hidden bg-[#1a3060] md:hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 90% 8%, rgba(61,200,212,0.25), transparent 45%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background:
              'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 32px)',
          }}
        />

        <div className="relative z-10 flex flex-col gap-[14px] px-[22px] pb-6 pt-5">
          <div className="inline-flex items-center gap-1.5 rounded-[20px] border border-[rgba(61,200,212,0.45)] bg-[rgba(61,200,212,0.18)] px-3.5 py-1">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3dc8d4]" />
            <span className="text-[12px] font-medium tracking-[0.05em] text-[#a8eef2]">
              REFERÊNCIA NO PARANÁ
            </span>
          </div>

          <div className="flex w-full items-center justify-center">
            <Image
              src={slides[currentSlide].imageMobile}
              alt="Cama hospitalar Levita"
              width={340}
              height={240}
              priority
              className="h-auto w-full max-h-[240px] object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>

          <h1 className="m-0 text-[26px] font-normal leading-[1.2] text-white">
            Segurança e <span className="text-[#3dc8d4]">conforto</span> em cada atendimento
          </h1>
          <p className="m-0 text-[14px] leading-[1.55] text-[rgba(255,255,255,0.65)]">
            Equipamentos hospitalares com qualidade certificada, desenvolvidos para proteger
            pacientes e facilitar o trabalho das equipes de saúde.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {['✓ ISO certificado', '✓ +40 anos no mercado', '✓ Entrega em todo o Brasil'].map((pill) => (
              <span
                key={pill}
                className="rounded-[20px] border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.07)] px-2.5 py-[3px] text-[11px] text-[rgba(255,255,255,0.6)]"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/produtos"
              className="flex-1 rounded-xl bg-[#3dc8d4] px-4 py-[14px] text-center text-[15px] font-bold text-[#0a2a40]"
            >
              Ver Produtos →
            </Link>
            <Link
              href="/contato"
              className="whitespace-nowrap rounded-xl border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] px-4 py-[14px] text-[15px] text-white"
            >
              Falar com vendas
            </Link>
          </div>
        </div>
      </section>

      <section
        className="relative hidden min-h-[760px] overflow-hidden bg-[#1a3060] px-10 md:flex md:items-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="pointer-events-none absolute h-[500px] w-[500px]"
          style={{
            top: '-80px',
            right: '200px',
            background: 'radial-gradient(circle, rgba(61,200,212,0.2), transparent 65%)',
          }}
        />
        <div
          className="pointer-events-none absolute h-[300px] w-[300px]"
          style={{
            bottom: '-60px',
            left: '60px',
            background: 'radial-gradient(circle, rgba(61,200,212,0.1), transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            background:
              'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 32px)',
          }}
        />

        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-[1280px] items-center">
              <div className="z-[2] flex-1 max-w-[520px] pr-10">
                <div className="mb-[18px] inline-flex items-center gap-[7px] rounded-[20px] border border-[rgba(61,200,212,0.4)] bg-[rgba(61,200,212,0.15)] px-4 py-[5px]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#3dc8d4]" />
                  <span className="text-[12px] font-medium tracking-[0.06em] text-[#a8eef2]">
                    REFERÊNCIA NO PARANÁ · +40 ANOS DE MERCADO
                  </span>
                </div>
                <h1 className="mb-6 text-[56px] font-normal leading-[1.16] text-white">
                  Segurança e <span className="text-[#3dc8d4]">conforto</span> em cada atendimento
                </h1>
                <p className="mb-9 max-w-[500px] text-[19px] leading-[1.8] text-[rgba(255,255,255,0.65)]">
                  Equipamentos hospitalares com qualidade certificada, desenvolvidos para proteger
                  pacientes e facilitar o trabalho das equipes de saúde em todo o Brasil.
                </p>
                <div className="mb-9 flex flex-wrap gap-2.5">
                  {[
                    '✓ ISO certificado',
                    '✓ +350 cidades atendidas',
                    '✓ +26 estados',
                    '✓ Entrega em todo o Brasil',
                  ].map((pill) => (
                    <span
                      key={pill}
                      className="rounded-[20px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.07)] px-4 py-[7px] text-[13px] text-[rgba(255,255,255,0.6)]"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/produtos"
                    className="rounded-[12px] bg-[#3dc8d4] px-9 py-4 text-[17px] font-bold text-[#0a2a40]"
                  >
                    Ver Produtos →
                  </Link>
                  <Link
                    href="/contato"
                    className="rounded-[12px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] px-7 py-4 text-[16px] text-white"
                  >
                    Falar com vendas
                  </Link>
                </div>
              </div>

              <div className="z-[2] flex w-[620px] flex-shrink-0 translate-x-[150px] items-end justify-center self-stretch">
                <Image
                  src={slide.imageDesktop}
                  alt={slide.title}
                  width={620}
                  height={700}
                  priority={index === 0}
                  className="h-full max-h-[700px] w-full -translate-y-8 object-contain object-bottom mix-blend-screen"
                  sizes="(min-width: 768px) 620px, 100vw"
                  unoptimized
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

