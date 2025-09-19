"use client"

import ComponenteEletronico from "@/components/componente-eletronico";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import axios from "axios";

interface ComponenteEletronicoData {
  _id: string;
  nome: string;
  quantidade: number;
  estoque_minimo: number;
  valor_unitario: number;
  descricao: string;
  imagem: string;
  localizacao: {
    _id: string;
    nome: string;
    usuario: string;
    __v: number;
  };
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

interface ApiResponse {
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

interface LoginResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    user: {
      accesstoken: string;
      refreshtoken: string;
      _id: string;
      nome: string;
      email: string;
      ativo: boolean;
      permissoes: any[];
      grupos: string[];
    };
  };
  errors: any[];
}

export default function ComponentesPage() {
  const [componentes, setComponentes] = useState<ComponenteEletronicoData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    console.log("Edit clicked for component:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete clicked for component:", id);
  };

  async function login() {
    try {
      const response = await axios.post('http://localhost:3010/login', {
        email: "admin@admin.com",
        senha: "Senha@123"
      });
      
      const responseData = response.data as any;
      const token = responseData.data?.user?.accesstoken || responseData.accessToken || responseData.access_token || responseData.token || responseData.data?.accessToken || responseData.data?.access_token || responseData.data?.token;
      
      if (!token) {
        setErro("Token não encontrado na resposta do login");
        return null;
      }
      
      setAccessToken(token);
      return token;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Erro no login:", err.response?.data);
      }
      setErro("Erro ao fazer login: " + ((err as Error)?.message ?? String(err)));
      return null;
    }
  }

  async function fetchComponentes(token?: string) {
    setLoading(true);
    setErro(null);

    try {
      // Se não tiver token, fazer login primeiro
      let authToken = token || accessToken;
      if (!authToken) {
        authToken = await login();
        if (!authToken) {
          setLoading(false);
          return;
        }
      }

      const response = await axios.get<ApiResponse>(
        'http://localhost:3010/componentes',
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      setComponentes(response.data.data.docs);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // Token expirado, tentar fazer login novamente
        const newToken = await login();
        if (newToken) {
          // Tentar novamente com o novo token
          await fetchComponentes(newToken);
          return;
        }
      }
      setErro((err as Error)?.message ?? String(err));
    }

    setLoading(false);
  }

  // Carregar componentes ao montar o componente
  useEffect(() => {
    fetchComponentes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Componentes Eletrônicos</h1>
        <Button onClick={() => fetchComponentes()}>
          Atualizar Lista
        </Button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Quantidade de componentes: {componentes.length}
        {accessToken && <span className="ml-4 text-green-600">✓ Autenticado</span>}
      </div>

      {erro && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {erro}
        </div>
      )}

      {componentes.length > 0 ? (
        <>
          {console.log("✅ Renderizando", componentes.length, "componentes")}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {componentes.map((componente) => (
              <ComponenteEletronico
                key={componente._id}
                id={componente._id}
                nome={componente.nome}
                categoria={componente.categoria.nome}
                quantidade={componente.quantidade}
                localizacao={componente.localizacao.nome}
                emEstoque={componente.status === "Em Estoque"}
                imagem={componente.imagem}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <>
            {console.log("❌ Nenhum componente encontrado. Loading:", loading, "Componentes length:", componentes.length)}
            <div className="text-center py-12 text-gray-500">
              Não há componentes cadastrados...
            </div>
          </>
        )
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <BarLoader
            color="#000"
            loading={loading}
            aria-label="Carregando componentes..."
          />
        </div>
      )}
    </div>
  );
}