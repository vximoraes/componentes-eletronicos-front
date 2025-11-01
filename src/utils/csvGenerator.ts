import { EstoqueData } from '@/types/componentes';

interface CSVGeneratorOptions {
  estoques: EstoqueData[];
  fileName?: string;
  includeStats?: boolean;
}

export const generateComponentesCSV = ({
  estoques,
  fileName = 'relatorio-componentes',
  includeStats = true,
}: CSVGeneratorOptions) => {
  // Preparar dados
  const lines: string[] = [];

  // ==================== CABEÇALHO ====================
  lines.push('RELATÓRIO DE COMPONENTES');
  lines.push(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`);
  lines.push('');

  // ==================== ESTATÍSTICAS ====================
  if (includeStats && estoques.length > 0) {
    const totalComponentes = new Set(estoques.map(e => e.componente._id)).size;
    const emEstoque = estoques.filter(e => e.componente.status === 'Em Estoque').length;
    const baixoEstoque = estoques.filter(e => e.componente.status === 'Baixo Estoque').length;
    const indisponiveis = estoques.filter(e => e.componente.status === 'Indisponível').length;
    const quantidadeTotal = estoques.reduce((acc, e) => acc + e.quantidade, 0);

    lines.push('RESUMO ESTATÍSTICO');
    lines.push(`Total de Componentes Únicos,${totalComponentes}`);
    lines.push(`Total de Itens em Estoque,${quantidadeTotal}`);
    lines.push(`Em Estoque,${emEstoque}`);
    lines.push(`Baixo Estoque,${baixoEstoque}`);
    lines.push(`Indisponíveis,${indisponiveis}`);
    lines.push('');
  }

  // ==================== TABELA DE COMPONENTES ====================
  lines.push('COMPONENTES SELECIONADOS');
  
  // Cabeçalho da tabela
  const headers = [
    'CÓDIGO',
    'PRODUTO',
    'DESCRIÇÃO',
    'CATEGORIA',
    'QUANTIDADE',
    'ESTOQUE MÍNIMO',
    'STATUS',
    'LOCALIZAÇÃO',
    'DATA CRIAÇÃO',
    'ÚLTIMA ATUALIZAÇÃO'
  ];
  lines.push(headers.join(','));

  // Dados da tabela
  estoques.forEach((estoque) => {
    const row = [
      // Código completo
      `"${estoque.componente._id}"`,
      
      // Nome do produto (escapar vírgulas e aspas)
      `"${escapeCSV(estoque.componente.nome)}"`,
      
      // Descrição
      `"${escapeCSV(estoque.componente.descricao || '-')}"`,
      
      // Categoria (se for string, usar diretamente, se for objeto, pegar o ID)
      `"${typeof estoque.componente.categoria === 'string' 
        ? estoque.componente.categoria 
        : estoque.componente.categoria}"`,
      
      // Quantidade
      estoque.quantidade.toString(),
      
      // Estoque mínimo
      estoque.componente.estoque_minimo.toString(),
      
      // Status
      `"${estoque.componente.status}"`,
      
      // Localização
      `"${escapeCSV(estoque.localizacao.nome)}"`,
      
      // Data de criação
      `"${formatDate(estoque.createdAt)}"`,
      
      // Data de atualização
      `"${formatDate(estoque.updatedAt)}"`
    ];
    
    lines.push(row.join(','));
  });

  // Adicionar rodapé
  lines.push('');
  lines.push(`Total de registros exportados: ${estoques.length}`);
  lines.push('Estoque Inteligente - Sistema de Gerenciamento');

  // Converter para CSV e fazer download
  const csvContent = lines.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${sanitizedFileName}-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Função auxiliar para escapar caracteres especiais no CSV
const escapeCSV = (text: string): string => {
  if (!text) return '';
  
  // Substituir aspas duplas por aspas duplas escapadas
  let escaped = text.replace(/"/g, '""');
  
  // Remover quebras de linha
  escaped = escaped.replace(/\n/g, ' ').replace(/\r/g, '');
  
  return escaped;
};

// Função auxiliar para formatar datas
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};
