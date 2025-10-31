"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { useSidebarContext } from "@/contexts/SidebarContext"
import { Bell, Menu } from "lucide-react"
type NotificationItem = {
  id: string
  title: string
  body?: string
  createdAt?: string
  read?: boolean
}

export interface CabecalhoProps {
  pagina: string,
  descricao?: string
}

export default function Cabecalho({ pagina, descricao }: CabecalhoProps) {
  const router = useRouter()
  const { user } = useSession()
  const { toggleSidebar } = useSidebarContext()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleNotificationsClick = () => {
    // TODO: Implementar funcionalidade de notificações
    setShowNotifications(prev => !prev)
    if (!showNotifications) fetchNotifications()
  }

  const handleProfileClick = () => {
    router.push("/perfil")
  }

  const handleMenuClick = () => {
    toggleSidebar()
  }

  useEffect(() => {
    // fechar dropdown ao clicar fora
    const handleDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("click", handleDocClick)
    return () => document.removeEventListener("click", handleDocClick)
  }, [])

  async function fetchNotifications() {
    if (!user) return
    setLoadingNotifs(true)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${base}/notifications?userId=${user.id}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Erro ao buscar notificações")
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("fetchNotifications:", err)
      setNotifications([])
    } finally {
      setLoadingNotifs(false)
    }
  }

  async function markAsRead(id?: string) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ""
      await fetch(`${base}/notifications/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId: user?.id }),
      })
      // atualizar local
      if (id) setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      else setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error("markAsRead:", err)
    }
  }

  return (
    <div className="flex justify-between w-full px-6 md:px-6 py-[20px] md:py-[40px] pt-[30px] md:pt-[50px]">
      <div className="flex items-center gap-[12px] md:gap-[20px]">
        {/* Botão de menu hambúrguer para mobile */}
        <button
          onClick={handleMenuClick}
          className="md:hidden w-[40px] h-[40px] flex items-center justify-center rounded-md hover:bg-gray-100 transition-all duration-200"
          aria-label="Menu"
        >
          <Menu className="w-[24px] h-[24px] text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-[18px] md:text-[22px] font-bold text-[#1f2937]">{pagina}</h1>
        {descricao && (
          <span className="text-[14px] md:text-[16px] text-[#6b7280] font-medium hidden sm:inline">{descricao}</span>
        )}
      </div>
      
      <div className="flex items-center gap-[8px] md:gap-[12px]">
        {/* Ícone de Notificações */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleNotificationsClick}
            className="relative w-[36px] h-[36px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer"
            aria-label="Notificações"
          >
            <Bell className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-gray-700" strokeWidth={2.3} />
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {/* Dropdown de notificações */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-3 flex items-center justify-between border-b border-gray-100">
                <span className="font-medium">Notificações</span>
                <button className="text-sm text-blue-600" onClick={() => markAsRead(undefined)}>Marcar todas</button>
              </div>
              <div className="max-h-64 overflow-auto">
                {loadingNotifs ? (
                  <div className="p-4 text-center text-sm text-gray-500">Carregando...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">Sem notificações</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-start ${n.read ? "" : "bg-gray-50"}`} onClick={() => { markAsRead(n.id); /* navegar ou abrir detalhe se quiser */ }}>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{n.title}</div>
                        {n.body && <div className="text-xs text-gray-500 mt-1">{n.body}</div>}
                      </div>
                      <div className="text-xs text-gray-400 ml-2">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ícone de Perfil */}
        <button
          onClick={handleProfileClick}
          className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full transition-all duration-200 cursor-pointer overflow-hidden"
          aria-label="Perfil do usuário"
        >
          <img 
            src={user?.image || "/foto-default.svg"} 
            alt="Foto de perfil" 
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  )
}