

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
    <div>
      <SidebarProvider data-test='sidebar' >
        <Sidebar>
          <SidebarContent className="bg-[#111827] w-[350px]">
            <SidebarGroup>
              <SidebarGroupLabel className="mt-[70px] justify-center"><img src="logo-componentes.svg" alt="" /></SidebarGroupLabel>
            </SidebarGroup>
            <SidebarMenu className="mt-[78px]">
              <SidebarMenuItem className="text-[#B4BAC5] items-center gap-[27px] flex flex-col">
                <SidebarButtonMenu
                  src="componentes.svg"
                  srcHover="componentes-hover.svg"
                  name="Componentes"
                />
                <SidebarButtonMenu
                  src="relatorios.svg"
                  srcHover="relatorios-hover.svg"
                  name="Relatórios"
                />
                <SidebarButtonMenu
                  src="orcamentos.svg"
                  srcHover="orcamentos-hover.svg"
                  name="Orçamentos.svg"
                />
                <hr className="w-[310px] border-[#D9D9D9]" />
                <SidebarButtonMenu
                src="sair.svg"
                srcHover="sair-hover.svg"
                name="Sair"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}