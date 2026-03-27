import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { HeroCarousel } from '@/components/hero-carousel'
import { StatsCounter } from '@/components/stats-counter'
import { QuemSomosSection } from '@/components/quem-somos-section'
import { FeaturedProducts } from '@/components/featured-products'
import { CertificationsSection } from '@/components/certifications-section'
import { CategoriesSection } from '@/components/categories-section'
import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('@/components/model-viewer'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col">
      <a
        href="https://wa.me/5543991598585"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden="true">
          <path d="M19.11 17.36c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.89 1.09-.16.19-.33.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.87-2.11-.23-.55-.47-.47-.64-.48l-.55-.01c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1.01 2.72 1.15 2.91c.14.19 1.98 3.03 4.8 4.25.67.29 1.19.46 1.59.59.67.21 1.29.18 1.78.11.54-.08 1.66-.68 1.9-1.34.23-.66.23-1.22.16-1.34-.07-.12-.26-.19-.54-.33z" />
          <path d="M16 3.2c-7.05 0-12.8 5.74-12.8 12.8 0 2.25.59 4.46 1.7 6.4L3.2 28.8l6.56-1.67A12.73 12.73 0 0 0 16 28.8c7.05 0 12.8-5.74 12.8-12.8S23.05 3.2 16 3.2zm0 23.31c-1.98 0-3.92-.53-5.62-1.53l-.4-.24-3.89.99 1.04-3.79-.26-.39a10.45 10.45 0 0 1-1.62-5.56c0-5.76 4.69-10.45 10.45-10.45 2.79 0 5.41 1.09 7.38 3.06A10.37 10.37 0 0 1 26.44 16c0 5.76-4.69 10.45-10.44 10.45z" />
        </svg>
      </a>

      <HeroCarousel />
      <StatsCounter />

      <section className="bg-[#f4f8fa] px-4 py-8 md:px-10">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[#6b8a99]">
          </p>
          <ModelViewer />
        </div>
      </section>

      <QuemSomosSection />
      <CategoriesSection />
      <FeaturedProducts />
      <CertificationsSection />

      <section className="bg-gradient-to-br from-[#67CBDD]/10 via-white to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-4xl font-bold text-secondary md:text-5xl">Quem Somos</h2>
                <div className="mb-6 h-1 w-24 rounded-full bg-[#67CBDD]"></div>
              </div>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                <p>
                  Fabricantes de móveis hospitalares, nos consolidamos como a marca mais lembrada
                  pelo paranaense através da qualidade e por meio de um sistema de distribuição
                  eficaz.
                </p>
                <p>
                  Pioneiros na região de Londrina neste ramo, somos conhecidos por manter um padrão
                  técnico na confecção de nossos produtos, que resulta em móveis de alta
                  durabilidade e atende minuciosamente as exigências do mercado.
                </p>
              </div>
              <Button asChild size="lg" className="bg-[#67CBDD] text-white hover:bg-[#4FA8B8]">
                <Link href="/sobre">Saiba Mais</Link>
              </Button>
            </div>
            <div className="rounded-xl border-2 border-[#67CBDD]/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
              <h3 className="mb-6 flex items-center text-2xl font-bold text-secondary">
                <span className="mr-3 h-8 w-1 rounded-full bg-[#67CBDD]"></span>
                Nossos Valores
              </h3>
              <ul className="space-y-4">
                {[
                  'Qualidade e durabilidade',
                  'Compromisso com o cliente',
                  'Inovação contínua',
                  'Padrão técnico elevado',
                ].map((value) => (
                  <li key={value} className="group flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#67CBDD]/10 transition-colors group-hover:bg-[#67CBDD]">
                      <CheckCircle className="h-5 w-5 text-[#67CBDD] transition-colors group-hover:text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-secondary via-secondary/95 to-secondary py-20 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#67CBDD] blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#67CBDD] blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Precisa de um Orçamento?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90 md:text-2xl">
            Entre em contato conosco e solicite um orçamento personalizado para suas necessidades
            hospitalares.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="border-2 border-white/30 bg-[#67CBDD] px-8 py-6 text-lg text-white shadow-xl hover:bg-[#4FA8B8]"
            >
              <Link href="/contato">Fale Conosco</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/50 bg-white/10 px-8 py-6 text-lg text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/produtos">Ver Produtos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
