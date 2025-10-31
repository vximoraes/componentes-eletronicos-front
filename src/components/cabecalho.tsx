"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Bell } from "lucide-react";

interface CabecalhoProps {
  pagina: string;
  descricao?: string;
  usuarioId?: string; // ID do usuário logado (usado para buscar notificações)
}

export default function Cabecalho({ pagina, descricao, usuarioId }: CabecalhoProps) {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Função para buscar notificações da API
  useEffect(() => {
    if (!usuarioId) return;

    async function carregarNotificacoes() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notificacoes/${usuarioId}`);
        setNotificacoes(res.data);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarNotificacoes();
  }, [usuarioId]);

  // Conta quantas não foram lidas
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
      {/* Esquerda - título e descrição */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{pagina}</h1>
        {descricao && <p className="text-sm text-gray-500">{descricao}</p>}
      </div>

      {/* Direita - notificações e avatar */}
      <div className="flex items-center space-x-6 relative">
        {/* 🔔 Sino de Notificações */}
        <div className="relative">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="relative w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Bell className="w-[22px] h-[22px] text-gray-700" />
            {naoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {naoLidas}
              </span>
            )}
          </button>

          {/* Dropdown de notificações */}
          {menuAberto && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Notificações</h3>
                {carregando && <span className="text-xs text-gray-500">Carregando...</span>}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notificacoes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">Nenhuma notificação</p>
                ) : (
                  notificacoes.map((n) => (
                    <div
                      key={n._id}
                      className={`py-2 border-b last:border-none cursor-pointer hover:bg-gray-50 rounded px-2 ${
                        n.lida ? "text-gray-600" : "text-gray-800 font-medium"
                      }`}
                    >
                      <p>{n.titulo}</p>
                      <p className="text-sm text-gray-500">{n.mensagem}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.dataCriacao).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center space-x-2">
          <Image
            src="/avatar.png"
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span className="text-gray-700 font-medium">Usuário</span>
        </div>
      </div>
    </header>
  );
}
