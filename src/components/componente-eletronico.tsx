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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 w-full max-w-[380px] min-w-[280px] h-[200px] flex flex-col">
      {/* Header com imagem e ações */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          {/* Ícone/Imagem do componente */}
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden">
            {imagem ? (
              <img 
                src={imagem} 
                alt={nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            )}
          </div>
          
          {/* Nome e categoria */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 leading-tight truncate max-w-[150px]" title={nome}>
              {nome}
            </h3>
            <p className="text-sm text-gray-500 truncate max-w-[150px]" title={categoria}>
              {categoria}
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            title="Editar"
          >
            <Edit size={22} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-900 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
            title="Excluir"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="flex-1 flex items-center">
        <hr className="border-gray-200 w-full" />
      </div>

      {/* Informações de quantidade e localização */}
      <div className="flex items-center justify-between">
        {/* Quantidade à esquerda */}
        <div className="flex items-center text-18 text-gray-600">
          <span>
            <span className="font-semibold">Qtd:</span> {quantidade}
          </span>
        </div>

        {/* Status ao meio */}
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center justify-center px-4 py-2 rounded-[5px] text-sm font-medium min-w-[110px] text-center ${
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
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md" disabled>
            <ArrowDownCircle size={22} className="text-green-600" />
          </button>
          <button className="p-2 rounded-md" disabled>
            <ArrowUpCircle size={22} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
