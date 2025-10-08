import React from 'react';
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface ComponenteEletronicoProps {
  id?: string;
  nome: string;
  categoria: string;
  quantidade: number;
  status: string;
  imagem?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ComponenteEletronico({
  id = '',
  nome,
  categoria,
  quantidade,
  status,
  imagem,
  onEdit,
  onDelete
}: ComponenteEletronicoProps) {
  const handleEdit = () => {
    if (onEdit && id) {
      onEdit(id);
    }
  };

  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-200 w-full h-full min-h-[180px] flex flex-col">
      {/* Header com imagem e ações */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
          {/* Ícone/Imagem do componente */}
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {imagem ? (
              <img 
                src={imagem} 
                alt={nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded"></div>
            )}
          </div>
          
          {/* Nome e categoria */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 
              className="text-sm md:text-base font-semibold text-gray-900 leading-tight truncate max-w-full" 
              title={nome}
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
              title={categoria}
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
        <div className="flex items-center space-x-1 flex-shrink-0" style={{ minWidth: '80px' }}>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex-shrink-0"
            title="Editar"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-900 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex-shrink-0"
            title="Excluir"
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
      <div className="flex items-center justify-between gap-2">
        {/* Quantidade à esquerda */}
        <div className="flex items-center text-xs md:text-sm text-gray-600 flex-shrink-0">
          <span>
            <span className="font-semibold">Qtd:</span> {quantidade}
          </span>
        </div>

        {/* Status ao meio */}
        <div className="flex justify-center flex-1 min-w-0">
          <span
            className={`inline-flex items-center justify-center px-2 md:px-4 py-1 md:py-2 rounded-[5px] text-xs md:text-sm font-medium min-w-[80px] md:min-w-[110px] text-center truncate ${
            status === 'Em Estoque'
              ? 'bg-green-100 text-green-800'
              : status === 'Baixo Estoque'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Ícones de entrada e saída alinhados com os botões de ação */}
        <div className="flex items-center space-x-1 flex-shrink-0" style={{ minWidth: '80px' }}>
          <button className="p-2 rounded-md flex-shrink-0" disabled>
            <ArrowDownCircle size={20} className="text-green-600" />
          </button>
          <button className="p-2 rounded-md flex-shrink-0" disabled>
            <ArrowUpCircle size={20} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
