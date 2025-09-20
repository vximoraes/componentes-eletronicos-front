"use client"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState } from "react"
type sidebarMenuButton = {
    src: string,
    srcHover:string,
    name:string,
    "data-test"?: string
}
export default function SidebarButtonMenu({src, srcHover, name, "data-test": dataTest}: sidebarMenuButton) {
    const [isHover, setIsHover] = useState<string>(src)
    return(
        <>
        <SidebarMenuButton 
        className="text-[21px] pl-[25px] h-[60px] w-[310px] componentes cursor-pointer flex gap-[15px]"
        onMouseEnter={() =>setIsHover(srcHover)}
        onMouseLeave={() => setIsHover(src)}
        data-test={dataTest || "sidebar-menu-button"}
        >
            <img src={isHover} alt="" data-test={`${dataTest}-icon` || "sidebar-button-icon"} />
            <span className="font-medium" data-test={`${dataTest}-text` || "sidebar-button-text"}>{name}</span>
        </SidebarMenuButton>
        </>
    )
}