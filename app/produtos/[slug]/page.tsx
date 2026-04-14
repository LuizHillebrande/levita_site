'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, ArrowLeft, Star, StarHalf } from 'lucide-react'
import { BuildYourBed, SelectedOptionalSummary } from '@/components/build-your-bed'
import Link from 'next/link'
import { formatProductQuoteWhatsAppMessage, openWhatsAppWithText, getPublicSiteBaseUrl } from '@/lib/whatsapp'
import { ProductReviewsSection } from '@/components/product-reviews-section'

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
  description?: string
}

export default function ProdutoPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isCategory, setIsCategory] = useState<boolean | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageOverrideUrl, setImageOverrideUrl] = useState<string | null>(null)
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([])
  const [selectedOptionalsSummary, setSelectedOptionalsSummary] = useState<SelectedOptionalSummary[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [ratingSummary, setRatingSummary] = useState<{ count: number; avg: number } | null>(null)

  useEffect(() => {
    // Verificar se é categoria ou produto
    Promise.all([
      fetch('/api/categories').then((res) => res.json()),
      fetch('/api/products?active=true').then((res) => res.json()),
    ]).then(([categoriesData, productsData]) => {
      const foundCategory = categoriesData.categories?.find(
        (cat: Category) => cat.slug === slug
      )
      const foundProduct = productsData.products?.find(
        (p: Product) => p.slug === slug
      )

      if (foundCategory) {
        setIsCategory(true)
        setCategory(foundCategory)
        // Buscar produtos da categoria
        fetch(`/api/products?category=${slug}&active=true`)
          .then((res) => res.json())
          .then((data) => {
            setCategoryProducts(data.products || [])
            setLoading(false)
          })
      } else if (foundProduct) {
        setIsCategory(false)
        setProduct(foundProduct)
        setImageOverrideUrl(null)
        setLoading(false)
      } else {
        setIsCategory(false)
        setLoading(false)
      }
    }).catch((error) => {
      console.error('Error fetching data:', error)
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    if (!product?.id) {
      setRelatedProducts([])
      return
    }
    fetch(`/api/products/${product.id}/related`)
      .then((res) => res.json())
      .then((data) => setRelatedProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setRelatedProducts([]))
  }, [product?.id])

  useEffect(() => {
    if (!product?.id) {
      setRatingSummary(null)
      return
    }
    fetch(`/api/products/${product.id}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const reviews = Array.isArray(data.reviews) ? data.reviews : []
        if (reviews.length === 0) {
          setRatingSummary(null)
          return
        }
        const sum = reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0)
        setRatingSummary({ count: reviews.length, avg: sum / reviews.length })
      })
      .catch(() => setRatingSummary(null))
  }, [product?.id])

  // Se for categoria, renderizar página de categoria
  if (isCategory === true && category) {
    const filteredProducts = categoryProducts
      .filter((product) => {
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
          return b.id.localeCompare(a.id)
        }
      })

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/produtos"
            className="inline-flex items-center text-[#67CBDD] hover:text-[#4FA8B8] mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Produtos
          </Link>
          <h1 className="text-4xl font-bold text-secondary mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 text-lg">{category.description}</p>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
            <p className="text-gray-600 text-lg">Nenhum produto encontrado nesta categoria.</p>
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

  const displayedMainImage = imageOverrideUrl
    ? { url: imageOverrideUrl, alt: `${product.name} (com opcional)` }
    : mainImage

  const technicalSpecs = product.technicalSpecs || {}

  const handleOpenWhatsApp = () => {
    const text = formatProductQuoteWhatsAppMessage({
      productName: product.name,
      productSlug: product.slug,
      baseUrl: getPublicSiteBaseUrl(),
      optionals: selectedOptionalsSummary.map((o) => ({
        name: o.name,
        showPrice: o.showPrice,
        price: o.price,
      })),
    })
    openWhatsAppWithText(text)
  }

  return (
    <div className="container mx-auto px-4 py-12 pb-20">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Galeria de Imagens */}
        <div>
          {displayedMainImage ? (
            <>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src={displayedMainImage.url}
                  alt={displayedMainImage.alt || product.name}
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
                      className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-[#67CBDD] opacity-100'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => {
                        setSelectedImageIndex(index)
                        // Se existir override por opcional, mantemos o comportamento "opcional manda" (MVP).
                      }}
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

          {ratingSummary && ratingSummary.count > 0 && (
            <div
              className="mb-6 inline-flex flex-wrap items-center gap-3 rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white px-4 py-3 shadow-sm"
              role="img"
              aria-label={`Média ${ratingSummary.avg.toFixed(1)} de 5 estrelas, ${ratingSummary.count} avaliações`}
            >
              <div className="flex items-center gap-0.5" aria-hidden>
                {[1, 2, 3, 4, 5].map((n) => {
                  const { avg } = ratingSummary
                  if (avg >= n) {
                    return (
                      <Star
                        key={n}
                        className="h-6 w-6 shrink-0 fill-amber-400 text-amber-400"
                        strokeWidth={1.5}
                      />
                    )
                  }
                  if (avg >= n - 0.5) {
                    return (
                      <StarHalf
                        key={n}
                        className="h-6 w-6 shrink-0 fill-amber-400 text-amber-400"
                        strokeWidth={1.5}
                      />
                    )
                  }
                  return (
                    <Star
                      key={n}
                      className="h-6 w-6 shrink-0 text-gray-300"
                      strokeWidth={1.5}
                    />
                  )
                })}
              </div>
              <div className="flex flex-col gap-0.5 text-sm leading-tight">
                <span className="font-semibold text-secondary tabular-nums">
                  {ratingSummary.avg.toLocaleString('pt-BR', {
                    minimumFractionDigits: ratingSummary.avg % 1 === 0 ? 0 : 1,
                    maximumFractionDigits: 1,
                  })}{' '}
                  de 5
                </span>
                <span className="text-gray-600">
                  {ratingSummary.count}{' '}
                  {ratingSummary.count === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </div>
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

          {/* Monte sua Cama */}
          {product && !isCategory && (
            <BuildYourBed
              productId={product.id}
              onSelectionChange={(ids, summary) => {
                setSelectedOptionals(ids)
                setSelectedOptionalsSummary(summary)
              }}
              onImageOverrideChange={setImageOverrideUrl}
            />
          )}

          <Button 
            size="lg" 
            className="w-full bg-[#67CBDD] hover:bg-[#4FA8B8] text-white mt-6"
            onClick={handleOpenWhatsApp}
          >
            Solicitar Orçamento
          </Button>
        </div>
      </div>

      {/* Descrição Detalhada */}
      {product.description && (
        <section className="mt-14 max-w-4xl">
          <Card className="overflow-hidden border-gray-200 shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-[#67CBDD] to-[#4FA8B8]" aria-hidden />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-secondary">Descrição detalhada</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-lg bg-gray-50/80 border border-gray-100 px-5 py-6 md:px-7 md:py-7">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px] md:text-base">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-secondary mb-8">Produtos relacionados</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => {
              const img = p.images?.[0]
              return (
                <Card key={p.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                  <Link href={`/produtos/${p.slug}`} className="block">
                    <div className="aspect-video bg-gray-100 relative">
                      {img ? (
                        <Image
                          src={img.url}
                          alt={img.alt || p.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><span className="text-4xl">🛏️</span></div>
                      )}
                    </div>
                  </Link>
                  <CardHeader className="flex-1 pb-2">
                    <CardTitle className="text-lg line-clamp-2">{p.name}</CardTitle>
                    {p.shortDescription && (
                      <CardDescription className="line-clamp-2">{p.shortDescription}</CardDescription>
                    )}
                    {p.price != null && (
                      <p className="text-lg font-bold text-[#67CBDD] mt-2">
                        R${' '}
                        {p.price.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full bg-[#67CBDD] hover:bg-[#4FA8B8] text-white">
                      <Link href={`/produtos/${p.slug}`}>Ver produto</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      <ProductReviewsSection productId={product.id} productName={product.name} />
    </div>
  )
}
