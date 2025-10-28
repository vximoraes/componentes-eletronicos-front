"use client"
import Cabecalho from "@/components/cabecalho"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ModalExcluirOrcamento from "@/components/modal-excluir-orcamento"
import ModalDetalhesOrcamento from "@/components/modal-detalhes-orcamento"
import { useInfiniteQuery } from '@tanstack/react-query'
import { get } from '@/lib/fetchData'
import { OrcamentoApiResponse } from '@/types/orcamentos'
import { Search, Plus, Edit, Trash2, Eye, FileDown } from 'lucide-react'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PulseLoader } from 'react-spinners'

function PageOrcamentosContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)
  const [excluirOrcamentoId, setExcluirOrcamentoId] = useState<string | null>(null)
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false)
  const [detalhesOrcamentoId, setDetalhesOrcamentoId] = useState<string | null>(null)
  const [detalhesOrcamentoNome, setDetalhesOrcamentoNome] = useState<string>('')
  const [detalhesOrcamentoDescricao, setDetalhesOrcamentoDescricao] = useState<string | undefined>(undefined)
  const [isRefetchingAfterDelete, setIsRefetchingAfterDelete] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<OrcamentoApiResponse>({
    queryKey: ['orcamentos', searchTerm],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) || 1
      const params = new URLSearchParams()
      if (searchTerm) params.append('nome', searchTerm)
      params.append('limit', '20')
      params.append('page', page.toString())

      const queryString = params.toString()
      const url = `/orcamentos${queryString ? `?${queryString}` : ''}`

      return await get<OrcamentoApiResponse>(url)
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNextPage ? lastPage.data.nextPage : undefined
    },
    initialPageParam: 1,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Falha na autenticação')) {
        return false
      }
      return failureCount < 3
    },
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const success = searchParams.get('success')

    if (success === 'created') {
      toast.success('Orçamento criado com sucesso!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
      refetch()
      router.replace('/orcamentos')
    } else if (success === 'updated') {
      toast.success('Orçamento atualizado com sucesso!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
      refetch()
      router.replace('/orcamentos')
    }
  }, [searchParams, router, refetch])

  const handleAdicionarClick = () => {
    router.push('/orcamentos/adicionar')
  }

  const handleEdit = (id: string) => {
    router.push(`/orcamentos/editar/${id}`)
  }

  const handleDelete = (id: string) => {
    setExcluirOrcamentoId(id)
    setIsExcluirModalOpen(true)
  }

  const handleExcluirSuccess = async () => {
    setIsRefetchingAfterDelete(true)

    toast.success('Orçamento excluído com sucesso!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
    })

    router.refresh()
    await refetch()
    setIsRefetchingAfterDelete(false)
  }

  const handleViewDetails = (id: string) => {
    const orcamento = orcamentos.find(o => o._id === id)
    setDetalhesOrcamentoId(id)
    setDetalhesOrcamentoNome(orcamento?.nome || '')
    setDetalhesOrcamentoDescricao(orcamento?.descricao)
    setIsDetalhesModalOpen(true)
  }

  const handleExportarPDF = (id: string) => {
    toast.info('Funcionalidade de exportação em desenvolvimento', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
    })
  }

  const orcamentos = data?.pages.flatMap((page) => page.data.docs) || []

  return (
    <div className="w-full h-screen flex flex-col">
      <Cabecalho pagina="Orçamentos" />

      <div className="flex-1 overflow-hidden flex flex-col p-6 pt-0">
        {/* Barra de Pesquisa e Botão Adicionar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Pesquisar orçamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            className="flex items-center gap-2 text-white hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#306FCC' }}
            onClick={handleAdicionarClick}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex-shrink-0">
            Erro ao carregar orçamentos: {error.message}
          </div>
        )}

        {/* Área da Tabela */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {isLoading || isRefetchingAfterDelete || (isFetching && !isLoading) ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Carregando orçamentos...</p>
            </div>
          ) : orcamentos.length > 0 ? (
            <div className="border rounded-lg bg-white flex-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto overflow-y-auto flex-1 relative">
                <table className="w-full caption-bottom text-xs sm:text-sm md:table-fixed">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                    <TableRow className="bg-gray-50 border-b">
                      <TableHead className="font-semibold text-gray-700 bg-gray-50 text-center w-1/2 lg:w-1/4">NOME</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold text-gray-700 bg-gray-50 text-center lg:w-1/4">DESCRIÇÃO</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold text-gray-700 bg-gray-50 text-center lg:w-1/4">TOTAL</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50 text-center w-1/2 lg:w-1/4">AÇÕES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orcamentos.map((orcamento) => (
                      <TableRow key={orcamento._id} className="hover:bg-gray-50 border-b relative">
                        <TableCell className="font-medium text-left px-2 sm:px-4">
                          <div className="truncate max-w-[150px] lg:max-w-none" title={orcamento.nome}>
                            {orcamento.nome}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-left px-4">
                          <div className="truncate" title={orcamento.descricao}>
                            {orcamento.descricao || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-4">
                          <div className="text-gray-900 flex justify-center">
                            <span className="truncate text-center min-w-[100px] max-w-[150px]" title={`R$ ${orcamento.total.toFixed(2)}`}>
                              R$ {orcamento.total.toFixed(2)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleViewDetails(orcamento._id)}
                              className="p-1 sm:p-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 cursor-pointer"
                              title="Ver detalhes do orçamento"
                            >
                              <Eye size={16} className="sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(orcamento._id)}
                              className="p-1 sm:p-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 cursor-pointer"
                              title="Editar orçamento"
                            >
                              <Edit size={16} className="sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => handleExportarPDF(orcamento._id)}
                              className="p-1 sm:p-2 text-gray-900 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 cursor-pointer"
                              title="Exportar PDF"
                            >
                              <FileDown size={16} className="sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(orcamento._id)}
                              className="p-1 sm:p-2 text-gray-900 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer"
                              title="Excluir orçamento"
                            >
                              <Trash2 size={16} className="sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </table>

                <div ref={observerTarget} className="h-10 flex items-center justify-center">
                  {isFetchingNextPage && (
                    <PulseLoader color="#3b82f6" size={5} speedMultiplier={0.8} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center flex-1 flex items-center justify-center bg-white rounded-lg border">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'Nenhum orçamento encontrado para sua pesquisa.' : 'Não há orçamentos cadastrados...'}
                </p>
              </div>
            </div>
          )}
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

      {/* Modal Excluir Orçamento */}
      {excluirOrcamentoId && (
        <ModalExcluirOrcamento
          isOpen={isExcluirModalOpen}
          onClose={() => {
            setIsExcluirModalOpen(false)
            setExcluirOrcamentoId(null)
          }}
          onSuccess={handleExcluirSuccess}
          orcamentoId={excluirOrcamentoId}
          orcamentoNome={orcamentos.find(o => o._id === excluirOrcamentoId)?.nome || ''}
        />
      )}

      {/* Modal Detalhes Orçamento */}
      {detalhesOrcamentoId && (
        <ModalDetalhesOrcamento
          isOpen={isDetalhesModalOpen}
          onClose={() => {
            setIsDetalhesModalOpen(false)
            setDetalhesOrcamentoId(null)
            setDetalhesOrcamentoNome('')
            setDetalhesOrcamentoDescricao(undefined)
          }}
          orcamentoId={detalhesOrcamentoId}
          orcamentoNome={detalhesOrcamentoNome}
          orcamentoDescricao={detalhesOrcamentoDescricao}
        />
      )}
    </div>
  )
}

export default function PageOrcamentos() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Carregando...</p>
      </div>
    }>
      <PageOrcamentosContent />
    </Suspense>
  )
}
