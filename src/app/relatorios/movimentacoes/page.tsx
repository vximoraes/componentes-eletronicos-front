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