'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  description?: string | null
  order?: number
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        // Ordenar por campo 'order' e depois por nome
        const sortedCategories = (data.categories || []).sort((a: Category, b: Category) => {
          const aOrder = a.order ?? 0
          const bOrder = b.order ?? 0
          if (aOrder !== bOrder) {
            return aOrder - bOrder
          }
          return a.name.localeCompare(b.name)
        })
        setCategories(sortedCategories)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Nossas Categorias
            </h2>
            <div className="w-24 h-1 bg-[#67CBDD] mx-auto rounded-full"></div>
          </div>
          <div className="text-center py-12 text-gray-600">Carregando categorias...</div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Nossas Categorias
          </h2>
          <div className="w-24 h-1 bg-[#67CBDD] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/produtos/${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Imagem de fundo ou cor sólida */}
              <div className="absolute inset-0 bg-secondary">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                    <span className="text-6xl opacity-30">🏥</span>
                  </div>
                )}
                {/* Overlay escuro para melhor legibilidade do texto */}
                <div className="absolute inset-0 bg-secondary/60 group-hover:bg-secondary/50 transition-colors"></div>
              </div>
              
              {/* Texto sobreposto */}
              <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold text-center uppercase tracking-wide drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
