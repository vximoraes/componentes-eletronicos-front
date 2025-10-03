"use client"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useState, useMemo } from "react"

type sidebarMenuButton = {
    rota?: string
    src: string,
    srcHover: string,
    name: string,
    "data-test"?: string
}

export default function SidebarButtonMenu({rota, src, srcHover, name, "data-test": dataTest}: sidebarMenuButton) {
    const [isHover, setIsHover] = useState<boolean>(false)
    const currentPath = usePathname()
    
    // Usa useMemo para otimizar a comparação e torná-la reativa
    const isActiveRoute = useMemo(() => {
        return rota ? currentPath === rota : false
    }, [currentPath, rota])
    return(
        <>
        <SidebarMenuButton 
        className={`text-[21px] pl-[25px] h-[60px] w-[310px] componentes cursor-pointer flex gap-[15px] transition-all duration-200 ${
            isActiveRoute || isHover ? 'bg-white rounded-lg' : 'hover:bg-gray-700'
        }`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        data-test={dataTest || "sidebar-menu-button"}
        >
            <img 
                src={isActiveRoute || isHover ? srcHover : src} 
                alt="" 
                data-test={`${dataTest}-icon` || "sidebar-button-icon"} 
                className="w-6 h-6"
            />
            <span 
                className={`font-medium transition-colors duration-200 ${
                    isActiveRoute || isHover ? 'text-black' : 'text-[#B4BAC5]'
                }`} 
                data-test={`${dataTest}-text` || "sidebar-button-text"}
            >
                {name}
            </span>
        </SidebarMenuButton>
        </>
    )
}