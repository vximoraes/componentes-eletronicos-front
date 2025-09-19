"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Sidebar() {
  // controlar se a barra lateral está expandida-true ou  retraida-false
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col py-6 space-y-8
        bg-[#0C1226] border-r border-blue-500 text-gray-400
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64 items-start" : "w-20 items-center"}
      `}
    >
      {/* Botão para expandir ou retrair o menu*/}
      <button
        // Ao clicar, inverte o estado de isExpanded
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 p-1.5 rounded-full bg-blue-800 text-white shadow-lg z-50 focus:outline-none transition-transform duration-300"
      >
        <ChevronRight
          className={`w-4 h-4 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className={`flex items-center p-2 transition-all duration-400 ${isExpanded ? "w-full pl-6" : ""}`}>
        <Image src="/logo-icon.png" alt="Logo" width={60} height={50} />
        {/* logo e nome com menu expandido */}
        {isExpanded && (
          <span className="ml-4 text-sm font-semibold text-white transition-opacity duration-300">
            ESTOQUE INTELIGENTE
          </span>
        )}
      </div>

      <br></br>

      {/* Ícones de navegação */}
      <nav className={`flex-1 flex flex-col w-full space-y-4 ${isExpanded ? "pl-6" : "items-center"}`}>

        <div className={`group relative flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-all duration-300 ${isExpanded ? "" : "justify-center"}`}>
          <Image src="/componentes.png" alt="Componentes" width={35} height={30} />
          {isExpanded ? (
            <span className="ml-4 text-sm text-gray-400">
              Componentes
            </span>
          ) : (
            <span
              className="absolute left-full w-max ml-6 py-1 px-2 rounded-md bg-gray-900 shadow-lg invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              Componentes
            </span>
          )}
        </div>
        
        <br></br>
        
        
        <div className={`group relative flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-all duration-300 ${isExpanded ? "" : "justify-center"}`}>
          <Image src="/relatorios.png" alt="Relatórios" width={35} height={30} />
          {isExpanded ? (
            <span className="ml-4 text-sm text-gray-400">
              Relatórios
            </span>
          ) : (
            <span
              className="absolute left-full w-max ml-6 py-1 px-2 rounded-md bg-gray-900 shadow-lg invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              Relatórios
            </span>
          )}
        </div>

        <br></br>

        {/* Item "Orçamentos" */}
        <div className={`group relative flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-all duration-300 ${isExpanded ? "" : "justify-center"}`}>
          <Image src="/orcamentos.png" alt="Orçamentos" width={35} height={30} />
          {isExpanded ? (
            <span className="ml-4 text-sm text-gray-400">
              Orçamentos
            </span>
          ) : (
            <span
              className="absolute left-full w-max ml-6 py-1 px-2 rounded-md bg-gray-900 shadow-lg invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              Orçamentos
            </span>
          )}
        </div>
      </nav>

      {/* linha */}
      <div className="w-full border-t border-gray-700"></div>

      {/* Saída */}
      <div className={`group relative flex items-center p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-all duration-300 ${isExpanded ? "" : "justify-center"}`}>
        <Image src="/saida.png" alt="Sair" width={35} height={30} />
        {isExpanded ? (
          <span className="ml-4 text-sm text-gray-400">
            Sair
          </span>
        ) : (
          <span
            className="absolute left-full w-max ml-6 py-1 px-2 rounded-md bg-gray-900 shadow-lg invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            Sair
          </span>
        )}
      </div>
    </aside>
  );
}