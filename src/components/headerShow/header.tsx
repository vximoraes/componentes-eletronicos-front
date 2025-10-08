'use client'
import { usePathname } from "next/navigation";
import CustomSidebar from "../sidebar";

export default function Header(){
  const pathName = usePathname()
  const rotasShow = ['/componentes', '/orcamentos','/relatorios']
  console.log(pathName)
  if(rotasShow.includes(pathName)){
    return(
      <div>
        <CustomSidebar/>
      </div>
    )
  }
  return (
    <h1>Rota não convém.</h1>
  )
}