

"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/ui/sidebar"
import { SidebarContent } from "@/components/ui/sidebar"
import { SidebarGroupLabel } from "@/components/ui/sidebar"
import { SidebarGroup } from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/ui/sidebar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { Component, useState } from "react"
import SidebarButtonMenu from "./sidebarButton"
import { useRouter } from "next/navigation"
import { getURL } from "next/dist/shared/lib/utils"
import Link from "next/link"

interface CustomSidebarProps {
  children?: React.ReactNode;
}

export default function CustomSidebar({ children }: CustomSidebarProps) {
  const [testNome, setTesteNome] = useState<string>("")
  const router = useRouter()
  // const componentesSVG = "componentes-svg"
  return (
    <div data-test="sidebar-container" className="flex">
      <div>
        <SidebarProvider data-test='sidebar-provider' className="m-0 p-0 w-[350px] bg-black" >
          <Sidebar data-test="sidebar-main" className="flex-row">
            <SidebarContent className="bg-[#111827] w-[350px]" data-test="sidebar-content">
              <SidebarGroup data-test="sidebar-logo-group" className="">
                <SidebarGroupLabel className="mt-[70px] flex justify-center items-center h-8 rounded-md text-xs font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2" data-test="sidebar-logo-label">
                  <img src="logo-componentes.svg" className="" alt="" data-test="sidebar-logo-image" />
                </SidebarGroupLabel>
              </SidebarGroup>
              <SidebarMenu className="mt-[70px]" data-test="sidebar-menu">
                <SidebarMenuItem className="text-[#B4BAC5] items-center gap-[25px] flex flex-col" data-test="sidebar-menu-item">
                  <Link href={"/componentes"}>
                    <SidebarButtonMenu
                      rota="/componentes"
                      src="componentes.svg"
                      srcHover="componentes-hover.svg"
                      name="Componentes"
                      data-test="sidebar-btn-componentes"
                    />
                  </Link>
                  <Link href={"/relatorios"}>
                    <SidebarButtonMenu
                      rota="relatorios"
                      src="relatorios.svg"
                      srcHover="relatorios-hover.svg"
                      name="Relatórios"
                      data-test="sidebar-btn-relatorios"
                    />
                  </Link>
                  <Link href={"/orcamentos"}>
                    <SidebarButtonMenu
                      rota="orcamentos"
                      src="orcamentos.svg"
                      srcHover="orcamentos-hover.svg"
                      name="Orçamentos"
                      data-test="sidebar-btn-orcamentos"
                    />
                  </Link>
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
      <div className="w-[100%]">
        {children}
      </div>
    </div>
  )
}