"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Image as ImageIcon, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cabecalho from "@/components/cabecalho"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authenticatedRequest } from '@/utils/auth'

interface Categoria {
  _id: string
  nome: string
}

export default function AdicionarComponentePage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [estoqueMinimo, setEstoqueMinimo] = useState('0')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [isAddingCategoria, setIsAddingCategoria] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')
  const [isCategoriaDropdownOpen, setIsCategoriaDropdownOpen] = useState(false)
  const [categoriaPesquisa, setCategoriaPesquisa] = useState('')
  const [errors, setErrors] = useState<{ nome?: string; categoria?: string; novaCategoria?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: categoriasData, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => authenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/categorias`,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 10,
  })

  const createCategoriaMutation = useMutation({
    mutationFn: (nomeCategoria: string) =>
      authenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/categorias`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: { nome: nomeCategoria },
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setCategoriaId(data.data._id)
      setNovaCategoria('')
      setIsAddingCategoria(false)
      setErrors(prev => ({ ...prev, novaCategoria: undefined }))
    },
    onError: (error: any) => {
      setErrors(prev => ({ ...prev, novaCategoria: `Erro: ${error.message}` }))
    }
  })

  const createComponenteMutation = useMutation({
    mutationFn: async (data: any) =>
      authenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/componentes`,
        {
          method: 'POST',
          data: data,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['componentes'] })
      router.push('/componentes')
    },
    onError: (error: any) => {
      alert(`Erro ao criar componente: ${error?.response?.data?.message || error.message}`)
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagem(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagem(null)
    setImagemPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { nome?: string; categoria?: string } = {}

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!categoriaId) {
      newErrors.categoria = 'Selecione uma categoria'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const componenteData: any = {
      nome: nome,
      categoria: categoriaId,
      estoque_minimo: estoqueMinimo,
    }

    if (descricao.trim()) {
      componenteData.descricao = descricao
    }

    if (imagem) {
      componenteData.imagem = imagem.name
    }

    createComponenteMutation.mutate(componenteData)
  }

  const handleAddCategoria = () => {
    if (!novaCategoria.trim()) {
      setErrors(prev => ({ ...prev, novaCategoria: 'Nome da categoria é obrigatório' }))
      return
    }
    setErrors(prev => ({ ...prev, novaCategoria: undefined }))
    createCategoriaMutation.mutate(novaCategoria)
  }

  const handleCancel = () => {
    router.push('/componentes')
  }

  const handleCategoriaSelect = (categoria: Categoria) => {
    setCategoriaId(categoria._id)
    setIsCategoriaDropdownOpen(false)
    setCategoriaPesquisa('')
    if (errors.categoria) {
      setErrors(prev => ({ ...prev, categoria: undefined }))
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-categoria-dropdown]')) {
        setIsCategoriaDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const categorias = categoriasData?.data?.docs || []
  const categoriasFiltradas = categorias.filter((cat: Categoria) =>
    cat.nome.toLowerCase().includes(categoriaPesquisa.toLowerCase())
  )
  const categoriaSelecionada = categorias.find((cat: Categoria) => cat._id === categoriaId)

  return (
    <div className="w-full h-screen flex flex-col">
      <Cabecalho pagina="Componentes" acao="Adicionar" />

      <div className="flex-1 p-6 pt-0 flex flex-col overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
              {/* Grid de 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <Label htmlFor="nome" className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Meu Componente"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (errors.nome) {
                        setErrors(prev => ({ ...prev, nome: undefined }))
                      }
                    }}
                    className={`w-full !px-4 !py-3 !h-auto ${errors.nome ? '!border-red-500' : ''}`}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                  )}
                </div>

                {/* Categoria com botão + */}
                <div>
                  <Label className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                    Categoria <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1" data-categoria-dropdown>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCategoriaDropdownOpen(!isCategoriaDropdownOpen)
                            if (errors.categoria) {
                              setErrors(prev => ({ ...prev, categoria: undefined }))
                            }
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer ${errors.categoria ? 'border-red-500' : 'border-gray-300'
                            }`}
                          disabled={isLoadingCategorias}
                        >
                          <span className={categoriaSelecionada ? 'text-gray-900' : 'text-gray-500'}>
                            {isLoadingCategorias
                              ? 'Carregando...'
                              : categoriaSelecionada?.nome || 'Selecione uma categoria'
                            }
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoriaDropdownOpen ? 'rotate-180' : ''
                            }`} />
                        </button>

                        {/* Dropdown */}
                        {isCategoriaDropdownOpen && !isLoadingCategorias && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
                            {/* Input de pesquisa */}
                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                              <input
                                type="text"
                                placeholder="Pesquisar categoria..."
                                value={categoriaPesquisa}
                                onChange={(e) => setCategoriaPesquisa(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {/* Lista de categorias */}
                            <div className="overflow-y-auto">
                              {categoriasFiltradas.length > 0 ? (
                                categoriasFiltradas.map((categoria: Categoria) => (
                                  <button
                                    key={categoria._id}
                                    type="button"
                                    onClick={() => handleCategoriaSelect(categoria)}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer ${categoriaId === categoria._id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                                      }`}
                                  >
                                    {categoria.nome}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                  Nenhuma categoria encontrada
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={() => setIsAddingCategoria(true)}
                        className="text-white !h-[46px] !w-[46px] !p-0 flex items-center justify-center cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: '#306FCC' }}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    {errors.categoria && (
                      <p className="text-red-500 text-sm">{errors.categoria}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid de 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estoque mínimo */}
                <div>
                  <Label htmlFor="estoqueMinimo" className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                    Estoque mínimo
                  </Label>
                  <Input
                    id="estoqueMinimo"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={estoqueMinimo}
                    onChange={(e) => setEstoqueMinimo(e.target.value)}
                    className="w-full !px-4 !py-3 !h-auto"
                  />
                </div>

                {/* Imagem */}
                <div>
                  <Label className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                    Imagem
                  </Label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-md h-[46px] flex items-center px-4">
                    {imagemPreview ? (
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <img
                            src={imagemPreview}
                            alt="Preview"
                            className="h-8 w-8 object-cover rounded"
                          />
                          <span className="text-sm text-gray-700 truncate">Imagem selecionada</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                          aria-label="Remover imagem"
                        >
                          <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                          <span>Arrastar uma imagem ou</span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-white !h-7 !py-0 text-xs cursor-pointer hover:opacity-90"
                          style={{ backgroundColor: '#306FCC' }}
                        >
                          Selecionar arquivo
                        </Button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Descrição - largura total */}
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="descricao" className="text-sm md:text-base font-medium text-gray-900">
                    Descrição
                  </Label>
                  <span className="text-xs text-gray-500">
                    {descricao.length}/200
                  </span>
                </div>
                <textarea
                  id="descricao"
                  placeholder="Componente para projeto..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  maxLength={200}
                  className="w-full flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Footer com botões */}
            <div className="flex justify-end gap-3 px-8 py-4 border-t bg-gray-50 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="min-w-[120px] cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="min-w-[120px] text-white cursor-pointer hover:opacity-90"
                style={{ backgroundColor: '#306FCC' }}
                disabled={createComponenteMutation.isPending}
              >
                {createComponenteMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para adicionar categoria */}
      {isAddingCategoria && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4"
          style={{
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddingCategoria(false)
              setNovaCategoria('')
              setErrors(prev => ({ ...prev, novaCategoria: undefined }))
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-visible animate-in fade-in-0 zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <div className="relative p-6 pb-0">
              <button
                onClick={() => {
                  setIsAddingCategoria(false)
                  setNovaCategoria('')
                  setErrors(prev => ({ ...prev, novaCategoria: undefined }))
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="px-6 pb-6 space-y-6">
              <div className="text-center pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Nova Categoria
                </h2>
              </div>

              {/* Campo Nome da Categoria */}
              <div className="space-y-2">
                <label htmlFor="novaCategoria" className="block text-base font-medium text-gray-700">
                  Nome da Categoria
                </label>
                <input
                  id="novaCategoria"
                  type="text"
                  placeholder="Digite o nome da categoria"
                  value={novaCategoria}
                  onChange={(e) => {
                    setNovaCategoria(e.target.value)
                    if (errors.novaCategoria) {
                      setErrors(prev => ({ ...prev, novaCategoria: undefined }))
                    }
                  }}
                  className={`w-full px-4 py-3 bg-white border rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.novaCategoria ? 'border-red-500' : 'border-gray-300'
                    }`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCategoria()
                    }
                  }}
                />
                {errors.novaCategoria && (
                  <p className="text-red-500 text-sm">{errors.novaCategoria}</p>
                )}
              </div>
            </div>

            {/* Footer com ações */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingCategoria(false)
                    setNovaCategoria('')
                    setErrors(prev => ({ ...prev, novaCategoria: undefined }))
                  }}
                  disabled={createCategoriaMutation.isPending}
                  className="flex-1 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleAddCategoria}
                  disabled={createCategoriaMutation.isPending}
                  className="flex-1 text-white hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#306FCC' }}
                >
                  {createCategoriaMutation.isPending ? 'Criando...' : 'Criar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
