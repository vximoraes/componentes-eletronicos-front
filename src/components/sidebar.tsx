"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/ui/sidebar"
import { SidebarContent } from "@/components/ui/sidebar"
import { SidebarGroupLabel } from "@/components/ui/sidebar"
import { SidebarGroup } from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/ui/sidebar"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState } from "react"
import SidebarButtonMenu from "./sidebarButton"
import { signOut } from "next-auth/react"

interface CustomSidebarProps {
  children?: React.ReactNode;
}

interface PathRouter {
  path: string
}

export default function CustomSidebar({ path }: PathRouter) {

  const [testNome, setTesteNome] = useState<string>("")

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.href = "/login"
  }

  return (

    <div data-test="sidebar-container">
      <SidebarProvider data-test='sidebar-provider' className="m-0 p-0 w-[350px]" >
        <Sidebar data-test="sidebar-main">
          <SidebarContent className="bg-[#111827] w-[350px]" data-test="sidebar-content">
            <SidebarGroup data-test="sidebar-logo-group" className="">
              <SidebarGroupLabel className="mt-[70px] flex justify-center items-center h-8 rounded-md text-xs font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2" data-test="sidebar-logo-label">
                <img src="/logo-componentes.svg" className="" alt="" data-test="sidebar-logo-image" />
              </SidebarGroupLabel>
            </SidebarGroup>
            <SidebarMenu className="mt-[70px]" data-test="sidebar-menu">
              <SidebarMenuItem className="text-[#B4BAC5] items-center gap-[10px] flex flex-col" data-test="sidebar-menu-item">
                <SidebarButtonMenu
                  src="/componentes.svg"
                  srcHover="/componentes-hover.svg"
                  name="Componentes"
                  route="/componentes"
                  data-test="sidebar-btn-componentes"
                  path={path}
                />
                <SidebarButtonMenu
                  src="/relatorios.svg"
                  srcHover="/relatorios-hover.svg"
                  name="Relatórios"
                  route="/relatorios"
                  data-test="sidebar-btn-relatorios"
                  path={path}
                />
                <SidebarButtonMenu
                  src="/orcamentos.svg"
                  srcHover="/orcamentos-hover.svg"
                  name="Orçamentos"
                  route="/orcamentos"
                  data-test="sidebar-btn-orcamentos"
                  path={path}
                />
                <SidebarButtonMenu
                  src="/fornecedores.svg"
                  srcHover="/fornecedores-hover.svg"
                  name="Fornecedores"
                  route="/fornecedores"
                  path={path}
                />
                <hr className="w-[310px] border-[#D9D9D9]" data-test="sidebar-divider" />
                <SidebarMenuButton
                  className="text-[21px] pl-[25px] h-[60px] w-[310px] cursor-pointer flex gap-[15px] relative transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit!"
                  onClick={handleLogout}
                  data-test="sidebar-btn-sair"
                >
                  <img src="/sair.svg" alt="" className="w-[26px] h-[26px]" />
                  <span className="text-[19px] font-medium text-[#B4BAC5]">Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}