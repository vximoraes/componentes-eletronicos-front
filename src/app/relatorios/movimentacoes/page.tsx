"use client";

import StatCard from "@/components/stat-card";
import Cabecalho from "@/components/cabecalho";
import ModalFiltros from "@/components/modal-filtros";
import ModalExportarRelatorio from "@/components/modal-exportar-relatorio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/lib/fetchData";
import { Search, Filter, CheckCircle, XCircle, ArrowDownUp, ArrowUpDown, FileText, X } from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { PulseLoader } from "react-spinners";
import { toast, Slide } from "react-toastify";
import { useSession } from "@/hooks/use-session";
import { generateComponentesPDF } from "@/utils/pdfGenerator"; 
import { generateComponentesCSV } from "@/utils/csvGenerator"; 

interface MovimentacoesApiResponse {
  data: {
    docs: any[];
    hasNextPage: boolean;
    nextPage?: number;
  };
}

function RelatorioMovimentacoesPageContent() {
  const { user } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [isFiltrosModalOpen, setIsFiltrosModalOpen] = useState(false);
  const [isExportarModalOpen, setIsExportarModalOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Query principal
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<MovimentacoesApiResponse>({
    queryKey: ["movimentacoes-relatorio", searchTerm, tipoFilter],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) || 1;
      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("page", page.toString());

      const queryString = params.toString();
      const url = `/movimentacoes${queryString ? `?${queryString}` : ""}`;

      return await get<MovimentacoesApiResponse>(url);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNextPage ? lastPage.data.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const todasMovimentacoes =
    data?.pages.flatMap((page) => page.data.docs) || [];

  // Filtros locais
  const movimentacoesFiltradas = todasMovimentacoes.filter((mov) => {
    const matchSearch =
      !searchTerm ||
      mov.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.tipo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = !tipoFilter || mov.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  // Estatísticas (ver depois)
  const totalMov = movimentacoesFiltradas.length;
  const entradas = movimentacoesFiltradas.filter(
    (m) => m.tipo === "Entrada"
  ).length;
  const saidas = movimentacoesFiltradas.filter(
    (m) => m.tipo === "Saída"
  ).length;
  const canceladas = movimentacoesFiltradas.filter(
    (m) => m.status === "Cancelada"
  ).length;

  // Seleção
  const handleSelectAll = () => {
    if (selectedItems.size === movimentacoesFiltradas.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(movimentacoesFiltradas.map((m) => m._id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const isAllSelected =
    movimentacoesFiltradas.length > 0 &&
    selectedItems.size === movimentacoesFiltradas.length;
  const isSomeSelected =
    selectedItems.size > 0 &&
    selectedItems.size < movimentacoesFiltradas.length;

  // Exportar relatório
  const handleExport = async (fileName: string, format: string) => {
    try {
      const selecionadas = movimentacoesFiltradas.filter((m) =>
        selectedItems.has(m._id)
      );

      if (format === "PDF") {
        await generateComponentesPDF({
          estoques: selecionadas,
          fileName: fileName.trim(),
          title: "RELATÓRIO DE MOVIMENTAÇÕES",
          includeStats: true,
          userName: user?.name,
        });
        toast.success("PDF gerado com sucesso!", {
          position: "bottom-right",
          autoClose: 3000,
          transition: Slide,
        });
      } else {
        generateComponentesCSV({
          estoques: selecionadas,
          fileName: fileName.trim(),
          includeStats: true,
        });
        toast.success("CSV gerado com sucesso!", {
          position: "bottom-right",
          autoClose: 3000,
          transition: Slide,
        });
      }
      setIsExportarModalOpen(false);
    } catch {
      toast.error("Erro ao exportar relatório.", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Slide,
      });
    }
  };

  return (
  <div className="w-full h-screen flex flex-col overflow-x-hidden">
  <Cabecalho pagina="Relatórios" descricao="Movimentações" />

      <div className="flex-1 overflow-hidden flex flex-col p-6 pt-0 pb-0">
        

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total de"
            subtitle="movimentações"
            value={totalMov}
            icon={FileText}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="Entradas"
            value={entradas}
            icon={ArrowDownUp}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatCard
            title="Saídas"
            value={saidas}
            icon={ArrowUpDown}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
          />
          <StatCard
            title="Canceladas"
            value={canceladas}
            icon={XCircle}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
        </div>

        {/* Barra de pesquisa */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Pesquisar movimentações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsFiltrosModalOpen(true)}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button
            disabled={selectedItems.size === 0}
            className={`flex items-center gap-2 text-white transition-all ${
              selectedItems.size > 0
                ? "hover:opacity-90 cursor-pointer"
                : "opacity-50 cursor-not-allowed bg-gray-400"
            }`}
            style={
              selectedItems.size > 0 ? { backgroundColor: "#306FCC" } : {}
            }
            onClick={() => setIsExportarModalOpen(true)}
          >
            <img src="../gerar-pdf.svg" alt="" className="w-5" />
            Exportar
          </Button>
        </div>

        {/* Tabela */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <PulseLoader color="#3b82f6" size={6} />
              <p className="mt-4 text-gray-600">Carregando movimentações...</p>
            </div>
          ) : movimentacoesFiltradas.length > 0 ? (
            <div className="border rounded-lg bg-white flex-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto overflow-y-auto flex-1 relative">
                <table className="w-full caption-bottom text-xs sm:text-sm">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                    <TableRow className="bg-gray-50 border-b">
                      <TableHead className="text-center w-[50px] px-8">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isSomeSelected;
                          }}
                          onChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-left px-8">CÓDIGO</TableHead>
                      <TableHead className="text-center px-8">PRODUTO</TableHead>
                      <TableHead className="text-center px-8">Quantidade</TableHead>
                      <TableHead className="text-center px-8">TIPO DE MOVIMENTAÇÃO</TableHead>
                      <TableHead className="text-center px-8">LOCALIZAÇÃO</TableHead>
                      <TableHead className="text-left px-8">DATA/HORA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimentacoesFiltradas.map((mov) => (
                      <TableRow key={mov._id} className="hover:bg-gray-50 border-b">
                        <TableCell className="text-center px-8">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(mov._id)}
                            onChange={() => handleSelectItem(mov._id)}
                          />
                        </TableCell>
                        <TableCell className="px-8 font-medium">{mov.descricao}</TableCell>
                        <TableCell className="text-center px-8">{mov.tipo}</TableCell>
                        <TableCell className="text-center px-8">{mov.quantidade}</TableCell>
                        <TableCell className="text-center px-8">{mov.status}</TableCell>
                        <TableCell className="text-left px-8">{mov.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </table>

                {/* Target do infinite scroll */}
                <div ref={observerTarget} className="h-10 flex items-center justify-center">
                  {isFetchingNextPage && (
                    <PulseLoader color="#3b82f6" size={5} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center flex-1 flex items-center justify-center bg-white rounded-lg border">
              <div className="flex flex-col items-center">
                <FileText className="w-10 h-10 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Nenhuma movimentação encontrada.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalFiltros
        isOpen={isFiltrosModalOpen}
        onClose={() => setIsFiltrosModalOpen(false)}
        categoriaFilter={tipoFilter}
        statusFilter={""}
        onFiltersChange={(categoria) => setTipoFilter(categoria)}
      />

      <ModalExportarRelatorio
        isOpen={isExportarModalOpen}
        onClose={() => setIsExportarModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export default function RelatorioMovimentacoesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <PulseLoader color="#3b82f6" size={8} />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      }
    >
      <RelatorioMovimentacoesPageContent />
    </Suspense>
  );
}

{/* ALTERAR OS FILTROS E PDFS */}