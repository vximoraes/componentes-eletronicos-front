"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, FileText, Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

// ============================
// (Cards e Gráfico)
// ============================
const dadosGrafico = [
  { mes: "Jan", entradas: 20, saidas: 10 },
  { mes: "Fev", entradas: 25, saidas: 18 },
  { mes: "Mar", entradas: 30, saidas: 12 },
  { mes: "Abr", entradas: 22, saidas: 16 },
  { mes: "Mai", entradas: 28, saidas: 20 },
  { mes: "Jun", entradas: 32, saidas: 25 },
]

const cards = [
  {
    titulo: "Total de movimentações",
    valor: 127,
    icone: <Package className="text-blue-500" size={20} />,
  },
  {
    titulo: "Entradas registradas",
    valor: 90,
    icone: <CheckCircle className="text-green-500" size={20} />,
  },
  {
    titulo: "Saídas registradas",
    valor: 37,
    icone: <AlertTriangle className="text-yellow-500" size={20} />,
  },
  {
    titulo: "Pendentes",
    valor: 5,
    icone: <XCircle className="text-red-500" size={20} />,
  },
]

// ============================
// COMPONENTE PRINCIPAL
// ============================
export default function RelatoriosMovimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [filtro, setFiltro] = useState("")

  // Simula carregamento de dados
  useEffect(() => {
    console.log("Carregar movimentações da API...")
  }, [])

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-1">Relatório</h1>
      <p className="text-gray-500 mb-6">Movimentações</p>

      {/* === CARDS DE RESUMO === */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">{card.titulo}</p>
                <h2 className="text-xl font-semibold">{card.valor}</h2>
              </div>
              {card.icone}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GRÁFICO DE MOVIMENTAÇÕES */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Movimentações por Mês</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#6B7280" }} />
                <YAxis tick={{ fill: "#6B7280" }} />
                <Tooltip />
                <Bar dataKey="entradas" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* BARRA DE PESQUISA */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar componentes..."
            className="pl-8"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} /> Filtros
        </Button>
        <Button className="flex items-center gap-2">
          <FileText size={16} /> Gerar relatório
        </Button>
      </div>

      {/* === TABELA (em breve) === */}
      <div>[Tabela aqui futuramente]</div>
    </div>
  )
}
