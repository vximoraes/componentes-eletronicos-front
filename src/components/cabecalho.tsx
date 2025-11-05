"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { useSidebarContext } from "@/contexts/SidebarContext"
import { Bell, Menu, ChevronLeft } from "lucide-react"
import { get, patch } from "@/lib/fetchData"
import { useQuery, useQueryClient } from '@tanstack/react-query'

type NotificationItem = {
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
    docs: NotificationItem[]
    totalDocs: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
  }
}

export interface CabecalhoProps {
  pagina: string
  acao?: string
  descricao?: string,
  showBackButton?: boolean,
  onBackClick?: () => void
}

export default function Cabecalho({ pagina, acao, descricao, showBackButton, onBackClick }: CabecalhoProps) {
  const router = useRouter()
  const { user } = useSession()
  const { toggleSidebar } = useSidebarContext()
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  const { data: notificacoesData } = useQuery<NotificacoesApiResponse>({
    queryKey: ['notificacoes-header', user?.id],
    queryFn: async () => await get<NotificacoesApiResponse>('/notificacoes?limite=5&page=1'),
    enabled: !!user?.id,
    staleTime: 0,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  })

  const notifications = notificacoesData?.data?.docs || []

  const handleNotificationsClick = () => setShowNotifications(prev => !prev)
  const handleProfileClick = () => router.push("/perfil")
  const handleMenuClick = () => toggleSidebar()

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("click", handleDocClick)
    return () => document.removeEventListener("click", handleDocClick)
  }, [])


  // Marcar notificações como lidas
  async function markAsRead(id?: string) {
    if (id) {
      try {
        await patch(`/notificacoes/${id}/visualizar`, {})
        queryClient.invalidateQueries({ queryKey: ['notificacoes-header', user?.id] })
      } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error)
      }
    } else {
      try {
        const naoVisualizadas = notifications.filter(n => !n.visualizada)
        await Promise.all(
          naoVisualizadas.map(notif => 
            patch(`/notificacoes/${notif._id}/visualizar`, {})
          )
        )
        queryClient.invalidateQueries({ queryKey: ['notificacoes-header', user?.id] })
      } catch (error) {
        console.error("Erro ao marcar todas como lidas:", error)
      }
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
    if (diferencaMinutos < 60) return `Há ${diferencaMinutos} min`
    if (diferencaHoras < 24) return `Há ${diferencaHoras}h`
    if (diferencaDias === 1) return 'Ontem'
    if (diferencaDias < 7) return `Há ${diferencaDias}d`
    return new Date(data).toLocaleDateString("pt-BR")
  }

  return (
    <div className="flex justify-between w-full px-6 md:px-6 py-[20px] md:py-[40px] pt-[30px] md:pt-[50px]">
      <div className="flex items-center gap-[12px] md:gap-[20px]">
        {/*  menu */}
        <button
          onClick={handleMenuClick}
          className="md:hidden w-[40px] h-[40px] flex items-center justify-center rounded-md hover:bg-gray-100 transition-all duration-200"
          aria-label="Menu"
        >
          <Menu className="w-[24px] h-[24px] text-gray-700" strokeWidth={2} />
        </button>
        
        {/* Botão de voltar */}
        {showBackButton && onBackClick && (
          <button
            onClick={onBackClick}
            className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="Voltar"
            title="Voltar"
          >
            <ChevronLeft className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-gray-700" strokeWidth={2} />
          </button>
        )}
        

        <h1 className="text-[18px] md:text-[22px] font-bold text-[#1f2937]">
          {pagina}
          {acao && <span className="text-[#6b7280] font-medium ml-2">• {acao}</span>}
        </h1>
        {descricao && (
          <span className="text-[14px] md:text-[16px] text-[#6b7280] font-medium hidden sm:inline">
            {descricao}
          </span>
        )}
      </div>

      <div className="flex items-center gap-[10px] md:gap-[14px]">
        {/* Notificações */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleNotificationsClick}
            className="relative w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer"
            aria-label="Notificações"
          >
            <Bell className="w-[22px] h-[22px] text-gray-700" strokeWidth={2.3} />
            {notifications.some(n => !n.visualizada) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.visualizada).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-3 flex items-center justify-between border-b border-gray-100">
                <span className="font-medium">Notificações</span>
                <button
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                  onClick={() => markAsRead(undefined)}
                >
                  Marcar todas
                </button>
              </div>

              <div className="max-h-64 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">Sem notificações</div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n._id}
                      className={`p-3 cursor-pointer hover:bg-gray-100 flex justify-between items-start ${
                        n.visualizada ? "bg-white" : "bg-gray-50"
                      }`}
                      onClick={() => !n.visualizada && markAsRead(n._id)}
                    >
                      <div className="flex items-start gap-2 flex-1">
                        {!n.visualizada && (
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-1.5"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm text-gray-800 truncate ${!n.visualizada ? 'font-medium' : ''}`}>{n.mensagem}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-2 shrink-0">
                        {formatTempoRelativo(n.data_hora)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
