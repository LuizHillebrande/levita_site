'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  shortDescription?: string
  description?: string
  price?: number
  active: boolean
  images: Array<{
    id: string
    url: string
    alt?: string
  }>
  category?: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProdutosPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  useEffect(() => {
    // Ler parâmetro de busca da URL
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearch(searchParam)
    }

    Promise.all([
      fetch('/api/products?active=true').then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData.products || [])
      setCategories(categoriesData.categories || [])
      setLoading(false)
    }).catch((error) => {
      console.error('Error fetching data:', error)
      setLoading(false)
    })
  }, [searchParams])

  // Filtrar e ordenar produtos
  const filteredProducts = products
    .filter((product) => {
      // Filtro por categoria
      if (selectedCategory !== 'all') {
        if (!product.category || product.category.slug !== selectedCategory) {
          return false
        }
      }

      // Filtro por busca
      if (search) {
        const searchLower = search.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.shortDescription?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name)
      } else {
        // newest (padrão) - ordenar por ID (mais recentes primeiro)
        return b.id.localeCompare(a.id)
      }
    })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#67CBDD]" />
        </div>
      </div>
    )
  }

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
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
      {filteredProducts.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const mainImage = product.images && product.images.length > 0 ? product.images[0] : null

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {mainImage ? (
                    <Image
                      src={mainImage.url}
                      alt={mainImage.alt || product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🛏️</span>
                    </div>
                  )}
                </div>
                <CardHeader className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.shortDescription || product.description?.substring(0, 100) || 'Produto hospitalar de alta qualidade'}
                    {product.description && product.description.length > 100 && '...'}
                  </CardDescription>
                  {product.price && (
                    <p className="text-xl font-bold text-[#67CBDD] mt-2">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-[#67CBDD] hover:bg-[#4FA8B8] text-white">
                    <Link href={`/produtos/${product.slug}`}>Ver Detalhes</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Nenhum produto encontrado.</p>
          {search && (
            <p className="text-gray-500 mt-2">
              Tente ajustar os filtros de busca.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
