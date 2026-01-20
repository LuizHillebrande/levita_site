import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default function ProdutosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-4">Nossos Produtos</h1>
        <p className="text-gray-600">
          Explore nossa linha completa de móveis hospitalares de alta qualidade
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="camas">Camas</SelectItem>
              <SelectItem value="armarios">Armários</SelectItem>
              <SelectItem value="bercos">Berços</SelectItem>
              <SelectItem value="carros">Carros</SelectItem>
              <SelectItem value="mesas">Mesas</SelectItem>
              <SelectItem value="suportes">Suportes</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome A-Z</SelectItem>
              <SelectItem value="name-desc">Nome Z-A</SelectItem>
              <SelectItem value="newest">Mais recentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">🛏️</span>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Produto {i + 1}</CardTitle>
              <CardDescription>
                Descrição breve do produto hospitalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/produtos/produto-${i + 1}`}>Ver Detalhes</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-12 space-x-2">
        <Button variant="outline">Anterior</Button>
        <Button variant="outline">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Próxima</Button>
      </div>
    </div>
  )
}


