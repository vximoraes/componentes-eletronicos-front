"use client"

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LogoEi from "@/components/logo-ei";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        senha,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha incorretos.");
      } else if (result?.ok) {
        router.push("/componentes");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <LogoEi></LogoEi>
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center text-3xl font-bold">Bem-vindo!</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <Label className="pb-2" htmlFor="email">E-mail</Label>
              <Input 
                className="p-5 w-full" 
                type="email" 
                id="email" 
                placeholder="Insira seu endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="pt-4">
              <Label className="pb-2" htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input 
                  className="p-5 w-full pr-12" 
                  type={showPassword ? "text" : "password"} 
                  id="senha" 
                  placeholder="Insira sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                />
                <button 
                  type="button" 
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} 
                  onClick={() => setShowPassword(v => !v)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  disabled={loading}
                >
                  {showPassword ? (
                    <img src="eye.png" alt="" className="w-5 h-5 opacity-60" />
                  ) : (
                    <img src="eye-off.png" alt="" className="w-5 h-5 opacity-60" />
                  )}
                </button>
              </div>
            </div>
            <p className="mt-3 text-zinc-600 text-base underline cursor-pointer">Esqueci minha senha</p>
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="mt-6">
              <Button 
                type="submit" 
                className="p-5 w-full bg-[#306FCC] hover:bg-[#2557a7] transition-colors duration-500 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            <p className="mt-6 text-center">
              Não tem uma conta?{" "} 
              <span 
                className="text-[#306FCC] hover:text-[#2557a7] underline cursor-pointer" 
                onClick={() => !loading && (window.location.href = "/cadastro")}
              >
                Cadastrar-se
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}