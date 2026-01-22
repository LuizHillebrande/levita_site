import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { RotatingText } from '@/components/rotating-text'
import { HeroCarousel } from '@/components/hero-carousel'
import { StatsCounter } from '@/components/stats-counter'
import { QuemSomosSection } from '@/components/quem-somos-section'
import { FeaturedProducts } from '@/components/featured-products'
import { CertificationsSection } from '@/components/certifications-section'
import { CategoriesSection } from '@/components/categories-section'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Rotating Text */}
      <RotatingText />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Quem Somos */}
      <QuemSomosSection />

      {/* Categorias */}
      <CategoriesSection />

      {/* Produtos em Destaque - Estilo Tecnológico */}
      <FeaturedProducts />

      {/* Certificações */}
      <CertificationsSection />

      {/* Sobre a Empresa - Estilo Tecnológico */}
      <section className="py-20 bg-gradient-to-br from-[#67CBDD]/10 via-white to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                  Quem Somos
                </h2>
                <div className="w-24 h-1 bg-[#67CBDD] rounded-full mb-6"></div>
              </div>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Fabricantes de móveis hospitalares, nos consolidamos como a marca mais lembrada 
                  pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.
                </p>
                <p>
                  Pioneiros na região de Londrina neste ramo, somos conhecidos por manter um padrão 
                  técnico na confecção de nossos produtos, que resulta em móveis de alta durabilidade 
                  e atende minuciosamente as exigências do mercado.
                </p>
              </div>
              <Button asChild size="lg" className="bg-[#67CBDD] hover:bg-[#4FA8B8] text-white">
                <Link href="/sobre">Saiba Mais</Link>
              </Button>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl border-2 border-[#67CBDD]/20">
              <h3 className="text-2xl font-bold mb-6 text-secondary flex items-center">
                <span className="w-1 h-8 bg-[#67CBDD] rounded-full mr-3"></span>
                Nossos Valores
              </h3>
              <ul className="space-y-4">
                {[
                  'Qualidade e durabilidade',
                  'Compromisso com o cliente',
                  'Inovação contínua',
                  'Padrão técnico elevado'
                ].map((value) => (
                  <li key={value} className="flex items-center space-x-3 group">
                    <div className="w-8 h-8 bg-[#67CBDD]/10 rounded-full flex items-center justify-center group-hover:bg-[#67CBDD] transition-colors">
                      <CheckCircle className="h-5 w-5 text-[#67CBDD] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-gray-700 font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Estilo Tecnológico */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-secondary via-secondary/95 to-secondary relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#67CBDD] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#67CBDD] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Precisa de um Orçamento?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e solicite um orçamento personalizado para suas necessidades hospitalares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#67CBDD] hover:bg-[#4FA8B8] text-white border-2 border-white/30 shadow-xl text-lg px-8 py-6">
              <Link href="/contato">Fale Conosco</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/50 backdrop-blur-sm text-lg px-8 py-6">
              <Link href="/produtos">Ver Produtos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

