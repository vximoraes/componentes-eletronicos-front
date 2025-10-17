"use client"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type sidebarMenuButton = {
  src: string,
  srcHover: string,
  name: string,
  "data-test"?: string,
  route: string,
  path?: string,
  onItemClick?: () => void,
  collapsed?: boolean
}
export default function SidebarButtonMenu({ src, srcHover, name, "data-test": dataTest, route, path, onItemClick, collapsed = false }: sidebarMenuButton) {
  const [isHover, setIsHover] = useState<string>(src)
  const [isRouter, setIsRouter] = useState<string>()
  const [isBlack, setIsBlack] = useState<string>()
  const router = useRouter()

  useEffect(() => {

    if (path?.startsWith("/" + name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
      setIsHover(srcHover)
      setIsRouter("bg-white")
      setIsBlack("text-[#000]")
    }
    else if (isHover && isBlack) {
      setIsRouter("")
      setIsHover(src)
      setIsBlack("")
    }
  }, [path])
  function trocarPagina() {
    router.push(route)
    if (onItemClick) {
      onItemClick()
    }
  }
  function hoverButton(svg: string) {
    if (!isRouter) {
      setIsHover(svg)
    }
  }
  
  if (collapsed) {
    return (
      <>
        <SidebarMenuButton
          className={"flex justify-center items-center h-[50px] w-[80px] cursor-pointer relative transition-all duration-300 ease-in-out group rounded-lg " + (isRouter ? (isRouter + " hover:bg-[rgba(255,255,255,1)]! shadow-md ") : "hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit!")}
          onClick={() => trocarPagina()}
          data-test={dataTest || "sidebar-menu-button"}
          title={name}
        >
          <img src={isHover} alt={name} data-test={`${dataTest}-icon` || "sidebar-button-icon"} className="w-[24px] h-[24px]" />
        </SidebarMenuButton>
      </>
    )
  }
  
  return (
    <>
      <SidebarMenuButton
        className={"text-[17px] pl-[20px] h-[50px] w-[250px] componentes cursor-pointer flex gap-[12px] relative transition-all duration-300 ease-in-out group " + (isRouter ? (isRouter + " hover:bg-[rgba(255,255,255,1)]! shadow-md ") : "hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit!")}
        onClick={() => trocarPagina()}
        data-test={dataTest || "sidebar-menu-button"}
      >
        <img src={isHover} alt="" data-test={`${dataTest}-icon` || "sidebar-button-icon"} className="w-[22px] h-[22px]" />
        <span className={"text-[16px] font-medium " + (isBlack ? isBlack : "text-[#B4BAC5]")} data-test={`${dataTest}-text` || "sidebar-button-text"}>{name}</span>
      </SidebarMenuButton>
    </>
  )
}
