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
}

interface BuildYourBedProps {
  productId: string
  onSelectionChange: (selectedOptionals: string[]) => void
}

export function BuildYourBed({ productId, onSelectionChange }: BuildYourBedProps) {
  const [optionals, setOptionals] = useState<ProductOptional[]>([])
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([])
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
    const newSelection = selectedOptionals.includes(optionalId)
      ? selectedOptionals.filter((id) => id !== optionalId)
      : [...selectedOptionals, optionalId]
    
    setSelectedOptionals(newSelection)
    onSelectionChange(newSelection)
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
                  {optional.showPrice && optional.price && (
                    <span className="text-[#67CBDD] font-bold">
                      R$ {optional.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                  {optional.showPrice && !optional.price && (
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
