'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  shortDescription?: string
  description?: string
  featured: boolean
  images: Array<{
    id: string
    url: string
    alt?: string
  }>
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching featured products:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                Produtos em Destaque
              </h2>
              <div className="w-24 h-1 bg-[#67CBDD] rounded-full"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null // Não mostra a seção se não houver produtos em destaque
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
              Produtos em Destaque
            </h2>
            <div className="w-24 h-1 bg-[#67CBDD] rounded-full"></div>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0 border-2 border-[#67CBDD] text-[#67CBDD] hover:bg-[#67CBDD] hover:text-white">
            <Link href="/produtos">
              Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-[#67CBDD]"
            >
              <div className="aspect-video bg-gradient-to-br from-[#67CBDD]/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                ) : (
                  <>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🛏️</span>
                    <div className="absolute inset-0 bg-[#67CBDD]/0 group-hover:bg-[#67CBDD]/10 transition-colors"></div>
                  </>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-[#67CBDD] transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {product.shortDescription || product.description?.substring(0, 100) || 'Produto hospitalar de alta qualidade.'}
                  {product.description && product.description.length > 100 && '...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-[#67CBDD] hover:bg-[#4FA8B8] text-white">
                  <Link href={`/produtos/${product.slug}`}>Ver Detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
