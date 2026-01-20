import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function ProdutoPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Galeria de Imagens */}
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-8xl">🛏️</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded cursor-pointer hover:opacity-75 transition-opacity">
              </div>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
        <div>
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Cama Fowler Elétrica LV 198 PE
          </h1>
          <p className="text-gray-600 mb-6">
            Cama hospitalar elétrica de alta qualidade com sistema de elevação 
            e inclinação para máximo conforto do paciente.
          </p>

          <Separator className="my-6" />

          {/* Ficha Técnica */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ficha Técnica</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Dimensões:</dt>
                  <dd className="font-medium">200cm x 90cm x 60cm</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Peso Máximo:</dt>
                  <dd className="font-medium">150kg</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Material:</dt>
                  <dd className="font-medium">Aço inoxidável</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Garantia:</dt>
                  <dd className="font-medium">12 meses</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full">
            Solicitar Orçamento
          </Button>
        </div>
      </div>

      {/* Descrição Detalhada */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-secondary mb-4">Descrição Detalhada</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            A Cama Fowler Elétrica LV 198 PE é um produto de alta qualidade desenvolvido 
            para atender as necessidades de conforto e funcionalidade em ambientes hospitalares.
          </p>
          <p className="text-gray-700 mb-4">
            Com sistema elétrico de elevação e inclinação, oferece máximo conforto ao paciente 
            e facilita o trabalho da equipe médica. Fabricada com materiais de primeira linha, 
            garante durabilidade e segurança.
          </p>
        </div>
      </div>
    </div>
  )
}

