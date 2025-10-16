"use client"

import ComponenteEletronico from "@/components/componente-eletronico";
import StatCard from "@/components/stat-card";
import CustomSidebar from "@/components/sidebar";
import ModalLocalizacoes from "@/components/modal-localizacoes";
import ModalFiltros from "@/components/modal-filtros";
import ModalEntradaComponente from "@/components/modal-entrada-componente";
import ModalSaidaComponente from "@/components/modal-saida-componente";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { authenticatedRequest } from '@/utils/auth';
import { ApiResponse, EstoqueApiResponse } from '@/types/componentes';
import { Search, Filter, Plus, Package, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQueryState } from 'nuqs';

export default function ComponentesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponenteId, setSelectedComponenteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltrosModalOpen, setIsFiltrosModalOpen] = useState(false);
  const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
  const [entradaComponenteId, setEntradaComponenteId] = useState<string | null>(null);
  const [isSaidaModalOpen, setIsSaidaModalOpen] = useState(false);
  const [saidaComponenteId, setSaidaComponenteId] = useState<string | null>(null);
  const [updatingComponenteId, setUpdatingComponenteId] = useState<string | null>(null);

  const [categoriaFilter, setCategoriaFilter] = useQueryState('categoria', { defaultValue: '' });
  const [statusFilter, setStatusFilter] = useQueryState('status', { defaultValue: '' });
  
  const { data, isLoading, isFetching, error, refetch } = useQuery<ApiResponse>({
    queryKey: ['componentes', searchTerm, categoriaFilter, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('nome', searchTerm);
      if (categoriaFilter) params.append('categoria', categoriaFilter);
      if (statusFilter) params.append('status', statusFilter);
      
      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/componentes${queryString ? `?${queryString}` : ''}`;
      
      return authenticatedRequest<ApiResponse>(url, { method: 'GET' });
    },
    staleTime: 1000 * 60 * 5, 
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Falha na autenticação')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Query para buscar estoques de um componente específico
  const { data: estoquesData, isLoading: isLoadingEstoques } = useQuery<EstoqueApiResponse>({
    queryKey: ['estoques', selectedComponenteId],
    queryFn: () => authenticatedRequest<EstoqueApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/estoques/componente/${selectedComponenteId}`,
      { method: 'GET' }
    ),
    enabled: !!selectedComponenteId,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Falha na autenticação')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Query para buscar categorias para mostrar o nome nos filtros
  const { data: categoriasData } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => authenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/categorias`,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 10, 
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Falha na autenticação')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const handleEdit = (id: string) => {
    console.log("Edit clicked for component:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete clicked for component:", id);
  };

  const handleComponenteClick = (id: string) => {
    setSelectedComponenteId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComponenteId(null);
  };

  const handleOpenFiltrosModal = () => {
    setIsFiltrosModalOpen(true);
  };

  const handleCloseFiltrosModal = () => {
    setIsFiltrosModalOpen(false);
  };

  const handleFiltersChange = (categoria: string, status: string) => {
    setCategoriaFilter(categoria);
    setStatusFilter(status);
  };

  const handleEntrada = (id: string) => {
    setEntradaComponenteId(id);
    setIsEntradaModalOpen(true);
  };

  const handleSaida = (id: string) => {
    setSaidaComponenteId(id);
    setIsSaidaModalOpen(true);
  };

  const handleCloseEntradaModal = () => {
    setIsEntradaModalOpen(false);
    setEntradaComponenteId(null);
  };

  const handleEntradaSuccess = () => {
    if (entradaComponenteId) {
      setUpdatingComponenteId(entradaComponenteId);
    }
    refetch();
  };

  const handleCloseSaidaModal = () => {
    setIsSaidaModalOpen(false);
    setSaidaComponenteId(null);
  };

  const handleSaidaSuccess = () => {
    if (saidaComponenteId) {
      setUpdatingComponenteId(saidaComponenteId);
    }
    refetch();
  };

  useEffect(() => {
    if (!isFetching && updatingComponenteId) {
      setUpdatingComponenteId(null);
    }
  }, [isFetching, updatingComponenteId]);

  const componentes = data?.data?.docs || [];
  
  // Calcular estatísticas
  const totalComponentes = componentes.length;
  const emEstoque = componentes.filter(c => c.status === 'Em Estoque').length;
  const baixoEstoque = componentes.filter(c => c.status === 'Baixo Estoque').length;
  const indisponiveis = componentes.filter(c => c.status === 'Indisponível').length;

  return (
    <div className="p-6" data-test="componentes-page">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 min-h-[120px]" data-test="stats-grid">
        <StatCard
          title="Total de"
          subtitle="componentes"
          value={totalComponentes}
          icon={Package}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          data-test="stat-total-componentes"
          hoverTitle={`Total de componentes cadastrados: ${totalComponentes}`}
        />
        
        <StatCard
          title="Em estoque"
          value={emEstoque}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          data-test="stat-em-estoque"
          hoverTitle={`Componentes disponíveis em estoque: ${emEstoque}`}
        />
        
        <StatCard
          title="Baixo estoque"
          value={baixoEstoque}
          icon={AlertTriangle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          data-test="stat-baixo-estoque"
          hoverTitle={`Componentes com baixo estoque: ${baixoEstoque}`}
        />
        
        <StatCard
          title="Indisponível"
          value={indisponiveis}
          icon={XCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          data-test="stat-indisponiveis"
          hoverTitle={`Componentes indisponíveis: ${indisponiveis}`}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6" data-test="search-actions-bar">
        <div className="relative flex-1" data-test="search-container">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Pesquisar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-test="search-input"
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 cursor-pointer"
          data-test="filtros-button"
          onClick={handleOpenFiltrosModal}
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        <Button 
          className="flex items-center gap-2 text-white hover:opacity-90" 
          style={{ backgroundColor: '#306FCC' }}
          data-test="adicionar-button"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {/* Filtros aplicados */}
      {(categoriaFilter || statusFilter) && (
        <div className="mb-4" data-test="applied-filters">
          <div className="flex flex-wrap items-center gap-2">
            {categoriaFilter && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-300 shadow-sm">
                <span className="font-medium">Categoria:</span>
                <span>{categoriasData?.data?.docs?.find((cat: any) => cat._id === categoriaFilter)?.nome || 'Selecionada'}</span>
                <button
                  onClick={() => setCategoriaFilter('')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-1 transition-colors flex items-center justify-center cursor-pointer"
                  title="Remover filtro de categoria"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {statusFilter && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-300 shadow-sm">
                <span className="font-medium">Status:</span>
                <span>{statusFilter}</span>
                <button
                  onClick={() => setStatusFilter('')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-1 transition-colors flex items-center justify-center cursor-pointer"
                  title="Remover filtro de status"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div 
          className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          data-test="error-message"
          title={`Erro completo: ${error.message}`}
        >
          Erro ao carregar componentes: {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12" data-test="loading-spinner">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Carregando componentes...</p>
        </div>
      ) : componentes.length > 0 ? (
        <div 
          className="grid gap-4 w-full" 
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(max(300px, min(400px, calc((100% - 3rem) / 6))), 1fr))' }}
          data-test="componentes-grid"
        >
          {componentes.map((componente, index) => (
            <ComponenteEletronico
              key={componente._id}
              id={componente._id}
              nome={componente.nome}
              categoria={componente.categoria.nome}
              quantidade={componente.quantidade}
              status={componente.status}
              imagem={componente.imagem}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={handleComponenteClick}
              onEntrada={handleEntrada}
              onSaida={handleSaida}
              isLoading={updatingComponenteId === componente._id && isFetching}
              data-test={`componente-card-${index}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8" data-test="empty-state">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Nenhum componente encontrado para sua pesquisa.' : 'Não há componentes cadastrados...'}
          </p>
        </div>
      )}

      {/* Modal de Localizações */}
      {selectedComponenteId && (
        <ModalLocalizacoes
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          componenteId={selectedComponenteId}
          componenteNome={componentes.find(c => c._id === selectedComponenteId)?.nome || ''}
          estoques={estoquesData?.data?.docs || []}
          isLoading={isLoadingEstoques}
          totalQuantidade={
            estoquesData?.data?.docs?.filter(estoque => 
              estoque.quantidade != null && 
              !isNaN(Number(estoque.quantidade)) && 
              Number(estoque.quantidade) > 0
            ).reduce((total, estoque) => total + Number(estoque.quantidade), 0) || 0
          }
        />
      )}

      {/* Modal de Filtros */}
      <ModalFiltros
        isOpen={isFiltrosModalOpen}
        onClose={handleCloseFiltrosModal}
        categoriaFilter={categoriaFilter}
        statusFilter={statusFilter}
        onFiltersChange={handleFiltersChange}
      />

      {/* Modal de Entrada de Componente */}
      {entradaComponenteId && (
        <ModalEntradaComponente
          isOpen={isEntradaModalOpen}
          onClose={handleCloseEntradaModal}
          componenteId={entradaComponenteId}
          componenteNome={componentes.find(c => c._id === entradaComponenteId)?.nome || ''}
          onSuccess={handleEntradaSuccess}
        />
      )}

      {/* Modal de Saída de Componente */}
      {saidaComponenteId && (
        <ModalSaidaComponente
          isOpen={isSaidaModalOpen}
          onClose={handleCloseSaidaModal}
          componenteId={saidaComponenteId}
          componenteNome={componentes.find(c => c._id === saidaComponenteId)?.nome || ''}
          onSuccess={handleSaidaSuccess}
        />
      )}
    </div>
  );
}
