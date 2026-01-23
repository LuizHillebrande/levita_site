'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X, Edit, Trash2 } from 'lucide-react'

interface ProductOptional {
  id: string
  name: string
  description: string | null
  price: number | null
  showPrice: boolean
  active: boolean
  order: number
}

interface OptionalsSectionProps {
  productId: string
}

export function OptionalsSection({ productId }: OptionalsSectionProps) {
  const [optionals, setOptionals] = useState<ProductOptional[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    showPrice: false,
    active: true,
    order: 0,
  })

  useEffect(() => {
    fetchOptionals()
  }, [productId])

  const fetchOptionals = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/optionals`)
      const data = await res.json()
      setOptionals(data.optionals || [])
    } catch (error) {
      console.error('Error fetching optionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        order: parseInt(formData.order.toString()) || 0,
      }

      if (editingId) {
        // Atualizar
        await fetch(`/api/products/optionals/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        // Criar
        await fetch(`/api/products/${productId}/optionals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      resetForm()
      fetchOptionals()
    } catch (error) {
      alert('Erro ao salvar opcional')
    }
  }

  const handleEdit = (optional: ProductOptional) => {
    setEditingId(optional.id)
    setFormData({
      name: optional.name,
      description: optional.description || '',
      price: optional.price ? String(optional.price) : '',
      showPrice: optional.showPrice,
      active: optional.active,
      order: optional.order,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este opcional?')) return

    try {
      await fetch(`/api/products/optionals/${id}`, { method: 'DELETE' })
      fetchOptionals()
    } catch (error) {
      alert('Erro ao excluir opcional')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      showPrice: false,
      active: true,
      order: 0,
    })
  }

  if (loading) {
    return <div className="text-center py-4">Carregando opcionais...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opcionais do Produto</CardTitle>
        <p className="text-sm text-gray-600">
          Adicione opcionais e acessórios que podem ser selecionados pelo cliente ao montar a cama
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="optional-name">Nome do Opcional *</Label>
              <Input
                id="optional-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Grades laterais em alumínio"
              />
            </div>
            <div>
              <Label htmlFor="optional-order">Ordem de Exibição</Label>
              <Input
                id="optional-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="optional-description">Descrição</Label>
            <Textarea
              id="optional-description"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do opcional"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="optional-price">Valor (opcional)</Label>
              <Input
                id="optional-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-center space-x-4 pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showPrice}
                  onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                  className="h-4 w-4 text-[#67CBDD]"
                />
                <span className="text-sm">Mostrar preço ao cliente</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-[#67CBDD]"
                />
                <span className="text-sm">Ativo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-[#67CBDD] hover:bg-[#4FA8B8] text-white">
              {editingId ? 'Atualizar' : 'Adicionar'} Opcional
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </form>

        {/* Lista de opcionais */}
        {optionals.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold">Opcionais cadastrados:</h3>
            {optionals.map((optional) => (
              <div
                key={optional.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{optional.name}</span>
                    {optional.showPrice && optional.price && (
                      <span className="text-[#67CBDD] font-bold">
                        R$ {optional.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                    {!optional.showPrice && (
                      <span className="text-gray-500 text-sm">(Sob consulta)</span>
                    )}
                    {!optional.active && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inativo</span>
                    )}
                  </div>
                  {optional.description && (
                    <p className="text-sm text-gray-600 mt-1">{optional.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(optional)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(optional.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Nenhum opcional cadastrado. Adicione opcionais acima.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
