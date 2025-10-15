"use client"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState} from "react"
import { useRouter } from "next/navigation"
import { useEffect} from "react"

type sidebarMenuButton = {
    src:string,
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

    // Toda vez que a url trocar ele vê faz uma comparação para ver qual botão é compativel com a url, assim trocando de cor
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
        // condição pra assegurar a cor do botão se a url atual for igual
        if (!isRouter) {
            setIsHover(svg)
        }
    }
    return (
        <>
            <SidebarMenuButton
                className={"text-[21px] pl-[25px] h-[60px] w-[310px] componentes cursor-pointer flex gap-[15px] " + isRouter}
                onMouseEnter={() => hoverButton(srcHover)}
                onMouseLeave={() => hoverButton(src)}
                onClick={() => trocarPagina()}
                data-test={dataTest || "sidebar-menu-button"}
            >
                <img src={isHover} alt="" data-test={`${dataTest}-icon` || "sidebar-button-icon"} />
                <span className={"font-medium " + isBlack} data-test={`${dataTest}-text` || "sidebar-button-text"}>{name}</span>

            </SidebarMenuButton>
        </>
    )
}