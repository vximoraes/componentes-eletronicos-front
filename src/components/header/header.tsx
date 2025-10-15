"use client"
import { usePathname } from "next/navigation";
import CustomSidebar from "../sidebar";
import { useEffect } from "react";

interface ComponenteReact {
    children?: React.ReactNode
}

export default function Header ({children}:ComponenteReact){
    const pathName = usePathname()
    // useEffect
    if(pathName !=="/perfil" && pathName !== "/"){
        return(
        <CustomSidebar path={pathName}/>
    )
    }
    return(
        <div>Nada</div>
    )
}