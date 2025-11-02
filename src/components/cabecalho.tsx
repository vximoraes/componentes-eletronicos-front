"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { useSidebarContext } from "@/contexts/SidebarContext"
import { Bell, Menu, ChevronLeft } from "lucide-react"

type NotificationItem = {
  id: string
  title: string
  body?: string
  createdAt?: string
  read?: boolean
}

export interface CabecalhoProps {
  pagina: string
  descricao?: string,
  showBackButton?: boolean,
  onBackClick?: () => void
}

export default function Cabecalho({ pagina, descricao, showBackButton, onBackClick }: CabecalhoProps) {
  const router = useRouter()
  const { user } = useSession()
  const { toggleSidebar } = useSidebarContext()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const dropdownRef = useRef<HTMLDivElement | null>(null)

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
  function markAsRead(id?: string) {
    if (id) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
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
        

        <h1 className="text-[18px] md:text-[22px] font-bold text-[#1f2937]">{pagina}</h1>
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
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-3 flex items-center justify-between border-b border-gray-100">
                <span className="font-medium">Notificações</span>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => markAsRead(undefined)}
                >
                  Marcar todas
                </button>
              </div>

              <div className="max-h-64 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">Sem notificações</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-start ${
                        n.read ? "" : "bg-gray-50"
                      }`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-800">{n.title}</div>
                        {n.body && <div className="text-xs text-gray-500 mt-1">{n.body}</div>}
                      </div>
                      <div className="text-xs text-gray-400 ml-2">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleDateString("pt-BR")
                          : ""}
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
