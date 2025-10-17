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
  path?: string
}
export default function SidebarButtonMenu({ src, srcHover, name, "data-test": dataTest, route, path }: sidebarMenuButton) {
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
  }
  function hoverButton(svg: string) {
    if (!isRouter) {
      setIsHover(svg)
    }
  }
  return (
    <>
      <SidebarMenuButton
        className={"text-[21px] pl-[25px] h-[60px] w-[310px] componentes cursor-pointer flex gap-[15px] relative transition-all duration-300 ease-in-out group " + (isRouter ? (isRouter + " hover:bg-[rgba(255,255,255,1)]! shadow-md ") : "hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit!")}
        onClick={() => trocarPagina()}
        data-test={dataTest || "sidebar-menu-button"}
      >
        <img src={isHover} alt="" data-test={`${dataTest}-icon` || "sidebar-button-icon"} className="w-[26px] h-[26px]" />
        <span className={"text-[19px] font-medium " + (isBlack ? isBlack : "text-[#B4BAC5]")} data-test={`${dataTest}-text` || "sidebar-button-text"}>{name}</span>
      </SidebarMenuButton>
    </>
  )
}
