"use client"

import ComponenteEletronico from "@/components/componente-eletronico";
import StatCard from "@/components/stat-card";
import CustomSidebar from "@/components/sidebar";
import ModalLocalizacoes from "@/components/modal-localizacoes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { authenticatedRequest } from '@/utils/auth';
import { ApiResponse, EstoqueApiResponse } from '@/types/componentes';
import { Search, Filter, Plus, Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function ComponentesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponenteId, setSelectedComponenteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ['componentes', searchTerm],
    queryFn: () => authenticatedRequest<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/componentes${searchTerm ? `?nome=${encodeURIComponent(searchTerm)}` : ''}`,
      { method: 'GET' }
    ),
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
          className="flex items-center gap-2"
          data-test="filtros-button"
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
          title={`Mostrando ${componentes.length} componente${componentes.length !== 1 ? 's' : ''}`}
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
    </div>
  );
}