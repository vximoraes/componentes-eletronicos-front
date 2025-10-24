"use client"
import Cabecalho from "@/components/cabecalho"
import Card from "@/components/cards-relatorios"
export default function RelarotiosPage() {
  return (
    <div className="w-full bg-[#F9FAFB] h-full">
      <Cabecalho pagina="Relatórios" />
      <div className="p-6 pt-0">
        <Card
        title="Componentes"
        descricao="Visualize relatórios completos sobre componentes e status de estoque."
        imagem="./relatorios-componentes.svg"
        />
      </div>
    </div>
  )
}