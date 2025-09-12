"use client"

import { useState } from "react";
import LogoEi from "@/components/logo-ei";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex">
      <LogoEi></LogoEi>
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center text-3xl font-bold">Bem-vindo!</h2>
          <div>
            <Label className="pb-2" htmlFor="email">Email</Label>
            <Input className="p-5 w-full" type="email" id="email" placeholder="Email" />
          </div>
          <div className="pt-4">
            <Label className="pb-2" htmlFor="senha">Senha</Label>
            <div className="relative">
              <Input className="p-5 w-full pr-12" type={showPassword ? "text" : "password"} id="senha" placeholder="Senha"/>
              <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                {showPassword ? (
                  <img src="eye.png" alt="" className="w-5 h-5 opacity-60" />
                ) : (
                  <img src="eye-off.png" alt="" className="w-5 h-5 opacity-60" />
                )}
              </button>
            </div>
          </div>
          <p className="mt-3 text-zinc-600 text-base underline">Esqueci minha senha</p>
          <div className="mt-6">
            <Button type="submit" className="p-5 w-full bg-[#306FCC] hover:bg-[#2557a7] transition-colors duration-500">Entrar</Button>
          </div>
          <p className="mt-6 text-center">Não tem uma conta?{" "} <span className="text-[#306FCC] hover:text-[#2557a7] underline cursor-pointer" onClick={() => window.location.href = "/cadastro"}>Cadastrar-se</span>
          </p>
        </div>
      </div>
    </div>
  )
}