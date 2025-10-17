"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { Bell } from "lucide-react"

export interface CabecalhoProps {
  pagina: string,
  acao?: string,
  fotoPerfil?: string
}

export default function Cabecalho({ pagina, acao, fotoPerfil }: CabecalhoProps) {
  const router = useRouter()
  const { user } = useSession()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleNotificationsClick = () => {
    // TODO: Implementar funcionalidade de notificações
    setShowNotifications(!showNotifications)
  }

  const handleProfileClick = () => {
    router.push("/perfil")
  }

  return (
    <div className="flex justify-between w-full px-6 py-[40px] pt-[50px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="text-[22px] font-bold text-[#1f2937]">{pagina}</h1>
        {acao && (
          <span className="text-[16px] text-[#6b7280] font-medium">{acao}</span>
        )}
      </div>
      
      <div className="flex items-center gap-[12px]">
        {/* Ícone de Notificações */}
        <button
          onClick={handleNotificationsClick}
          className="relative w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          aria-label="Notificações"
        >
          <Bell className="w-[24px] h-[24px] text-gray-700" strokeWidth={2.3} />
        </button>

        {/* Ícone de Perfil */}
        <button
          onClick={handleProfileClick}
          className="w-[40px] h-[40px] rounded-full transition-all duration-200 cursor-pointer overflow-hidden"
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