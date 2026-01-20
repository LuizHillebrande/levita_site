import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
          Quem Somos
        </h1>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 text-lg mb-6">
            Fabricantes de móveis hospitalares, nos consolidamos como a marca mais lembrada 
            pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.
          </p>

          <p className="text-gray-700 text-lg mb-6">
            Pioneiros na região de Londrina neste ramo, somos conhecidos por manter um padrão 
            técnico na confecção de nossos produtos, que resulta em móveis de alta durabilidade 
            e atende minuciosamente as exigências do mercado.
          </p>

          <p className="text-gray-700 text-lg mb-6">
            Investimos na disponibilização de produtos que viabilizam a higiene e também a 
            funcionalidade do sistema hospitalar.
          </p>

          <p className="text-gray-700 text-lg mb-6">
            Por manter o compromisso com nossos clientes, ofertando produtos confiáveis e seguros, 
            buscamos o aperfeiçoamento contínuo da qualidade de nossos produtos e serviços, visando 
            atender e superar os requisitos de nossos clientes.
          </p>

          <p className="text-gray-700 text-lg">
            Permanecendo, assim, como referência no mercado em que atuamos por todo território nacional.
          </p>
        </div>

        {/* Valores e Diferenciais */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">Nossos Valores</h2>
              <ul className="space-y-3">
                {[
                  'Qualidade e durabilidade',
                  'Compromisso com o cliente',
                  'Inovação contínua',
                  'Padrão técnico elevado',
                  'Responsabilidade social',
                  'Ética e transparência'
                ].map((value) => (
                  <li key={value} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">Nossos Diferenciais</h2>
              <ul className="space-y-3">
                {[
                  'Pioneiros na região de Londrina',
                  'Sistema de distribuição eficaz',
                  'Produtos que viabilizam a higiene',
                  'Funcionalidade do sistema hospitalar',
                  'Atendimento em todo território nacional',
                  'Produtos confiáveis e seguros'
                ].map((diferencial) => (
                  <li key={diferencial} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{diferencial}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


