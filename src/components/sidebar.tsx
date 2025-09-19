

import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/ui/sidebar"
import { SidebarContent } from "@/components/ui/sidebar"
import { SidebarGroupLabel } from "@/components/ui/sidebar"
import { SidebarGroup } from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/ui/sidebar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { useState } from "react"
import toggleSVG from "."

export default function CustomSidebar() {
  const  [testNome, setTesteNome] = useState<string>("")
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
              <SidebarMenuItem className="text-[#B4BAC5] justify-items-center">
                <SidebarMenuButton className="text-[21px] pl-[25px] h-[60px] w-[310px] componentes"
                  onMouseEnter={() => toggleSVG(componentesSVG)}
                  onMouseLeave={() => toggleSVG(componentesSVG)}
                >
                  {/* <img src="componentes-hover.svg" className={isHidden} alt="" /> */}
                  <img src={"componentes"+ testNome}  alt="" />
                  <span>Componentes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}