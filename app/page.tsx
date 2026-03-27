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
