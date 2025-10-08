"use client"

import ComponenteEletronico from "@/components/componente-eletronico";
import StatCard from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { authenticatedRequest } from '@/utils/auth';
import { ApiResponse } from '@/types/componentes';
import { Search, Filter, Plus, Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function ComponentesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
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

  const handleEdit = (id: string) => {
    console.log("Edit clicked for component:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete clicked for component:", id);
  };

  const componentes = data?.data?.docs || [];
  
  // Calcular estatísticas
  const totalComponentes = componentes.length;
  const emEstoque = componentes.filter(c => c.status === 'Em Estoque').length;
  const baixoEstoque = componentes.filter(c => c.status === 'Baixo Estoque').length;
  const indisponiveis = componentes.filter(c => c.status === 'Indisponível').length;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 min-h-[120px]">
        <StatCard
          title="Total de"
          subtitle="componentes"
          value={totalComponentes}
          icon={Package}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        
        <StatCard
          title="Em estoque"
          value={emEstoque}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        
        <StatCard
          title="Baixo estoque"
          value={baixoEstoque}
          icon={AlertTriangle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        
        <StatCard
          title="Indisponível"
          value={indisponiveis}
          icon={XCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Pesquisar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        <Button 
          className="flex items-center gap-2 text-white hover:opacity-90" 
          style={{ backgroundColor: '#306FCC' }}
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Erro ao carregar componentes: {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Carregando componentes...</span>
        </div>
      ) : componentes.length > 0 ? (
        <div className="grid gap-4 w-full" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}>
          {componentes.map((componente) => (
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Nenhum componente encontrado para sua pesquisa.' : 'Não há componentes cadastrados...'}
          </p>
        </div>
      )}
    </div>
  );
}