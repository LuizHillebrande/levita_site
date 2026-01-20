import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { RotatingText } from '@/components/rotating-text'
import { HeroCarousel } from '@/components/hero-carousel'
import { StatsCounter } from '@/components/stats-counter'
import { QuemSomosSection } from '@/components/quem-somos-section'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Rotating Text */}
      <RotatingText />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Quem Somos */}
      <QuemSomosSection />

      {/* Categorias */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
            Nossas Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Camas', 'Armários', 'Berços', 'Carros', 'Mesas', 'Suportes', 'Diversos'].map((category) => (
              <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-center text-lg">{category}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-secondary">Produtos em Destaque</h2>
            <Button asChild variant="ghost">
              <Link href="/produtos">
                Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl">🛏️</span>
                </div>
                <CardHeader>
                  <CardTitle>Produto {i}</CardTitle>
                  <CardDescription>
                    Descrição breve do produto hospitalar de alta qualidade.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/produtos/produto-${i}`}>Ver Detalhes</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre a Empresa */}
      <section className="py-16 bg-[#67CBDD]/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-secondary">Quem Somos</h2>
              <p className="text-gray-700 mb-4">
                Fabricantes de móveis hospitalares, nos consolidamos como a marca mais lembrada 
                pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.
              </p>
              <p className="text-gray-700 mb-4">
                Pioneiros na região de Londrina neste ramo, somos conhecidos por manter um padrão 
                técnico na confecção de nossos produtos, que resulta em móveis de alta durabilidade 
                e atende minuciosamente as exigências do mercado.
              </p>
              <Button asChild>
                <Link href="/sobre">Saiba Mais</Link>
              </Button>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-secondary">Nossos Valores</h3>
              <ul className="space-y-4">
                {[
                  'Qualidade e durabilidade',
                  'Compromisso com o cliente',
                  'Inovação contínua',
                  'Padrão técnico elevado'
                ].map((value) => (
                  <li key={value} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-gray-700">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

