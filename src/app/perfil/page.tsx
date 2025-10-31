"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, Mail, Pencil, X, User as UserIcon } from "lucide-react"
import Cabecalho from "@/components/cabecalho"

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [userData, setUserData] = useState({
    nome: "Nome do Usuário",
    email: "admin@admin.com",
    descricao: "Descrição personalizada",
    senha: "Senha@123",
  })

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    setIsEditing(false)
    alert("Perfil atualizado com sucesso!")
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1">
        {/* Cabeçalho */}
        <Cabecalho pagina="Perfil" descricao="Informações do usuário" />

        {/* Conteúdo principal */}
        <div className="container mx-auto px-6 pb-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lado esquerdo */}
            <aside className="col-span-1">
              <div className="p-8 bg-white rounded-lg shadow-sm h-full flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-4xl text-white font-bold">
                  <Image src="/avatar.png" alt="avatar" width={128} height={128} className="object-cover" />
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-2xl font-semibold">{userData.nome}</h2>
                  <p className="text-sm text-gray-500 mt-1">{userData.descricao}</p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 flex items-center space-x-2 w-full justify-center text-blue-600 border border-blue-600 rounded-md py-2 px-4 hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar perfil</span>
                </button>

                <div className="w-full border-t border-gray-200 my-6"></div>

                <div className="w-full text-sm text-gray-600 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Cadastrado em</span>
                    </div>
                    <div className="font-medium">18/09/2025</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Último acesso</span>
                    </div>
                    <div className="font-medium">Hoje, 22:29</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Lado direito - informações */}
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
                      <div className="font-medium">{userData.nome}</div>
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="flex items-start space-x-4">
                    <Mail className="w-5 h-5 text-gray-500 mt-1" />
                    <div className="w-full">
                      <div className="text-sm text-gray-500">E-mail</div>
                      <div className="font-medium">{userData.email}</div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="flex items-start space-x-4 md:col-span-2">
                    <Image src="/descricao.png" alt="Descrição" width={20} height={20} />
                    <div className="w-full">
                      <div className="text-sm text-gray-500">Descrição</div>
                      <div className="font-medium">{userData.descricao}</div>
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="flex items-start space-x-4 md:col-span-2">
                    <Image src="/senha.png" alt="Descrição" width={20} height={20} />
                    <div className="w-full">
                      <div className="text-sm text-gray-500">Senha</div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {showPassword ? userData.senha : "*********"}
                        </div>
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
            </section>
          </div>
        </div>
      </main>

      {/* Modal de edição */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Nome</label>
                <input
                  type="text"
                  value={userData.nome}
                  onChange={e => setUserData({ ...userData, nome: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500">E-mail</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={e => setUserData({ ...userData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500">Descrição</label>
                <textarea
                  value={userData.descricao}
                  onChange={e => setUserData({ ...userData, descricao: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Salvar alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
