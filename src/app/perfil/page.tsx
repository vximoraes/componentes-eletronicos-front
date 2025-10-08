import Image from "next/image";
import { Bell, Calendar, Clock, Key, Mail, Pencil, User as UserIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Perfil</h1>
            <span className="text-sm text-gray-500">Informações do usuário</span>
          </div>

          {/*notificação (adicionar depois para estar implementando as notificações */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-500 cursor-pointer" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 bg-red-500 text-white rounded-full text-xs">
              1
            </span>
          </div>
        </header>

        <div className="flex gap-8">
          {/* Informações do usuário*/}
          <div className="w-80 p-6 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center space-y-4">
              
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Image src="/avatar.png" alt="avatar" width={96} height={96} />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">Nome do Usuário</h2>
                <p className="text-sm text-gray-500">Descrição personalizada</p>
              </div>
              <button className="flex items-center space-x-2 w-full justify-center text-blue-600 border border-blue-600 rounded-md py-2 px-4 hover:bg-blue-50">
                <Pencil className="w-4 h-4" />
                <span>Editar perfil</span>
              </button>
              <div className="w-full border-t border-gray-200 my-4"></div>
              <div className="space-y-2 text-sm text-gray-600 w-full">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Cadastrado em</span>
                  <span>18/09/2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Último acesso</span>
                  <span>Hoje, 22:29</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informações pessoais*/}
          <div className="flex-1 space-y-8">
         
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Informações pessoais</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Nome</div>
                    <div className="font-medium">Nome do Usuário</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Descrição personalizada</div>
                    <div className="font-medium">Texto da descrição</div> {/* ← Aqui estava faltando */}
                  </div>
               </div>

                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">E-mail</div>
                    <div className="font-medium">usuario@email.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Key className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Senha</div>
                    <div className="font-medium">*********</div>
                    {/* Implementar funcionalidade de mostras senha*/}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de estatísticas */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold">Estatísticas de uso</h3>
              <span className="text-sm text-gray-500">Semanal</span>
              <div className="flex justify-between mt-4">
                <div className="text-center w-1/3 p-4 bg-gray-100 rounded-lg shadow-sm border border-blue-500">
                  <div className="text-4xl font-bold text-blue-600">42</div>
                  <div className="text-sm text-gray-600 mt-2">Componentes registrados</div>
                </div>
                <div className="text-center w-1/3 p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="text-4xl font-bold text-gray-600">8</div>
                  <div className="text-sm text-gray-600 mt-2">Componentes removidos</div>
                </div>
                <div className="text-center w-1/3 p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="text-4xl font-bold text-gray-600">3</div>
                  <div className="text-sm text-gray-600 mt-2">Orçamentos criados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

{/* Verificar a questão das notificações, blocos de estatisticas, questão da senha e a descrição personalizada nas informações */}