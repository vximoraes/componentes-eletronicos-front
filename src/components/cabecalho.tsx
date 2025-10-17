"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { useSidebarContext } from "@/contexts/SidebarContext"
import { Bell, Menu } from "lucide-react"

export interface CabecalhoProps {
  pagina: string,
  acao?: string,
  fotoPerfil?: string
}

export default function Cabecalho({ pagina, acao, fotoPerfil }: CabecalhoProps) {
  const router = useRouter()
  const { user } = useSession()
  const { toggleSidebar } = useSidebarContext()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleNotificationsClick = () => {
    // TODO: Implementar funcionalidade de notificações
    setShowNotifications(!showNotifications)
  }

  const handleProfileClick = () => {
    router.push("/perfil")
  }

  const handleMenuClick = () => {
    toggleSidebar()
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
        {acao && (
          <span className="text-[14px] md:text-[16px] text-[#6b7280] font-medium hidden sm:inline">{acao}</span>
        )}
      </div>
      
      <div className="flex items-center gap-[8px] md:gap-[12px]">
        {/* Ícone de Notificações */}
        <button
          onClick={handleNotificationsClick}
          className="relative w-[36px] h-[36px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          aria-label="Notificações"
        >
          <Bell className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-gray-700" strokeWidth={2.3} />
        </button>

        {/* Ícone de Perfil */}
        <button
          onClick={handleProfileClick}
          className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full transition-all duration-200 cursor-pointer overflow-hidden"
          aria-label="Perfil do usuário"
        >
          <img 
            src={fotoPerfil || "/foto-default.svg"} 
            alt="Foto de perfil" 
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  )
}