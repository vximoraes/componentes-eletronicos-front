"use client"
import Cabecalho from "@/components/cabecalho"

export default function RelatorioMovimentacoesPage() {
  return (
    <div className="w-full">
      <Cabecalho pagina="Relatórios" acao="Movimentações" />
      <div className="p-6 pt-0">
        <p>Conteúdo do relatório de movimentações aqui...</p>
      </div>
    </div>
  )
}