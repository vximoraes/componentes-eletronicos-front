"use client"
import Cabecalho from "@/components/cabecalho"
import Card from "@/components/cards-relatorios"
import { useRef, useState, useEffect } from "react"
export default function RelarotiosPage() {

    // const cardRef = useRef<HTMLDivElement>(null)
  
    // const [isCompact, setIsCompact] = useState(false)
  
    // useEffect(() => {
    //   const observer = new ResizeObserver(([entry]) => {
    //     setIsCompact(entry.contentRect.width < 300)
    //   });
    //   if (cardRef.current) observer.observe(cardRef.current);
    //   return () => observer.disconnect()
    // }, [])

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col justify-between pb-[20px] items-center">
      <Cabecalho pagina="Relatórios" />
      <div className="flex justify-center w-full px-8">
         <div className="flex flex-wrap justify-center gap-[30px] w-full max-w-[1500px]">
        <Card
        title="Componentes"
        descricao="Visualize relatórios completos sobre componentes e status de estoque."
        imagem="./relatorios-componentes.svg"
        bg_imagem="bg-[#DBEAFE]"
        />
        <Card
        title="Movimentações"
        descricao="Acompanhe entradas e saídas de componentes do estoque."
        imagem="./relatorios-movimentacoes.svg"
        bg_imagem="bg-[#E5DDFE]"
        />
        <Card
        title="Orçamentos"
        descricao="Acesse o histórico completo de orçamentos."
        imagem="./relatorios-orcamentos.svg"
        bg_imagem="bg-[#DCFCE7]"
        />
      </div>
      </div>
      <div></div>
      <div></div>
    </div>
  )
}