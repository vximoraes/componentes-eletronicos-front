"use client"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { getURL } from "next/dist/shared/lib/utils"
import { usePathname } from "next/navigation"
import { useState } from "react"
type sidebarMenuButton = {
    rota?:string
    src: string,
    srcHover:string,
    name:string,
    "data-test"?: string
}
export default function SidebarButtonMenu({rota, src, srcHover, name, "data-test": dataTest}: sidebarMenuButton) {
    const [isHover, setIsHover] = useState<string>(src)
    const currentPath = usePathname()
    const [isUrl, setIsUrl] = useState<boolean>(currentPath === rota)
    return(
        <>
        <SidebarMenuButton 
        className={`text-[21px] pl-[25px] h-[60px] w-[310px] componentes cursor-pointer flex gap-[15px] `+ (isUrl && "bg-[#fff]")}
        onMouseEnter={() =>setIsHover(srcHover)}
        onMouseLeave={() => setIsHover(src)}
        data-test={dataTest || "sidebar-menu-button"}
        >
            <img src={isUrl ? srcHover: isHover} alt="" data-test={`${dataTest}-icon` || "sidebar-button-icon"} />
            <span className={"font-medium "+ (isUrl && "text-[#000]")} data-test={`${dataTest}-text` || "sidebar-button-text"}>{name}</span>
        </SidebarMenuButton>
        </>
    )
}