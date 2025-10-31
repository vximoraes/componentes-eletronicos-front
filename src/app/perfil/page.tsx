"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, Mail, Pencil, User as UserIcon } from "lucide-react";
import Cabecalho from "@/components/cabecalho";

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1">
        <Cabecalho pagina="Perfil" descricao="Informações do usuário" />
         

        <div className="container mx-auto px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna esquerda - perfil maior */}
            <aside className="col-span-1">
              <div className="p-8 bg-white rounded-lg shadow-sm h-full flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-4xl text-white font-bold">
                  <Image src="/avatar.png" alt="avatar" width={128} height={128} className="object-cover" />
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-2xl font-semibold">Nome do Usuário</h2>
                  <p className="text-sm text-gray-500 mt-1">Descrição personalizada</p>
                </div>

                <button className="mt-4 flex items-center space-x-2 w-full justify-center text-blue-600 border border-blue-600 rounded-md py-2 px-4 hover:bg-blue-50">
                  <Pencil className="w-4 h-4" />
                  <span>Editar perfil</span>
                </button>

                <div className="w-full border-t border-gray-200 my-6"></div>

                <div className="w-full text-sm text-gray-600 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Cadastrado em</span>
                    </div>
                    <div className="font-medium">18/09/2025</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Último acesso</span>
                    </div>
                    <div className="font-medium">Hoje, 22:29</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Coluna direita - informações e estatísticas */}
            <section className="col-span-2 space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Informações pessoais</h3>
                <div className="w-full border-t border-gray-200 my-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="flex items-start space-x-4">
                    <UserIcon className="w-5 h-5 text-gray-500 mt-1" />
                    <div className="w-full">
                      <div className="text-sm text-gray-500">Nome</div>
                      <div className="font-medium">Nome do Usuário</div>
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="flex items-start space-x-4">
                    <Mail className="w-5 h-5 text-gray-500 mt-1" />
                    <div className="w-full">
                      <div className="text-sm text-gray-500">E-mail</div>
                      <div className="font-medium">admin@admin.com</div>
                    </div>
                  </div>

                  {/* Descrição personalizada */}
                  <div className="flex items-start space-x-4 md:col-span-2">
                    <Image src="/descricao.png" alt="Descrição" width={20} height={20} />
                    <div className="w-full">
                      <div className="text-sm text-gray-500">Descrição</div>
                      <div className="font-medium">Descrição personalizada</div>
                    </div>
                  </div>

                  {/* Senha com toggle */}
                  <div className="flex items-start space-x-4 md:col-span-2">
                    <Image src="/senha.png" alt="Descrição" width={20} height={20} />
                    <div className="w-full">
                      <div className="text-sm text-gray-500">Senha</div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{showPassword ? "Senha@123" : "*********"}</div>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de estatísticas */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Estatísticas de uso</h3>
                    <span className="text-sm text-gray-500">Semanal</span>
                  </div>
                </div>
                <div className="w-full border-t border-gray-200 my-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-6 bg-gray-100 rounded-lg shadow-sm">
                    <div className="text-4xl font-bold text-blue-600">42</div>
                    <div className="text-sm text-gray-600 mt-2">Componentes registrados</div>
                  </div>
                  <div className="text-center p-6 bg-gray-100 rounded-lg shadow-sm">
                    <div className="text-4xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-600 mt-2">Componentes removidos</div>
                  </div>
                  <div className="text-center p-6 bg-gray-100 rounded-lg shadow-sm">
                    <div className="text-4xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600 mt-2">Orçamentos criados</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
