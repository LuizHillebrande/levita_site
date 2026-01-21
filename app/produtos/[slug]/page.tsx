'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { QuoteDialog } from '@/components/quote-dialog'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price?: number
  images: Array<{
    id: string
    url: string
    alt?: string
  }>
  technicalSpecs?: Record<string, string>
  documentation?: string[]
}

export default function ProdutoPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.products?.find((p: Product) => p.slug === slug)
        if (foundProduct) {
          setProduct(foundProduct)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching product:', error)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#67CBDD]" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Produto não encontrado</h1>
          <p className="text-gray-600">O produto que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  const mainImage = product.images && product.images.length > 0 
    ? product.images[selectedImageIndex] || product.images[0]
    : null

  const technicalSpecs = product.technicalSpecs || {}

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Galeria de Imagens */}
        <div>
          {mainImage ? (
            <>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-[#67CBDD] opacity-100'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || `${product.name} - Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-8xl">🛏️</span>
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div>
          <h1 className="text-4xl font-bold text-secondary mb-4">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="text-gray-600 mb-6 text-lg">
              {product.shortDescription}
            </p>
          )}

          {product.price && (
            <div className="mb-6">
              <p className="text-3xl font-bold text-[#67CBDD]">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <Separator className="my-6" />

          {/* Ficha Técnica */}
          {Object.keys(technicalSpecs).length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ficha Técnica</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {Object.entries(technicalSpecs).map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-gray-600">{label}:</dt>
                      <dd className="font-medium text-right max-w-[60%]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Documentação */}
          {product.documentation && product.documentation.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Documentação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {product.documentation.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#67CBDD] hover:underline"
                    >
                      Documento {index + 1}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            size="lg" 
            className="w-full bg-[#67CBDD] hover:bg-[#4FA8B8] text-white"
            onClick={() => setQuoteDialogOpen(true)}
          >
            Solicitar Orçamento
          </Button>
        </div>
      </div>

      {/* Descrição Detalhada */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-secondary mb-4">Descrição Detalhada</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      )}

      {/* Dialog de Orçamento */}
      <QuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        productName={product.name}
        productSlug={product.slug}
      />
    </div>
  )
}
