"use client"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState } from "react"
type sidebarMenuButton = {
    src: string,
    srcHover:string,
    name:string
}
export default function SidebarButtonMenu({src, srcHover, name}: sidebarMenuButton) {
    const [isHover, setIsHover] = useState<string>(src)
    return(
        <>
        <SidebarMenuButton className="text-[21px] pl-[25px] h-[60px] w-[310px] componentes cursor-pointer flex gap-[15px]"
        onMouseEnter={() =>setIsHover(srcHover)}
        onMouseLeave={() => setIsHover(src)}
        >
            <img src={isHover} alt="" />
            <span className="font-medium">{name}</span>
        </SidebarMenuButton>
        </>
    )
}