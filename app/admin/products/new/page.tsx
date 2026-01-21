'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, X, FileText, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

interface TechnicalSpec {
  label: string
  value: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    featured: false,
    price: '',
  })
  
  // Modo de especificações
  const [fullSpecsMode, setFullSpecsMode] = useState(false)
  
  // Imagens
  const [images, setImages] = useState<Array<{ url: string; alt?: string; order: number }>>([])
  const [uploading, setUploading] = useState(false)
  
  // Especificações simples (padrão)
  const simpleSpecsLabels = [
    'Profundidade em posição normal',
    'Largura',
    'Altura',
    'Profundidade em posição reclinada',
    'Carga máxima de segurança'
  ]
  
  // Especificações completas (lista completa)
  const fullSpecsLabels = [
    'Comprimento Total',
    'Comprimento Total com Extensor (opcional)',
    'Largura com as grades levantadas',
    'Variação de altura',
    'Plataforma do colchão',
    'Grau de dorso máximo',
    'Grau de pernas máximo',
    'Trendelenburg',
    'Trendelenburg reverso',
    'Altura das grades a partir da plataforma do colchão',
    'Altura máxima de colchão indicada',
    'Carga máxima de segurança',
    'Compensação abdominal ao levantar a seção do dorso (duplo eixo pivotante)',
    'Afastamento lateral da grade ao recolher (baixar)',
    'Dimensão dos rodízios',
    'Sistema de freio',
    '5ª Roda',
    'CPR mecânico e eletrônico',
    'Dorso radiotransparente (raio x)',
    'Extensor de leito (Opcional)',
    'Comprimento Total com Extensor (Opcional)',
    'Suporte para oxigênio',
    'Cabeceira e peseira removíveis',
    'Botão posição cardíaca',
    'Para-choques rotativos nos 4 cantos da cama',
    'Soquete para suporte de soro nos 4 cantos da cama',
    'Luz noturna',
    'Indicador de grau de dorso',
    'Indicador de grau de Trendelemburg e Reverso Trendelemburg',
    'Teclados de membranas nas grades',
    'Peseira (opcional)',
    'Controle a Fio (opcional)',
    'Suporte para bolsa de coleta',
    'Leito',
    'Local para restrição de paciente',
    'Autocontorno',
    'Suporte de soro',
    'Teclado na peseira',
    'Alarmes de saída de paciente',
    'Alarme de Paciente sentado',
    'Alarme de pressão de pele',
    'Alarme de risco de queda',
    'Alarme de freios ativados',
    'Alarme dorso 30º',
    'Chamada de enfermagem',
    'Indicador altura mínima',
    'Monitoramento remoto',
    'Colchão espuma simples',
    'Colchão viscoelástico dupla densidade',
    'Alimentação',
    'Backup bateria',
    'Proteção contra água',
    'Normas regulatórias',
    'Balança Digital Integrada'
  ]
  
  // Especificações técnicas (dinâmico baseado no modo)
  const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpec[]>(() => {
    // Inicializa com especificações simples
    return simpleSpecsLabels.map(label => ({ label, value: '' }))
  })
  
  // Documentação (URLs de PDFs/manuais)
  const [documentation, setDocumentation] = useState<string[]>([''])

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
  }, [])

  // Alternar entre modo simples e completo
  const toggleSpecsMode = (isFull: boolean) => {
    setFullSpecsMode(isFull)
    if (isFull) {
      // Modo completo: inicializa com todas as especificações
      setTechnicalSpecs(fullSpecsLabels.map(label => ({ label, value: '' })))
    } else {
      // Modo simples: volta para as 5 especificações padrão
      setTechnicalSpecs(simpleSpecsLabels.map(label => ({ label, value: '' })))
    }
  }

  const addTechnicalSpec = () => {
    if (fullSpecsMode) {
      // No modo completo, adiciona um campo customizado
      setTechnicalSpecs([...technicalSpecs, { label: '', value: '' }])
    }
  }

  const removeTechnicalSpec = (index: number) => {
    if (fullSpecsMode) {
      // No modo completo, pode remover qualquer especificação
      const updated = technicalSpecs.filter((_, i) => i !== index)
      setTechnicalSpecs(updated)
    } else {
      // No modo simples, não permite remover as 5 especificações padrão
      // Mas pode limpar o valor
      const updated = [...technicalSpecs]
      updated[index].value = ''
      setTechnicalSpecs(updated)
    }
  }

  const updateTechnicalSpec = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...technicalSpecs]
    if (fullSpecsMode && field === 'label') {
      // No modo completo, permite editar o label
      updated[index][field] = value
    } else if (field === 'value') {
      // Sempre permite editar o valor
      updated[index][field] = value
    }
    setTechnicalSpecs(updated)
  }

  const addDocumentation = () => {
    setDocumentation([...documentation, ''])
  }

  const removeDocumentation = (index: number) => {
    setDocumentation(documentation.filter((_, i) => i !== index))
  }

  const updateDocumentation = (index: number, value: string) => {
    const updated = [...documentation]
    updated[index] = value
    setDocumentation(updated)
  }

  // Upload de imagens
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP')
      return
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 10MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'products')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao fazer upload')
      }

      const data = await res.json()
      
      // Adicionar imagem à lista
      setImages([...images, {
        url: data.url,
        alt: file.name,
        order: images.length,
      }])
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
      // Limpar input
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    // Reordenar
    const reordered = updated.map((img, i) => ({ ...img, order: i }))
    setImages(reordered)
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === images.length - 1) return

    const updated = [...images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    
    // Reordenar
    const reordered = updated.map((img, i) => ({ ...img, order: i }))
    setImages(reordered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filtrar especificações técnicas - apenas as que têm valor preenchido
      const filteredSpecs = technicalSpecs.filter(spec => {
        // No modo completo, precisa ter label e value
        // No modo simples, só precisa ter value (label já está definido)
        if (fullSpecsMode) {
          return spec.label && spec.value
        } else {
          return spec.value // No modo simples, só precisa ter valor
        }
      })
      const specsObject = filteredSpecs.reduce((acc, spec) => {
        acc[spec.label] = spec.value
        return acc
      }, {} as Record<string, string>)

      // Filtrar documentação vazia
      const filteredDocs = documentation.filter(doc => doc.trim() !== '')

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId && formData.categoryId !== 'none' ? formData.categoryId : null,
          price: formData.price ? parseFloat(formData.price) : null,
          technicalSpecs: Object.keys(specsObject).length > 0 ? specsObject : null,
          documentation: filteredDocs.length > 0 ? filteredDocs : null,
          images: images.map(img => ({
            url: img.url,
            alt: img.alt || formData.name,
            order: img.order,
          })),
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao criar produto')
      }
    } catch (error) {
      alert('Erro ao criar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Novo Produto</h1>
        <p className="text-gray-600">Cadastre um novo produto hospitalar com todas as informações técnicas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Cama Fowler Elétrica LV 198 PE"
              />
            </div>

            <div>
              <Label htmlFor="shortDescription">Descrição Curta</Label>
              <Textarea
                id="shortDescription"
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Breve descrição do produto (aparece nos cards)"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição Completa</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do produto, características principais, benefícios..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryId">Categoria</Label>
                <Select
                  value={formData.categoryId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-[#67CBDD]/10 rounded-lg border border-[#67CBDD]/20">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-[#67CBDD]"
              />
              <Label htmlFor="featured" className="font-semibold cursor-pointer">
                Produto em Destaque
              </Label>
              <span className="text-sm text-gray-600 ml-2">
                (Aparecerá na seção "Produtos em Destaque" da página inicial)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Imagens do Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Imagens do Produto</CardTitle>
            <CardDescription>
              Faça upload das imagens do produto. A primeira imagem será a principal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Área de Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#67CBDD] transition-colors">
              <input
                type="file"
                id="image-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-12 w-12 text-[#67CBDD] animate-spin mb-4" />
                    <p className="text-gray-600">Fazendo upload...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Clique para fazer upload ou arraste uma imagem aqui
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG ou WEBP (máximo 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Preview das Imagens */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group border-2 border-gray-200 rounded-lg overflow-hidden aspect-square"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Overlay com controles */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Badge de ordem */}
                    <div className="absolute top-2 left-2 bg-[#67CBDD] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Nenhuma imagem adicionada ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Especificações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
            <CardDescription>
              {fullSpecsMode 
                ? 'Especificações completas do produto hospitalar' 
                : 'Especificações básicas do produto'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Checkbox para modo completo */}
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border">
              <input
                type="checkbox"
                id="fullSpecsMode"
                checked={fullSpecsMode}
                onChange={(e) => toggleSpecsMode(e.target.checked)}
                className="h-4 w-4 text-[#67CBDD]"
              />
              <Label htmlFor="fullSpecsMode" className="font-semibold cursor-pointer">
                Especificações Completas
              </Label>
              <span className="text-sm text-gray-600 ml-2">
                {fullSpecsMode 
                  ? '(Modo completo ativado - todos os campos são opcionais)' 
                  : '(Modo simples - 5 campos básicos)'}
              </span>
            </div>

            <Separator />

            {/* Lista de especificações com scroll */}
            <div className="relative">
              <div 
                className="space-y-3 max-h-[600px] overflow-y-auto pr-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50 specs-scroll-container"
              >
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <Label>
                      {fullSpecsMode ? 'Especificação' : spec.label}
                      {!fullSpecsMode && <span className="text-gray-500 ml-1">(opcional)</span>}
                    </Label>
                    {fullSpecsMode ? (
                      <Input
                        placeholder="Nome da especificação..."
                        value={spec.label}
                        onChange={(e) => updateTechnicalSpec(index, 'label', e.target.value)}
                      />
                    ) : (
                      <Input
                        value={spec.label}
                        disabled
                        className="bg-gray-50"
                      />
                    )}
                  </div>
                  <div className="md:col-span-6">
                    <Label>Valor (opcional)</Label>
                    <Input
                      placeholder="Digite o valor..."
                      value={spec.value}
                      onChange={(e) => updateTechnicalSpec(index, 'value', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    {fullSpecsMode && (
                      <>
                        {technicalSpecs.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeTechnicalSpec(index)}
                            title="Remover especificação"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {index === technicalSpecs.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addTechnicalSpec}
                            title="Adicionar especificação customizada"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>

            {fullSpecsMode && (
              <p className="text-sm text-gray-500 mt-4">
                💡 Todas as especificações são opcionais. Preencha apenas as que se aplicam ao produto.
                Você pode remover especificações que não são relevantes ou adicionar novas.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Documentação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentação
            </CardTitle>
            <CardDescription>Links para manuais, PDFs, certificações e outros documentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documentation.map((doc, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="URL do documento (PDF, manual, certificação...)"
                  value={doc}
                  onChange={(e) => updateDocumentation(index, e.target.value)}
                  type="url"
                />
                {documentation.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeDocumentation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {index === documentation.length - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addDocumentation}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Adicione URLs de PDFs, manuais técnicos, certificações, fichas técnicas, etc.
            </p>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-[#67CBDD] hover:bg-[#4FA8B8]">
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </div>
      </form>
    </div>
  )
}
