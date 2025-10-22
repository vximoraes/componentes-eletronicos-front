import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Package } from 'lucide-react';
import { EstoqueData } from '@/types/componentes';

interface ModalLocalizacoesProps {
  isOpen: boolean;
  onClose: () => void;
  componenteId: string;
  componenteNome: string;
  componenteDescricao?: string;
  estoques: EstoqueData[];
  isLoading: boolean;
  totalQuantidade: number;
}

export default function ModalLocalizacoes({
  isOpen,
  onClose,
  componenteId,
  componenteNome,
  componenteDescricao,
  estoques,
  isLoading,
  totalQuantidade
}: ModalLocalizacoesProps) {
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

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer z-10"
            title="Fechar"
          >
            <X size={20} />
          </button>
          <div className="text-center px-8">
            <div className="max-h-[100px] overflow-y-auto mb-2">
              <h2 className="text-xl font-semibold text-gray-900 break-words">{componenteNome}</h2>
            </div>
            {componenteDescricao && (
              <p className="text-sm text-gray-600 mb-3 break-words text-center max-w-full">{componenteDescricao}</p>
            )}
            <p className="text-xl font-semibold text-blue-600">
              {isLoading ? "Carregando..." : totalQuantidade}
            </p>
          </div>
        </div>

        {/* Conteúdo das Localizações */}
        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600 text-sm">Carregando localizações...</p>
            </div>
          ) : estoques.filter(estoque => 
            estoque.quantidade != null && 
            !isNaN(Number(estoque.quantidade)) && 
            Number(estoque.quantidade) > 0
          ).length > 0 ? (
            estoques.filter(estoque => 
              estoque.quantidade != null && 
              !isNaN(Number(estoque.quantidade)) && 
              Number(estoque.quantidade) > 0
            ).map((estoque) => (
              <div key={estoque._id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 min-w-0">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-base text-gray-600 flex-shrink-0">Localização:</span>
                    <span className="text-base font-semibold text-gray-900 truncate" title={estoque.localizacao.nome}>{estoque.localizacao.nome}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-base text-gray-600 flex-shrink-0">Quantidade:</span>
                    <span className="text-base font-semibold text-gray-900">{estoque.quantidade}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma localização encontrada para este componente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}