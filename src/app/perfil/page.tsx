"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Pencil, X } from "lucide-react"
import Cabecalho from "@/components/cabecalho"
import { useSession } from "@/hooks/use-session"
import { get, patch } from "@/lib/fetchData"
import { toast, ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useInfiniteQuery } from '@tanstack/react-query'

interface UsuarioData {
  _id: string
  nome: string
  email: string
  ativo: boolean
  convidadoEm?: string
  ativadoEm?: string
  foto?: string
  ultimoAcesso?: string
}

interface UsuarioApiResponse {
  error: boolean
  message: string
  data: UsuarioData
}

interface Notificacao {
  _id: string
  mensagem: string
  data_hora: string
  visualizada: boolean
  usuario: string
}

interface NotificacoesApiResponse {
  error: boolean
  message: string
  data: {
    docs: Notificacao[]
    totalDocs: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
  }
}

export default function HomePage() {
  const { user } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<UsuarioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingNotificacaoId, setLoadingNotificacaoId] = useState<string | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState({
    totalComponentes: 0,
    totalMovimentacoes: 0,
    totalOrcamentos: 0
  })

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return
      
      try {
        setIsLoading(true)
        const response = await get<UsuarioApiResponse>(`/usuarios/${user.id}`)
        setUserData(response.data)
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user?.id])

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return
      
      setIsLoadingStats(true)
      try {
        // Buscar componentes do usuário
        const componentesResponse = await get<any>('/componentes?limite=100')
        const componentesDoUsuario = componentesResponse.data?.docs?.filter(
          (comp: any) => {
            const compUsuarioId = comp.usuario?._id || comp.usuario
            return compUsuarioId === user.id || String(compUsuarioId) === String(user.id)
          }
        ) || []
        const totalComponentes = componentesDoUsuario.length

        // Buscar movimentações do usuário
        const movimentacoesResponse = await get<any>('/movimentacoes?limite=100')
        const movimentacoesDoUsuario = movimentacoesResponse.data?.docs?.filter(
          (mov: any) => {
            const movUsuarioId = mov.usuario?._id || mov.usuario
            return movUsuarioId === user.id || String(movUsuarioId) === String(user.id)
          }
        ) || []
        const totalMovimentacoes = movimentacoesDoUsuario.length

        // Buscar orçamentos do usuário
        const orcamentosResponse = await get<any>('/orcamentos?limite=100')
        const orcamentosDoUsuario = orcamentosResponse.data?.docs?.filter(
          (orc: any) => {
            const orcUsuarioId = orc.usuario?._id || orc.usuario
            return orcUsuarioId === user.id || String(orcUsuarioId) === String(user.id)
          }
        ) || []
        const totalOrcamentos = orcamentosDoUsuario.length

        setStats({
          totalComponentes,
          totalMovimentacoes,
          totalOrcamentos
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [user?.id])

  const {
    data: notificacoesData,
    isLoading: isLoadingNotificacoes,
    fetchNextPage: fetchNextNotificacoes,
    hasNextPage: hasNextNotificacoes,
    isFetchingNextPage: isFetchingNextNotificacoes
  } = useInfiniteQuery<NotificacoesApiResponse>({
    queryKey: ['notificacoes', user?.id],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) || 1
      return await get<NotificacoesApiResponse>(`/notificacoes?limite=10&page=${page}`)
    },
    getNextPageParam: (lastPage) => {
      const data = lastPage.data || lastPage
      return data.hasNextPage ? data.nextPage : undefined
    },
    initialPageParam: 1,
    enabled: !!user?.id,
    staleTime: 30000,
    refetchInterval: 30000,
  })

  const notificacoes = notificacoesData?.pages.flatMap(page => {
    const data = page.data || page
    return data.docs || []
  }) || []

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextNotificacoes && !isFetchingNextNotificacoes) {
          fetchNextNotificacoes()
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
  }, [hasNextNotificacoes, isFetchingNextNotificacoes, fetchNextNotificacoes])

  async function marcarComoVisualizada(notificacaoId: string) {
    setLoadingNotificacaoId(notificacaoId)
    try {
      await patch(`/notificacoes/${notificacaoId}/visualizar`, {})
      toast.success("Notificação marcada como lida!", {
        position: "bottom-right",
        autoClose: 2000,
      })
    } catch (error) {
      console.error("Erro ao marcar notificação como visualizada:", error)
      toast.error("Erro ao marcar notificação como lida", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoadingNotificacaoId(null)
    }
  }

  async function marcarTodasComoVisualizadas() {
    const naoVisualizadas = notificacoes.filter(n => !n.visualizada)
    
    if (naoVisualizadas.length === 0) {
      toast.info("Todas as notificações já foram lidas", {
        position: "bottom-right",
        autoClose: 2000,
      })
      return
    }

    try {
      // Marcar todas as não visualizadas
      await Promise.all(
        naoVisualizadas.map(notif => 
          patch(`/notificacoes/${notif._id}/visualizar`, {})
        )
      )
      
      toast.success(`${naoVisualizadas.length} notificação${naoVisualizadas.length > 1 ? 'ões' : ''} marcada${naoVisualizadas.length > 1 ? 's' : ''} como lida${naoVisualizadas.length > 1 ? 's' : ''}`, {
        position: "bottom-right",
        autoClose: 2000,
      })
    } catch (error) {
      console.error("Erro ao marcar todas como visualizadas:", error)
      toast.error("Erro ao marcar notificações como lidas", {
        position: "bottom-right",
        autoClose: 3000,
      })
    }
  }

  function formatTempoRelativo(data: string) {
    const dataNotificacao = new Date(data)
    const agora = new Date()
    const diferencaMs = agora.getTime() - dataNotificacao.getTime()
    const diferencaMinutos = Math.floor(diferencaMs / 60000)
    const diferencaHoras = Math.floor(diferencaMinutos / 60)
    const diferencaDias = Math.floor(diferencaHoras / 24)

    if (diferencaMinutos < 1) return 'Agora'
    if (diferencaMinutos < 60) return `Há ${diferencaMinutos} minuto${diferencaMinutos > 1 ? 's' : ''}`
    if (diferencaHoras < 24) return `Há ${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''}`
    if (diferencaDias === 1) return 'Ontem'
    if (diferencaDias < 7) return `Há ${diferencaDias} dias`
    if (diferencaDias < 30) return `Há ${Math.floor(diferencaDias / 7)} semana${Math.floor(diferencaDias / 7) > 1 ? 's' : ''}`
    return `Há ${Math.floor(diferencaDias / 30)} mês${Math.floor(diferencaDias / 30) > 1 ? 'es' : ''}`
  }


  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!userData || !user?.id) return

    setIsSaving(true)
    try {
      const response = await patch<UsuarioApiResponse>(`/usuarios/${user.id}`, {
        nome: userData.nome,
      })

      setUserData(response.data)
      setIsEditing(false)

      toast.success("Perfil atualizado com sucesso!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      toast.error(error?.message || "Erro ao atualizar perfil", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
    } finally {
      setIsSaving(false)
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  function formatDateTime(dateString?: string) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    }
    return date.toLocaleDateString("pt-BR")
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Cabecalho pagina="Perfil" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Carregando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Cabecalho pagina="Perfil" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Erro ao carregar dados do usuário</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Cabeçalho */}
      <Cabecalho pagina="Perfil" />

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden flex flex-col p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1 overflow-y-auto">
          {/* Lado esquerdo - Avatar e Info */}
          <aside className="col-span-1 flex">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center w-full">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {userData.foto ? (
                    <Image src={userData.foto} alt="avatar" width={128} height={128} className="object-cover" />
                  ) : (
                    <Image src="/avatar.png" alt="avatar" width={128} height={128} className="object-cover" />
                  )}
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-xl font-semibold">{userData.nome}</h2>
                  <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 flex items-center gap-2 justify-center text-blue-600 hover:underline transition-all cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar perfil</span>
                </button>
            </div>
          </aside>

          {/* Estatísticas de uso */}
          <section className="col-span-1 lg:col-span-2 flex">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col w-full">
              <h3 className="text-lg font-semibold mb-3">Estatísticas de uso</h3>
              <div className="w-full border-t border-gray-200 mb-4"></div>

              {isLoadingStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 content-center">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-6 px-6 bg-gray-50 rounded-lg text-center animate-pulse">
                      <div className="h-10 bg-gray-300 rounded w-20 mx-auto mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 content-center">
                  <div className="py-6 px-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-4xl font-bold text-blue-600">{stats.totalComponentes}</p>
                    <p className="text-sm text-gray-500 mt-3">Componentes cadastrados</p>
                  </div>

                  <div className="py-6 px-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-4xl font-bold text-blue-600">{stats.totalMovimentacoes}</p>
                    <p className="text-sm text-gray-500 mt-3">Movimentações</p>
                  </div>

                  <div className="py-6 px-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-4xl font-bold text-blue-600">{stats.totalOrcamentos}</p>
                    <p className="text-sm text-gray-500 mt-3">Orçamentos</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Notificações - Ocupa toda largura */}
          <div className="col-span-1 lg:col-span-3 flex">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Notificações</h3>
                  {notificacoes.filter(n => !n.visualizada).length > 0 && (
                    <span className="text-base text-blue-600 font-medium">
                      ({notificacoes.filter(n => !n.visualizada).length})
                    </span>
                  )}
                </div>
                {notificacoes.filter(n => !n.visualizada).length > 0 && (
                  <button
                    onClick={marcarTodasComoVisualizadas}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              <div className="w-full border-t border-gray-200 mb-4"></div>

              <div className="max-h-60 overflow-y-auto">
                {isLoadingNotificacoes ? (
                  <div className="divide-y divide-gray-200 w-full">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="px-3 py-3 animate-pulse">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0 mt-1.5"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notificacoes.length > 0 ? (
                  <div className="divide-y divide-gray-200 w-full">
                    {notificacoes.map((notificacao) => {
                      const isLoadingThis = loadingNotificacaoId === notificacao._id
                      return (
                        <div 
                          key={notificacao._id} 
                          className={`px-3 py-3 ${notificacao.visualizada ? 'bg-white' : 'bg-gray-50 cursor-pointer'} ${isLoadingThis ? 'opacity-50 cursor-wait' : ''} transition-colors hover:bg-gray-100`}
                          onClick={() => !notificacao.visualizada && !isLoadingThis && marcarComoVisualizada(notificacao._id)}
                        >
                          <div className="flex items-start gap-2">
                            {!notificacao.visualizada && (
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></div>
                            )}
                            <div className="flex-1">
                              <p className={`text-sm text-gray-700 ${notificacao.visualizada ? '' : 'font-medium'}`}>
                                {isLoadingThis ? 'Marcando como lida...' : notificacao.mensagem}
                                {!isLoadingThis && (
                                  <span className="text-sm text-gray-500 font-normal ml-2">
                                    {formatTempoRelativo(notificacao.data_hora)}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={observerTarget} className="h-2" />
                    {isFetchingNextNotificacoes && (
                      <div className="px-3 py-3 text-center">
                        <p className="text-sm text-gray-500">Carregando mais...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-60">
                    <p className="text-sm text-gray-500">Nenhuma notificação</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* painel de edição */}
      {isEditing && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={() => setIsEditing(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-visible animate-in fade-in-0 zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <div className="relative p-6 pb-0">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="px-6 pb-6 space-y-6">
              <div className="text-center pt-4 px-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Editar Perfil
                </h2>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nome" className="block text-base font-medium text-gray-700">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={userData?.nome || ""}
                    onChange={e => setUserData(prev => prev ? { ...prev, nome: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isSaving}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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
