

import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/ui/sidebar"
import { SidebarContent } from "@/components/ui/sidebar"
import { SidebarGroupLabel } from "@/components/ui/sidebar"
import { SidebarGroup } from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/ui/sidebar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { useState } from "react"
import SidebarButtonMenu from "./sidebarButton"

export default function CustomSidebar() {
  const [testNome, setTesteNome] = useState<string>("")
  // const componentesSVG = "componentes-svg"
  return (
    <div data-test="sidebar-container">
      <SidebarProvider data-test='sidebar-provider' className="m-0 p-0" >
        <Sidebar data-test="sidebar-main">
          <SidebarContent className="bg-[#111827] w-[350px]" data-test="sidebar-content">
            <SidebarGroup data-test="sidebar-logo-group" className="">
              <SidebarGroupLabel className="mt-[70px] flex justify-center items-center h-8 rounded-md text-xs font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2" data-test="sidebar-logo-label">
                <img src="logo-componentes.svg" className="" alt="" data-test="sidebar-logo-image" />
                </SidebarGroupLabel>
            </SidebarGroup>
            <SidebarMenu className="mt-[70px]" data-test="sidebar-menu">
              <SidebarMenuItem className="text-[#B4BAC5] items-center gap-[25px] flex flex-col" data-test="sidebar-menu-item">
                <SidebarButtonMenu
                  src="componentes.svg"
                  srcHover="componentes-hover.svg"
                  name="Componentes"
                  data-test="sidebar-btn-componentes"
                />
                <SidebarButtonMenu
                  src="relatorios.svg"
                  srcHover="relatorios-hover.svg"
                  name="Relatórios"
                  data-test="sidebar-btn-relatorios"
                />
                <SidebarButtonMenu
                  src="orcamentos.svg"
                  srcHover="orcamentos-hover.svg"
                  name="Orçamentos"
                  data-test="sidebar-btn-orcamentos"
                />
                <hr className="w-[310px] border-[#D9D9D9]" data-test="sidebar-divider" />
                <SidebarButtonMenu
                src="sair.svg"
                srcHover="sair-hover.svg"
                name="Sair"
                data-test="sidebar-btn-sair"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}