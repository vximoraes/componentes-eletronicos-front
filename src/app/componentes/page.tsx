"use client"
import CustomSidebar from "@/components/sidebar";
import Cabecalho from "@/components/cabecalho";
import { cabecalhoUser } from "@/components/cabecalho";
import { usePathname } from "next/navigation";
export default function TelaComponentes(){
  return(
    <CustomSidebar>
      <Cabecalho acao={"Adicionar"} pagina="Componentes" fotoPerfil="foto-default.svg"/>
    </CustomSidebar>
  )
}