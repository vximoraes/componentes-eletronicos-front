"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Cabecalho from "@/components/cabecalho"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { get, post } from '@/lib/fetchData'
import { Plus, Minus, Trash2, ChevronDown } from 'lucide-react'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ComponenteOrcamento } from '@/types/orcamentos'
import { ApiResponse } from '@/types/componentes'
import { FornecedorApiResponse } from '@/types/fornecedores'
import { PulseLoader } from 'react-spinners'

export default function AdicionarOrcamentoPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [componentes, setComponentes] = useState<ComponenteOrcamento[]>([])
  const [errors, setErrors] = useState<{ nome?: string }>({})

  const [isComponenteDropdownOpen, setIsComponenteDropdownOpen] = useState<number | null>(null)
  const [componentePesquisa, setComponentePesquisa] = useState('')
  const [isFornecedorDropdownOpen, setIsFornecedorDropdownOpen] = useState<number | null>(null)
  const [fornecedorPesquisa, setFornecedorPesquisa] = useState('')

  const observerTargetComponente = useRef<HTMLDivElement>(null)
  const observerTargetFornecedor = useRef<HTMLDivElement>(null)

  const {
    data: componentesData,
    isLoading: isLoadingComponentes,
    fetchNextPage: fetchNextPageComponentes,
    hasNextPage: hasNextPageComponentes,
    isFetchingNextPage: isFetchingNextPageComponentes
  } = useInfiniteQuery({
    queryKey: ['componentes-infinite', componentePesquisa],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (componentePesquisa) params.append('nome', componentePesquisa);
      params.append('limit', '20');
      params.append('page', pageParam.toString());

      return await get<ApiResponse>(`/componentes?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNextPage ? lastPage.data.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    enabled: isComponenteDropdownOpen !== null,
  })

  const {
    data: fornecedoresData,
    isLoading: isLoadingFornecedores,
    fetchNextPage: fetchNextPageFornecedores,
    hasNextPage: hasNextPageFornecedores,
    isFetchingNextPage: isFetchingNextPageFornecedores
  } = useInfiniteQuery({
    queryKey: ['fornecedores-infinite', fornecedorPesquisa],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (fornecedorPesquisa) params.append('nome', fornecedorPesquisa);
      params.append('limit', '20');
      params.append('page', pageParam.toString());

      return await get<FornecedorApiResponse>(`/fornecedores?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNextPage ? lastPage.data.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    enabled: isFornecedorDropdownOpen !== null,
  })

  useEffect(() => {
    if (!observerTargetComponente.current || isComponenteDropdownOpen === null) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPageComponentes && !isFetchingNextPageComponentes) {
          fetchNextPageComponentes();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerTargetComponente.current);
    return () => observer.disconnect();
  }, [isComponenteDropdownOpen, hasNextPageComponentes, isFetchingNextPageComponentes, fetchNextPageComponentes]);

  useEffect(() => {
    if (!observerTargetFornecedor.current || isFornecedorDropdownOpen === null) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPageFornecedores && !isFetchingNextPageFornecedores) {
          fetchNextPageFornecedores();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerTargetFornecedor.current);
    return () => observer.disconnect();
  }, [isFornecedorDropdownOpen, hasNextPageFornecedores, isFetchingNextPageFornecedores, fetchNextPageFornecedores]);

  const createOrcamentoMutation = useMutation({
    mutationFn: async (data: any) => {
      return await post('/orcamentos', data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['orcamentos'] })
      toast.success('Orçamento criado com sucesso!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
      router.push(`/orcamentos?success=created&id=${data.data._id}`)
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message || 'Erro ao criar orçamento'
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      setErrors({ nome: 'Nome é obrigatório' })
      return
    }

    if (componentes.length === 0) {
      toast.error('Adicione pelo menos um componente ao orçamento.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
      return
    }

    const componentesInvalidos = componentes.filter(c => !c.componente || !c.fornecedor)
    if (componentesInvalidos.length > 0) {
      toast.error('Preencha todos os campos dos componentes (Nome e Fornecedor).', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
      return
    }

    const orcamentoData = {
      nome,
      descricao: descricao || undefined,
      componentes: componentes.map(c => ({
        componente: c.componente,
        fornecedor: c.fornecedor,
        quantidade: c.quantidade,
        valor_unitario: c.valor_unitario
      }))
    }
    createOrcamentoMutation.mutate(orcamentoData)
  }

  const handleAdicionarComponente = () => {
    const novoComponente: ComponenteOrcamento = {
      componente: '',
      nome: '',
      fornecedor: '',
      quantidade: 1,
      valor_unitario: 0,
      subtotal: 0
    }
    setComponentes([...componentes, novoComponente])
  }

  const handleRemoverComponente = (index: number) => {
    const novosComponentes = componentes.filter((_, i) => i !== index)
    setComponentes(novosComponentes)
  }

  const handleComponenteSelect = (index: number, componenteId: string, componenteNome: string) => {
    const novosComponentes = [...componentes]
    novosComponentes[index].componente = componenteId
    novosComponentes[index].nome = componenteNome
    setComponentes(novosComponentes)
    setIsComponenteDropdownOpen(null)
    setComponentePesquisa('')
  }

  const handleFornecedorSelect = (index: number, fornecedorId: string, fornecedorNome: string) => {
    const novosComponentes = [...componentes]
    novosComponentes[index].fornecedor = fornecedorId
    novosComponentes[index].fornecedor_nome = fornecedorNome
    setComponentes(novosComponentes)
    setIsFornecedorDropdownOpen(null)
    setFornecedorPesquisa('')
  }

  const handleQuantidadeChange = (index: number, delta: number) => {
    const novosComponentes = [...componentes]
    const novaQuantidade = Math.max(1, novosComponentes[index].quantidade + delta)
    novosComponentes[index].quantidade = novaQuantidade
    novosComponentes[index].subtotal = novaQuantidade * novosComponentes[index].valor_unitario
    setComponentes(novosComponentes)
  }

  const handleValorUnitarioChange = (index: number, valor: string) => {
    const novosComponentes = [...componentes]
    const valorNumerico = parseFloat(valor) || 0
    novosComponentes[index].valor_unitario = valorNumerico
    novosComponentes[index].subtotal = novosComponentes[index].quantidade * valorNumerico
    setComponentes(novosComponentes)
  }

  const calcularTotal = () => {
    return componentes.reduce((total, comp) => total + comp.subtotal, 0)
  }

  const handleCancel = () => {
    router.push('/orcamentos')
  }

  const componentesLista = componentesData?.pages ? componentesData.pages.flatMap(page => page.data.docs) : []
  const fornecedoresLista = fornecedoresData?.pages ? fornecedoresData.pages.flatMap(page => page.data.docs) : []

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setIsComponenteDropdownOpen(null)
        setIsFornecedorDropdownOpen(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Cabecalho pagina="Orçamentos" acao="Adicionar" />

      <div className="flex-1 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6 flex flex-col overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-3 sm:p-4 md:p-8 flex flex-col gap-3 sm:gap-4 md:gap-6 overflow-hidden">
              {/* Nome */}
              <div className="flex-shrink-0">
                <Label htmlFor="nome" className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Projeto - Horta Automatizada"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (errors.nome) {
                      setErrors(prev => ({ ...prev, nome: undefined }))
                    }
                  }}
                  className={`w-full !px-3 sm:!px-4 !h-auto !min-h-[38px] sm:!min-h-[46px] text-sm sm:text-base ${errors.nome ? '!border-red-500' : ''}`}
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nome}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="flex-shrink-0">
                <Label htmlFor="descricao" className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                  Descrição
                </Label>
                <textarea
                  id="descricao"
                  placeholder="Desenvolvimento de uma horta automatizada por arduino."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[100px]"
                  maxLength={500}
                />
              </div>

              {/* Itens do orçamento */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                  <Label className="text-sm md:text-base font-medium text-gray-900">Itens do orçamento</Label>
                  <Button
                    type="button"
                    onClick={handleAdicionarComponente}
                    className="flex items-center gap-2 text-white hover:bg-green-500 cursor-pointer bg-green-600 text-sm sm:text-base px-3 sm:px-4"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Adicionar componente</span>
                    <span className="sm:hidden">Adicionar</span>
                  </Button>
                </div>

                {/* Tabela */}
                <div className="border rounded-t-lg overflow-auto bg-white flex-1 flex flex-col">
                  {componentes.length === 0 ? (
                    <>
                      <table className="w-full caption-bottom text-xs sm:text-sm">
                        <thead className="bg-gray-50 z-10 shadow-sm">
                          <tr className="bg-gray-50 border-b">
                            <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">NOME</th>
                            <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">FORNECEDOR</th>
                            <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">QUANTIDADE</th>
                            <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">VALOR UNITÁRIO</th>
                            <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">SUBTOTAL</th>
                            <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">AÇÕES</th>
                          </tr>
                        </thead>
                      </table>
                      <div className="flex-1 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                        Nenhum componente adicionado.
                      </div>
                    </>
                  ) : (
                    <table className="w-full caption-bottom text-xs sm:text-sm">
                      <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                        <tr className="bg-gray-50 border-b">
                          <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">NOME</th>
                          <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">FORNECEDOR</th>
                          <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">QUANTIDADE</th>
                          <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">VALOR UNITÁRIO</th>
                          <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">SUBTOTAL</th>
                          <th className="font-semibold text-gray-700 bg-gray-50 text-center px-4 py-3">AÇÕES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {componentes.map((comp, index) => (
                          <tr key={index} className="hover:bg-gray-50 border-b">
                            {/* Nome */}
                            <td className="px-4 py-3">
                              <div className="relative" data-dropdown>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsComponenteDropdownOpen(isComponenteDropdownOpen === index ? null : index)
                                    setComponentePesquisa('')
                                  }}
                                  className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                                >
                                  <span className={comp.nome ? 'text-gray-900' : 'text-gray-500'}>
                                    {comp.nome || 'Selecione'}
                                  </span>
                                  <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                                </button>

                                {isComponenteDropdownOpen === index && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
                                    <div className="p-2 border-b">
                                      <input
                                        type="text"
                                        placeholder="Pesquisar..."
                                        value={componentePesquisa}
                                        onChange={(e) => setComponentePesquisa(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    <div className="overflow-y-auto">
                                      {isLoadingComponentes ? (
                                        <div className="flex justify-center py-4">
                                          <PulseLoader color="#306FCC" size={8} />
                                        </div>
                                      ) : componentesLista.length > 0 ? (
                                        <>
                                          {componentesLista.map((componente) => (
                                            <button
                                              key={componente._id}
                                              type="button"
                                              onClick={() => handleComponenteSelect(index, componente._id, componente.nome)}
                                              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm cursor-pointer"
                                            >
                                              {componente.nome}
                                            </button>
                                          ))}
                                          <div ref={observerTargetComponente} className="h-1" />
                                          {isFetchingNextPageComponentes && (
                                            <div className="flex justify-center py-2">
                                              <PulseLoader color="#306FCC" size={6} />
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                          Nenhum componente encontrado
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Fornecedor */}
                            <td className="px-4 py-3">
                              <div className="relative" data-dropdown>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsFornecedorDropdownOpen(isFornecedorDropdownOpen === index ? null : index)
                                    setFornecedorPesquisa('')
                                  }}
                                  className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                                  disabled={!comp.componente}
                                >
                                  <span className={comp.fornecedor_nome ? 'text-gray-900' : 'text-gray-500'}>
                                    {comp.fornecedor_nome || 'Selecione'}
                                  </span>
                                  <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                                </button>

                                {isFornecedorDropdownOpen === index && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
                                    <div className="p-2 border-b">
                                      <input
                                        type="text"
                                        placeholder="Pesquisar..."
                                        value={fornecedorPesquisa}
                                        onChange={(e) => setFornecedorPesquisa(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    <div className="overflow-y-auto">
                                      {isLoadingFornecedores ? (
                                        <div className="flex justify-center py-4">
                                          <PulseLoader color="#306FCC" size={8} />
                                        </div>
                                      ) : fornecedoresLista.length > 0 ? (
                                        <>
                                          {fornecedoresLista.map((fornecedor) => (
                                            <button
                                              key={fornecedor._id}
                                              type="button"
                                              onClick={() => handleFornecedorSelect(index, fornecedor._id, fornecedor.nome)}
                                              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm cursor-pointer"
                                            >
                                              {fornecedor.nome}
                                            </button>
                                          ))}
                                          <div ref={observerTargetFornecedor} className="h-1" />
                                          {isFetchingNextPageFornecedores && (
                                            <div className="flex justify-center py-2">
                                              <PulseLoader color="#306FCC" size={6} />
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                          Nenhum fornecedor encontrado
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Quantidade */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantidadeChange(index, -1)}
                                  className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                  disabled={comp.quantidade <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <input
                                  type="number"
                                  value={comp.quantidade}
                                  onChange={(e) => {
                                    const novosComponentes = [...componentes]
                                    novosComponentes[index].quantidade = Math.max(1, parseInt(e.target.value) || 1)
                                    novosComponentes[index].subtotal = novosComponentes[index].quantidade * novosComponentes[index].valor_unitario
                                    setComponentes(novosComponentes)
                                  }}
                                  className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md"
                                  min="1"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantidadeChange(index, 1)}
                                  className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </td>

                            {/* Valor Unitário */}
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={comp.valor_unitario}
                                onChange={(e) => handleValorUnitarioChange(index, e.target.value)}
                                className="w-full px-3 py-2 text-center border border-gray-300 rounded-md"
                                placeholder="R$0,00"
                                step="0.01"
                                min="0"
                              />
                            </td>

                            {/* Subtotal */}
                            <td className="px-4 py-3 text-center text-gray-900 font-medium">
                              R${comp.subtotal.toFixed(2)}
                            </td>

                            {/* Ações */}
                            <td className="px-4 py-3">
                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoverComponente(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  title="Remover componente"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Total */}
                <div className="border-x border-b rounded-b-lg bg-gray-50 px-4 py-3 flex-shrink-0">
                  <div className="text-center font-semibold text-gray-700 text-sm sm:text-base">
                    Total: R${calcularTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com botões */}
            <div className="flex justify-end gap-2 sm:gap-3 px-4 md:px-8 py-3 sm:py-4 border-t bg-gray-50 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="min-w-[80px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base px-3 sm:px-4"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="min-w-[80px] sm:min-w-[120px] text-white cursor-pointer hover:opacity-90 text-sm sm:text-base px-3 sm:px-4"
                style={{ backgroundColor: '#306FCC' }}
                disabled={createOrcamentoMutation.isPending}
              >
                {createOrcamentoMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable={false}
        transition={Slide}
      />
    </div>
  )
}
