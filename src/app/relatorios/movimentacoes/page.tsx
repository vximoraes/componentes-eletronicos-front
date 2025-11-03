import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, FileText } from "lucide-react"

export default function RelatoriosMovimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [filtro, setFiltro] = useState("")

  // Carrega as movimentações 
  useEffect(() => {
    console.log("Carregar movimentações da API...")
  }, [])

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">Relatório</h1>
      <p className="text-gray-500 mb-6">Movimentações</p>

      {/* grafico vai ser implementado*/}
      <div className="mb-6">[Gráfico aqui futuramente]</div>
    
    {/* Barra de pesquisa e botões */}
      <div className="flex items-center gap-2 mb-4"></div>