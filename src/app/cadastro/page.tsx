"use client"

import { useState } from "react";
import LogoEi from "@/components/logo-ei";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
      <div className="min-h-screen flex">
        <LogoEi></LogoEi>
        <div className="w-full md:w-1/2 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <h2 className="mb-10 text-center text-3xl font-bold">Cadastre-se!</h2>
            <div>
              <Label className="pb-2" htmlFor="nome">Nome</Label>
              <Input className="p-5 w-full" type="text" id="nome" placeholder="Insira seu nome completo" />
            </div>
            <div className="pt-4">
              <Label className="pb-2" htmlFor="email">E-mail</Label>
              <Input className="p-5 w-full" type="email" id="email" placeholder="Insira seu endereço de e-mail" />
            </div>
            <div className="pt-4">
              <Label className="pb-2" htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input className="p-5 w-full pr-12" type={showPassword ? "text" : "password"} id="senha" placeholder="Insira sua senha"/>
                <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer">
                  {showPassword ? (
                    <img src="eye.png" alt="" className="w-5 h-5 opacity-60" />
                  ) : (
                    <img src="eye-off.png" alt="" className="w-5 h-5 opacity-60" />
                  )}
                </button>
              </div>
            </div>
            <div className="pt-4">
              <Label className="pb-2" htmlFor="confirmarSenha">Repetir Senha</Label>
              <div className="relative">
                <Input className="p-5 w-full pr-12" type={showConfirmPassword ? "text" : "password"} id="confirmarSenha" placeholder="Confirme sua senha"/>
                <button type="button" aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer">
                  {showConfirmPassword ? (
                    <img src="eye.png" alt="" className="w-5 h-5 opacity-60" />
                  ) : (
                    <img src="eye-off.png" alt="" className="w-5 h-5 opacity-60" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" className="p-5 w-full bg-[#306FCC] hover:bg-[#2557a7] transition-colors duration-500 cursor-pointer">Cadastrar</Button>
            </div>
            <p className="mt-6 text-center">Já tem uma conta?{" "} <span className="text-[#306FCC] hover:text-[#2557a7] underline cursor-pointer" onClick={() => window.location.href = "/login"}>Entrar</span>
            </p>
          </div>
        </div>
      </div>
    )
}