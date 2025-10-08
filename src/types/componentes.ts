export interface ComponenteEletronicoData {
  _id: string;
  nome: string;
  quantidade: number;
  estoque_minimo: number;
  descricao: string;
  imagem: string;
  categoria: {
    _id: string;
    nome: string;
    usuario: string;
    __v: number;
  };
  ativo: boolean;
  usuario: string;
  status: string;
  __v: number;
}

export interface ApiResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    docs: ComponenteEletronicoData[];
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