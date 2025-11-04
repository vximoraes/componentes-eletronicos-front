"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, FileText, Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export default function RelatorioMovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([])
  const [filtro, setFiltro] = useState("")
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarMovimentacoes() {
      try {
        const resposta = await fetch("http://localhost:3010/movimentacoes")
        const dados = await resposta.json()
        setMovimentacoes(dados.data || [])
      } catch (erro) {
        console.error("Erro ao carregar movimentações:", erro)
      } finally {
        setCarregando(false)
      }
    }

    carregarMovimentacoes()
  }, [])

  // Dados dos cards de estatísticas
  const cards = [
    {
      titulo: "Total de movimentações",
      valor: movimentacoes.length,
      icone: <Package className="text-blue-500" size={20} />,
    },
    {
      titulo: "Entradas registradas",
      valor: movimentacoes.filter((m) => m.tipo === "Entrada").length,
      icone: <CheckCircle className="text-green-500" size={20} />,
    },
    {
      titulo: "Saídas registradas",
      valor: movimentacoes.filter((m) => m.tipo === "Saída").length,
      icone: <AlertTriangle className="text-yellow-500" size={20} />,
    },
    {
      titulo: "Pendentes",
      valor: movimentacoes.filter((m) => m.status === "Pendente").length,
      icone: <XCircle className="text-red-500" size={20} />,
    },
  ]

  // Filtra as movimentações 
  const movimentacoesFiltradas = movimentacoes.filter((m) => {
    return (
      m.componente?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      m.tipo?.toLowerCase().includes(filtro.toLowerCase()) ||
      m.localizacao?.nome?.toLowerCase().includes(filtro.toLowerCase())
    )
  })

  return (
    <div className="p-8 space-y-6">
      {/* 🔹 Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-3">
          <h1 className="text-2xl font-bold">Relatório</h1>
          <p className="text-gray-500 mb-[2px]">Movimentações</p>
        </div>
      </div> {/* <-- faltava fechar esta div aqui */}

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

      {/* BARRA DE PESQUISA */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar movimentações..."
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

      {/* TABELA DE MOVIMENTAÇÕES */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        {carregando ? (
          <p className="text-gray-500 text-center py-4">Carregando movimentações...</p>
        ) : movimentacoesFiltradas.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma movimentação encontrada.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-gray-600">Código</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Produto</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Quantidade</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Tipo</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Localização</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesFiltradas.map((m) => (
                <tr key={m._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{m._id}</td>
                  <td className="py-2 px-3">{m.componente?.nome || "-"}</td>
                  <td className="py-2 px-3">{m.quantidade}</td>
                  <td
                    className={`py-2 px-3 font-semibold ${
                      m.tipo === "Entrada" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {m.tipo}
                  </td>
                  <td className="py-2 px-3">{m.localizacao?.nome || "-"}</td>
                  <td className="py-2 px-3">
                    {new Date(m.dataHora).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
