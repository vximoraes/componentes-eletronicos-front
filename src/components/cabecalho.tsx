"use client"
import { useState } from "react"

export interface cabecalhoUser {
  pagina: string,
  acao?: string,
  fotoPerfil?: string
}

export default function Cabecalho({pagina, acao, fotoPerfil}:cabecalhoUser){
  const [isPerfil, setIsPerfil] = useState<boolean>(false)
return(
  <div className="flex justify-between w-[100%] p-[40px] pt-[70px]">
    <div className="flex items-center gap-[20px]">
      <span className="text-[32px] font-bold">{pagina}</span>
      <span className="text-[21px] text-[#6b7280]">{acao}</span>
    </div>
    <div className="flex gap-[20px]">
      <img src="sino.svg" alt="" />
      <img src="foto-default.svg" alt="" />
    </div>
  </div>
)
}