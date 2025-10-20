"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/ui/sidebar"
import { SidebarContent } from "@/components/ui/sidebar"
import { SidebarGroupLabel } from "@/components/ui/sidebar"
import { SidebarGroup } from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/ui/sidebar"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import SidebarButtonMenu from "./sidebarButton"
import { signOut } from "next-auth/react"
import { useSidebarContext } from "@/contexts/SidebarContext"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"

interface CustomSidebarProps {
  children?: React.ReactNode;
}

interface PathRouter {
  path: string
  collapsed?: boolean
}

interface MobileMenuItemProps {
  icon: string
  iconHover: string
  name: string
  route: string
  isActive?: boolean
  onClick: () => void
}

function MobileMenuItem({ icon, iconHover, name, route, isActive, onClick }: MobileMenuItemProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(route)
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      className={`text-[16px] pl-[20px] h-[50px] w-full cursor-pointer flex gap-[12px] items-center rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-white text-black shadow-md'
          : 'text-[#B4BAC5] hover:bg-[rgba(255,255,255,0.08)]'
      }`}
    >
      <img src={isActive ? iconHover : icon} alt={name} className="w-[22px] h-[22px]" />
      <span className={`text-[16px] font-medium ${isActive ? 'text-black' : 'text-[#B4BAC5]'}`}>
        {name}
      </span>
    </button>
  )
}

export default function CustomSidebar({ path, collapsed = false }: PathRouter) {

  const { isOpen, closeSidebar } = useSidebarContext()
  const { user } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.href = "/login"
  }

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      closeSidebar()
    }
  }

  const handleProfileClick = () => {
    router.push("/perfil")
    handleItemClick()
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Sidebar Desktop - sempre visível */}
      <div
        className={`hidden md:block md:relative transition-all duration-300 ${collapsed ? 'md:w-[100px]' : 'md:w-[280px]'}`}
        data-test="sidebar-container-desktop"
      >
        <SidebarProvider data-test='sidebar-provider' className={`m-0 p-0 h-full transition-all duration-300 ${collapsed ? 'w-[100px]' : 'w-[280px]'}`} >
          <Sidebar data-test="sidebar-main" className={`h-full transition-all duration-300 ${collapsed ? 'w-[100px]' : 'w-[280px]'}`}>
            <SidebarContent className={`bg-[#0f1419] h-auto relative overflow-y-auto transition-all duration-300 flex flex-col ${collapsed ? 'w-[100px]' : 'w-[280px]'}`} data-test="sidebar-content">
            
            {/* Seção de Perfil no Topo */}
            <div className={`mt-8 mb-6 transition-all duration-300 ${collapsed ? 'px-2' : 'px-4'}`}>
              <button
                onClick={handleProfileClick}
                className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300 cursor-pointer ${collapsed ? 'justify-center' : ''}`}
              >
                <img 
                  src={user?.fotoPerfil || "/foto-default.svg"} 
                  alt="Foto de perfil" 
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                
                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-white text-sm font-medium truncate" title={user?.name}>
                      {user?.name}
                    </p>
                    <p className="text-[#B4BAC5] text-xs truncate" title={user?.email}>
                      {user?.email}
                    </p>
                  </div>
                )}
              </button>
              <hr className={`border-[#2d3748] mt-4 transition-all duration-300`} data-test="sidebar-divider" />
            </div>

            <SidebarMenu className="flex-1" data-test="sidebar-menu">
              <SidebarMenuItem className="text-[#B4BAC5] items-center gap-[10px] flex flex-col" data-test="sidebar-menu-item">
                <SidebarButtonMenu
                  src="/componentes.svg"
                  srcHover="/componentes-hover.svg"
                  name="Componentes"
                  route="/componentes"
                  data-test="sidebar-btn-componentes"
                  path={path}
                  onItemClick={handleItemClick}
                  collapsed={collapsed}
                />
                <SidebarButtonMenu
                  src="/relatorios.svg"
                  srcHover="/relatorios-hover.svg"
                  name="Relatórios"
                  route="/relatorios"
                  data-test="sidebar-btn-relatorios"
                  path={path}
                  onItemClick={handleItemClick}
                  collapsed={collapsed}
                />
                <SidebarButtonMenu
                  src="/orcamentos.svg"
                  srcHover="/orcamentos-hover.svg"
                  name="Orçamentos"
                  route="/orcamentos"
                  data-test="sidebar-btn-orcamentos"
                  path={path}
                  onItemClick={handleItemClick}
                  collapsed={collapsed}
                />
                <SidebarButtonMenu
                  src="/fornecedores.svg"
                  srcHover="/fornecedores-hover.svg"
                  name="Fornecedores"
                  route="/fornecedores"
                  data-test="sidebar-btn-fornecedores"
                  path={path}
                  onItemClick={handleItemClick}
                  collapsed={collapsed}
                />
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Botão de Sair ao Final */}
            <div className={`mt-auto mb-6 transition-all duration-300 ${collapsed ? 'px-2' : 'px-4'}`}>
              <hr className={`border-[#2d3748] mb-4 transition-all duration-300`} data-test="sidebar-divider-bottom" />
              
              <SidebarMenuButton
                className={`cursor-pointer relative transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit! ${collapsed ? 'flex justify-center items-center h-[50px] w-full rounded-lg' : 'text-[17px] pl-[20px] h-[50px] w-full flex gap-[12px]'}`}
                onClick={() => {
                  handleLogout()
                  handleItemClick()
                }}
                data-test="sidebar-btn-sair"
                title={collapsed ? "Sair" : undefined}
              >
                <img src="/sair.svg" alt="" className="w-[22px] h-[22px]" />
                {!collapsed && <span className="text-[16px] font-medium text-[#B4BAC5]">Sair</span>}
              </SidebarMenuButton>
            </div>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      </div>

      {/* Sidebar Mobile - Tela Cheia */}
      <div
        className={`md:hidden fixed inset-0 z-[110] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-test="sidebar-container-mobile"
      >
        <div className="bg-[#0f1419] h-full w-full overflow-y-auto flex flex-col">
          {/* Header com botão fechar */}
          <div className="relative p-5 pt-8 flex items-center justify-end">
            <button
              onClick={closeSidebar}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-lg hover:bg-gray-700 transition-all duration-200"
              aria-label="Fechar menu"
            >
              <X className="w-[24px] h-[24px] text-gray-400" strokeWidth={2} />
            </button>
          </div>

          {/* Seção de Perfil no Topo Mobile */}
          <div className="px-5 mb-6">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300 cursor-pointer"
            >
              <img 
                src={user?.fotoPerfil || "/foto-default.svg"} 
                alt="Foto de perfil" 
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white text-sm font-medium truncate" title={user?.name}>
                  {user?.name}
                </p>
                <p className="text-[#B4BAC5] text-xs truncate" title={user?.email}>
                  {user?.email}
                </p>
              </div>
            </button>
            <hr className="mt-4 border-[#2d3748]" />
          </div>

          {/* Conteúdo do menu */}
          <div className="px-5 flex flex-col flex-1">
            <div className="flex flex-col gap-2 flex-1">
              <MobileMenuItem
                icon="/componentes.svg"
                iconHover="/componentes-hover.svg"
                name="Componentes"
                route="/componentes"
                isActive={path?.startsWith("/componentes")}
                onClick={() => {
                  handleItemClick()
                }}
              />
              <MobileMenuItem
                icon="/relatorios.svg"
                iconHover="/relatorios-hover.svg"
                name="Relatórios"
                route="/relatorios"
                isActive={path?.startsWith("/relatorios")}
                onClick={() => {
                  handleItemClick()
                }}
              />
              <MobileMenuItem
                icon="/orcamentos.svg"
                iconHover="/orcamentos-hover.svg"
                name="Orçamentos"
                route="/orcamentos"
                isActive={path?.startsWith("/orcamentos")}
                onClick={() => {
                  handleItemClick()
                }}
              />
              <MobileMenuItem
                icon="/fornecedores.svg"
                iconHover="/fornecedores-hover.svg"
                name="Fornecedores"
                route="/fornecedores"
                isActive={path?.startsWith("/fornecedores")}
                onClick={() => {
                  handleItemClick()
                }}
              />
            </div>
            
            {/* Botão de Sair Mobile */}
            <div className="mt-auto mb-6">
              <hr className="mb-4 border-[#2d3748]" />
              
              <button
                onClick={() => {
                  handleLogout()
                  handleItemClick()
                }}
                className="text-[16px] pl-[20px] h-[50px] w-full cursor-pointer flex gap-[12px] items-center rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
                data-test="sidebar-btn-sair-mobile"
              >
                <img src="/sair.svg" alt="" className="w-[22px] h-[22px]" />
                <span className="text-[16px] font-medium text-[#B4BAC5]">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
