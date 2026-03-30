'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface ProductOptional {
  id: string
  name: string
  description: string | null
  price: number | null
  showPrice: boolean
  imageUrl?: string | null
}

export interface SelectedOptionalSummary {
  id: string
  name: string
  description: string | null
  price: number | null
  showPrice: boolean
}

interface BuildYourBedProps {
  productId: string
  onSelectionChange: (selectedOptionals: string[], selectedOptionalsSummary: SelectedOptionalSummary[]) => void
  onImageOverrideChange?: (imageUrl: string | null) => void
}

export function BuildYourBed({ productId, onSelectionChange, onImageOverrideChange }: BuildYourBedProps) {
  const [optionals, setOptionals] = useState<ProductOptional[]>([])
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([])
  const [selectionOrder, setSelectionOrder] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${productId}/optionals`)
      .then((res) => res.json())
      .then((data) => {
        setOptionals(data.optionals || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching optionals:', error)
        setLoading(false)
      })
  }, [productId])

  const handleToggle = (optionalId: string) => {
    const isSelected = selectedOptionals.includes(optionalId)
    const newSelection = isSelected
      ? selectedOptionals.filter((id) => id !== optionalId)
      : [...selectedOptionals, optionalId]

    const newOrder = isSelected
      ? selectionOrder.filter((id) => id !== optionalId)
      : [...selectionOrder, optionalId]

    setSelectedOptionals(newSelection)
    setSelectionOrder(newOrder)
    const summary: SelectedOptionalSummary[] = newSelection
      .map((id) => optionals.find((o) => o.id === id))
      .filter((o): o is ProductOptional => !!o)
      .map((o) => ({
        id: o.id,
        name: o.name,
        description: o.description,
        price: o.price,
        showPrice: o.showPrice,
      }))

    onSelectionChange(newSelection, summary)

    if (onImageOverrideChange) {
      const lastWithImage = [...newOrder]
        .reverse()
        .map((id) => optionals.find((o) => o.id === id))
        .find((opt) => opt?.imageUrl)

      onImageOverrideChange(lastWithImage?.imageUrl ?? null)
    }
  }

  if (loading) {
    return null
  }

  if (optionals.length === 0) {
    return null
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span>🛏️</span>
          Monte sua Cama
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Selecione os opcionais e acessórios desejados para personalizar sua cama hospitalar
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optionals.map((optional) => (
            <div
              key={optional.id}
              className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#67CBDD] transition-colors"
            >
              <Checkbox
                id={optional.id}
                checked={selectedOptionals.includes(optional.id)}
                onCheckedChange={() => handleToggle(optional.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor={optional.id}
                  className="text-base font-semibold text-secondary cursor-pointer flex items-center gap-2"
                >
                  {optional.name}
                  {optional.showPrice && optional.price != null && (
                    <span className="text-[#67CBDD] font-bold">
                      R$ {optional.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                  {optional.showPrice && optional.price == null && (
                    <span className="text-gray-500 text-sm">(Sob consulta)</span>
                  )}
                  {!optional.showPrice && (
                    <span className="text-gray-500 text-sm">(Sob consulta)</span>
                  )}
                </Label>
                {optional.description && (
                  <p className="text-sm text-gray-600 mt-1">{optional.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
