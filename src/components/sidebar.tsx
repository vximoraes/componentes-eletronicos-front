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

interface CustomSidebarProps {
  children?: React.ReactNode;
}

interface PathRouter {
  path: string
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

export default function CustomSidebar({ path }: PathRouter) {

  const [testNome, setTesteNome] = useState<string>("")
  const { isOpen, closeSidebar } = useSidebarContext()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.href = "/login"
  }

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      closeSidebar()
    }
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
        className="hidden md:block md:relative md:w-[280px]"
        data-test="sidebar-container-desktop"
      >
        <SidebarProvider data-test='sidebar-provider' className="m-0 p-0 w-[280px] h-full" >
          <Sidebar data-test="sidebar-main" className="h-full w-[280px]">
            <SidebarContent className="bg-[#111827] w-[280px] h-auto relative overflow-y-auto" data-test="sidebar-content">
            <SidebarGroup data-test="sidebar-logo-group" className="">
              <SidebarGroupLabel className="mt-[50px] flex justify-center items-center h-8 rounded-md text-xs font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2" data-test="sidebar-logo-label">
                <img src="/logo-componentes.svg" className="w-[140px]" alt="" data-test="sidebar-logo-image" />
                </SidebarGroupLabel>
            </SidebarGroup>
            <SidebarMenu className="mt-[50px]" data-test="sidebar-menu">
              <SidebarMenuItem className="text-[#B4BAC5] items-center gap-[10px] flex flex-col" data-test="sidebar-menu-item">
                <SidebarButtonMenu
                  src="/componentes.svg"
                  srcHover="/componentes-hover.svg"
                  name="Componentes"
                  route="/componentes"
                  data-test="sidebar-btn-componentes"
                  path={path}
                  onItemClick={handleItemClick}
                />
                <SidebarButtonMenu
                  src="/relatorios.svg"
                  srcHover="/relatorios-hover.svg"
                  name="Relatórios"
                  route="/relatorios"
                  data-test="sidebar-btn-relatorios"
                  path={path}
                  onItemClick={handleItemClick}
                />
                <SidebarButtonMenu
                  src="/orcamentos.svg"
                  srcHover="/orcamentos-hover.svg"
                  name="Orçamentos"
                  route="/orcamentos"
                  data-test="sidebar-btn-orcamentos"
                  path={path}
                  onItemClick={handleItemClick}
                />
                <SidebarButtonMenu
                  src="/fornecedores.svg"
                  srcHover="/fornecedores-hover.svg"
                  name="Fornecedores"
                  route="/fornecedores"
                  path={path}
                  onItemClick={handleItemClick}
                />
                <hr className="w-[250px] border-[#D9D9D9]" data-test="sidebar-divider" />
                <SidebarMenuButton
                  className="text-[17px] pl-[20px] h-[50px] w-[250px] cursor-pointer flex gap-[12px] relative transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit!"
                  onClick={() => {
                    handleLogout()
                    handleItemClick()
                  }}
                  data-test="sidebar-btn-sair"
                >
                  <img src="/sair.svg" alt="" className="w-[22px] h-[22px]" />
                  <span className="text-[16px] font-medium text-[#B4BAC5]">Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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
        <div className="bg-[#111827] h-full w-full overflow-y-auto">
          {/* Header com botão fechar */}
          <div className="relative p-5 pt-12 flex items-center justify-center">
            <button
              onClick={closeSidebar}
              className="absolute top-5 right-5 w-[40px] h-[40px] flex items-center justify-center rounded-lg hover:bg-gray-700 transition-all duration-200"
              aria-label="Fechar menu"
            >
              <X className="w-[24px] h-[24px] text-gray-400" strokeWidth={2} />
            </button>
            <img src="/logo-componentes.svg" className="w-[180px]" alt="Logo" />
          </div>

          {/* Conteúdo do menu */}
          <div className="p-5 pt-8">
            <div className="flex flex-col gap-2">
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
              
              <hr className="my-3 border-gray-700" />
              
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
