import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Localizacao {
  _id: string;
  nome: string;
  ativo: boolean;
  usuario: string;
  __v: number;
}

interface LocalizacoesApiResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    docs: Localizacao[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
  errors: any[];
}

interface EstoqueData {
  _id: string;
  localizacao: {
    _id: string;
    nome: string;
  };
  componente: string;
  quantidade: number;
}

interface EstoqueApiResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    docs: EstoqueData[];
  };
}

interface MovimentacaoRequest {
  tipo: 'saida';
  quantidade: string;
  componente: string;
  localizacao: string;
}

interface ModalSaidaComponenteProps {
  isOpen: boolean;
  onClose: () => void;
  componenteId: string;
  componenteNome: string;
  onSuccess?: () => void;
}

export default function ModalSaidaComponente({
  isOpen,
  onClose,
  componenteId,
  componenteNome,
  onSuccess
}: ModalSaidaComponenteProps) {
  const queryClient = useQueryClient();
  const [quantidade, setQuantidade] = useState('');
  const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{ quantidade?: string; localizacao?: string }>({});



  // Query para buscar localizações
  const { data: localizacoesData, isLoading: isLoadingLocalizacoes } = useQuery<LocalizacoesApiResponse>({
    queryKey: ['localizacoes'],
    queryFn: async () => {
      const response = await api.get<LocalizacoesApiResponse>('/localizacoes');
      return response.data;
    },
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Falha na autenticação')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Query para buscar estoques do componente
  const { data: estoquesData } = useQuery<EstoqueApiResponse>({
    queryKey: ['estoques', componenteId],
    queryFn: async () => {
      const response = await api.get<EstoqueApiResponse>(
        `/estoques/componente/${componenteId}`
      );
      return response.data;
    },
    enabled: isOpen && !!componenteId,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Falha na autenticação')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const saidaMutation = useMutation({
    mutationFn: async (data: MovimentacaoRequest) => {
      const response = await api.post('/movimentacoes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['componentes']
      });
      
      queryClient.removeQueries({ 
        queryKey: ['estoques', componenteId]
      });
      
      setQuantidade('');
      setLocalizacaoSelecionada('');
      setErrors({});
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      console.error('Erro ao registrar saída:', error);
      if (error?.response?.data) {
        console.error('Resposta da API:', error.response.data);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuantidade('');
      setLocalizacaoSelecionada('');
      setErrors({});
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const localizacoes = localizacoesData?.data?.docs || [];
  const estoques = estoquesData?.data?.docs || [];
  const localizacaoSelecionadaObj = localizacoes.find(loc => loc._id === localizacaoSelecionada);
  
  // Função para obter a quantidade disponível em uma localização
  const getQuantidadeDisponivel = (localizacaoId: string): number => {
    const estoque = estoques.find(e => e.localizacao._id === localizacaoId);
    return estoque?.quantidade || 0;
  };



  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setQuantidade(value);
      if (errors.quantidade) {
        setErrors(prev => ({ ...prev, quantidade: undefined }));
      }
    }
  };

  const handleLocalizacaoSelect = (localizacao: Localizacao) => {
    setLocalizacaoSelecionada(localizacao._id);
    setIsDropdownOpen(false);
    if (errors.localizacao) {
      setErrors(prev => ({ ...prev, localizacao: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { quantidade?: string; localizacao?: string } = {};

    if (!quantidade || quantidade === '0') {
      newErrors.quantidade = 'Quantidade deve ser maior que 0';
    }

    if (!localizacaoSelecionada) {
      newErrors.localizacao = 'Selecione uma localização';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Verificar se todos os dados estão presentes antes de enviar
    if (!componenteId) {
      setErrors({ ...errors, quantidade: 'ID do componente não encontrado' });
      return;
    }

    if (!quantidade || quantidade.trim() === '') {
      setErrors({ ...errors, quantidade: 'Quantidade é obrigatória' });
      return;
    }

    if (!localizacaoSelecionada || localizacaoSelecionada.trim() === '') {
      setErrors({ ...errors, localizacao: 'Localização é obrigatória' });
      return;
    }

    const movimentacaoData: MovimentacaoRequest = {
      tipo: 'saida',
      quantidade: quantidade.trim(),
      componente: componenteId.trim(),
      localizacao: localizacaoSelecionada.trim(),
    };

    saidaMutation.mutate(movimentacaoData);
  };

  const modalContent = (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4"
      style={{
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-visible animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="px-6 pb-6 space-y-6">
          <div className="text-center pt-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Registrar saída de {componenteNome}
            </h2>
          </div>

          {/* Campo Quantidade */}
          <div className="space-y-2">
            <label htmlFor="quantidade" className="block text-base font-medium text-gray-700">
              Quantidade <span className="text-red-500">*</span>
            </label>
            <input
              id="quantidade"
              type="text"
              placeholder="Digite a quantidade"
              value={quantidade}
              onChange={handleQuantidadeChange}
              className={`w-full px-4 py-3 bg-white border rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${errors.quantidade ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={saidaMutation.isPending}
            />
            {errors.quantidade && (
              <p className="text-red-500 text-sm mt-1">{errors.quantidade}</p>
            )}
          </div>

          {/* Campo Localização */}
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">
              Localização <span className="text-red-500">*</span>
            </label>
            <div className="relative" data-dropdown>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${errors.localizacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={isLoadingLocalizacoes || saidaMutation.isPending}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className={localizacaoSelecionadaObj ? 'text-gray-900' : 'text-gray-500'}>
                    {isLoadingLocalizacoes
                      ? 'Carregando...'
                      : localizacaoSelecionadaObj?.nome || 'Selecione uma localização'
                    }
                  </span>
                  {localizacaoSelecionada && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      getQuantidadeDisponivel(localizacaoSelecionada) > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getQuantidadeDisponivel(localizacaoSelecionada)} disponível
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                  }`} />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && !isLoadingLocalizacoes && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {localizacoes.length > 0 ? (
                    localizacoes.map((localizacao) => {
                      const qtdDisponivel = getQuantidadeDisponivel(localizacao._id);
                      return (
                        <button
                          key={localizacao._id}
                          type="button"
                          onClick={() => handleLocalizacaoSelect(localizacao)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer ${
                            localizacaoSelecionada === localizacao._id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={localizacaoSelecionada === localizacao._id ? 'text-blue-600 font-medium' : 'text-gray-900'}>
                              {localizacao.nome}
                            </span>
                            <span className={`text-sm px-2 py-0.5 rounded ${
                              qtdDisponivel > 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {qtdDisponivel} disponível
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      Nenhuma localização encontrada
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.localizacao && (
              <p className="text-red-500 text-sm mt-1">{errors.localizacao}</p>
            )}
          </div>

          {/* Mensagem de erro da API */}
          {saidaMutation.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              <div className="font-medium mb-1">Não foi possível registrar a saída</div>
              <div className="text-red-500">
                {(saidaMutation.error as any)?.response?.data?.message || 
                  (saidaMutation.error as any)?.message || 
                  'Erro desconhecido'}
              </div>
            </div>
          )}
        </div>

        {/* Footer com ações */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saidaMutation.isPending}
              className="flex-1 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saidaMutation.isPending}
              className="flex-1 text-white hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: '#306FCC' }}
            >
              {saidaMutation.isPending ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
