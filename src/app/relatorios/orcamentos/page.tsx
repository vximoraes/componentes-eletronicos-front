"use client"
import Cabecalho from "@/components/cabecalho"

export default function RelatorioOrcamentosPage() {
  return (
    <div className="w-full">
      <Cabecalho pagina="Relatórios" acao="Orçamentos" />
      <div className="p-6 pt-0">
        <p>Conteúdo do relatório de orçamentos aqui...</p>
      </div>
    </div>
  )
}