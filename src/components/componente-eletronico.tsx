import React from 'react';
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface ComponenteEletronicoProps {
  id?: string;
  nome: string;
  categoria: string;
  quantidade: number;
  estoqueMinimo?: number;
  status: string;
  imagem?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  onEntrada?: (id: string) => void;
  onSaida?: (id: string) => void;
  isLoading?: boolean;
  'data-test'?: string;
}

export default function ComponenteEletronico({
  id = '',
  nome,
  categoria,
  quantidade,
  estoqueMinimo,
  status,
  imagem,
  onEdit,
  onDelete,
  onClick,
  onEntrada,
  onSaida,
  isLoading = false,
  'data-test': dataTest
}: ComponenteEletronicoProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && id) {
      onEdit(id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && id) {
      onDelete(id);
    }
  };

  const handleEntrada = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEntrada && id) {
      onEntrada(id);
    }
  };

  const handleSaida = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaida && id) {
      onSaida(id);
    }
  };

  const handleClick = () => {
    if (onClick && id) {
      onClick(id);
    }
  };

  const componentTitle = `${nome} - ${categoria} - Qtd: ${quantidade} - Status: ${status}`;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-200 w-full h-full min-h-[180px] flex flex-col cursor-pointer relative"
      data-test={dataTest || `componente-${id}`}
      title={componentTitle}
      onClick={handleClick}
    >
      {/* Overlay de loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Atualizando...</p>
          </div>
        </div>
      )}
      {/* Header com imagem e ações */}
      <div className="flex items-start justify-between mb-2 gap-2" data-test="header">
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0" data-test="component-info">
          {/* Ícone/Imagem do componente */}
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" data-test="component-icon">
            {imagem ? (
              <img 
                src={imagem} 
                alt={nome}
                className="w-full h-full object-cover"
                title={`Imagem do componente: ${nome}`}
              />
            ) : (
              <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded" title="Ícone padrão do componente"></div>
            )}
          </div>
          
          {/* Nome e categoria */}
          <div className="flex-1 min-w-0 overflow-hidden" data-test="text-info">
            <h3 
              className="text-sm md:text-base font-semibold text-gray-900 leading-tight truncate max-w-full" 
              title={`${nome}`}
              data-test="component-name"
              style={{ 
                maxWidth: 'calc(100% - 0px)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {nome}
            </h3>
            <p 
              className="text-xs md:text-sm text-gray-500 truncate max-w-full" 
              title={`${categoria}`}
              data-test="component-category"
              style={{ 
                maxWidth: 'calc(100% - 0px)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {categoria}
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center space-x-1 flex-shrink-0" style={{ minWidth: '80px' }} data-test="action-buttons">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer"
            title={`Editar componente: ${nome}`}
            data-test="edit-button"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-900 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer"
            title={`Excluir componente: ${nome}`}
            data-test="delete-button"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="flex-1 flex items-center">
        <hr className="border-gray-200 w-full" />
      </div>

      {/* Informações de quantidade e localização */}
      <div className="flex items-center justify-between gap-2" data-test="footer">
        {/* Quantidade à esquerda */}
        <div className="flex flex-col text-xs md:text-sm text-gray-600 flex-shrink-0" data-test="quantity">
          <span title={`Quantidade em estoque: ${quantidade} unidades`}>
            <span className="font-semibold">Qtd:</span> {quantidade}
          </span>
          {estoqueMinimo !== undefined && (
            <span className="mt-0.5" title={`Estoque mínimo: ${estoqueMinimo} unidades`}>
              <span className="font-semibold">Mín:</span> {estoqueMinimo}
            </span>
          )}
        </div>

        {/* Status ao meio */}
        <div className="flex justify-center flex-1 min-w-0" data-test="status-container">
          <span
            className={`inline-flex items-center justify-center px-2 md:px-4 py-1 md:py-2 rounded-[5px] text-xs md:text-sm font-medium min-w-[80px] md:min-w-[110px] text-center truncate ${
            status === 'Em Estoque'
              ? 'bg-green-100 text-green-800'
              : status === 'Baixo Estoque'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }`}
            title={`Status atual: ${status}`}
            data-test="status-badge"
          >
            {status}
          </span>
        </div>

        {/* Ícones de entrada e saída alinhados com os botões de ação */}
        <div className="flex items-center space-x-1 flex-shrink-0" style={{ minWidth: '80px' }} data-test="movement-icons">
          <button 
            className="p-2 rounded-md flex-shrink-0 hover:bg-green-50 transition-colors duration-200 cursor-pointer" 
            title={`Registrar entrada de ${nome}`}
            data-test="entrada-icon"
            onClick={handleEntrada}
          >
            <ArrowDownCircle size={20} className="text-green-600 hover:text-green-700" />
          </button>
          <button 
            className={`p-2 rounded-md flex-shrink-0 transition-colors duration-200 ${
              quantidade === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-red-50 cursor-pointer'
            }`}
            title={quantidade === 0 ? `${nome} sem estoque disponível` : `Registrar saída de ${nome}`}
            data-test="saida-icon"
            onClick={quantidade === 0 ? undefined : handleSaida}
            disabled={quantidade === 0}
          >
            <ArrowUpCircle size={20} className={quantidade === 0 ? 'text-gray-400' : 'text-red-600 hover:text-red-700'} />
          </button>
        </div>
      </div>
    </div>
  );
}
