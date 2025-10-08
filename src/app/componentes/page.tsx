"use client"

import ComponenteEletronico from "@/components/componente-eletronico";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { authenticatedRequest } from '@/utils/auth';
import { ApiResponse } from '@/types/componentes';

export default function ComponentesPage() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ['componentes'],
    queryFn: () => authenticatedRequest<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/componentes`,
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Componentes Eletrônicos</h1>
        <Button onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? "Carregando..." : "Atualizar Lista"}
        </Button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Quantidade de componentes: {componentes.length}
        {data && <span className="ml-4 text-green-600">✓ Conectado</span>}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Erro ao carregar componentes: {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Carregando componentes...</span>
        </div>
      ) : componentes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="text-center py-12 text-gray-500">
          Não há componentes cadastrados...
        </div>
      )}
    </div>
  );
}