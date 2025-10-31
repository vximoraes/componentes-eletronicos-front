"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast, ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LogoEi from "@/components/logo-ei"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Por favor, insira seu e-mail.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/recover`,
        { email }
      )

      if (response.data.error === false) {
        setEmailEnviado(true)
        toast.success("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data

        toast.error(errorData.message || "Erro ao solicitar recuperação de senha.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        })
      } else {
        toast.error("Ocorreu um erro inesperado. Tente novamente.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      <LogoEi />
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center text-[#306FCC] hover:text-[#2557a7] transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Voltar para o login
            </Link>
          </div>

          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              {emailEnviado ? "E-mail Enviado!" : "Esqueceu sua senha?"}
            </h2>
            <p className="text-zinc-600 text-sm md:text-base mt-2">
              {emailEnviado
                ? "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha."
                : "Não se preocupe, enviaremos instruções para redefinir sua senha."
              }
            </p>
          </div>

          {!emailEnviado ? (
            <form onSubmit={handleSubmit}>
              <div>
                <Label className="pb-2 text-sm md:text-base" htmlFor="email">
                  E-mail<span className="text-red-500">*</span>
                </Label>
                <Input
                  className="p-3 md:p-5 w-full text-sm md:text-base"
                  type="email"
                  id="email"
                  placeholder="Insira seu endereço de e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mt-4 md:mt-6">
                <Button
                  type="submit"
                  className="p-3 md:p-5 w-full bg-[#306FCC] hover:bg-[#2557a7] transition-colors duration-500 cursor-pointer text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm md:text-base text-center">
                  ✓ Um e-mail foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
                </p>
              </div>

              <div className="text-center">
                <p className="text-zinc-600 text-sm md:text-base mb-4">
                  Não recebeu o e-mail?
                </p>
                <Button
                  onClick={() => {
                    setEmailEnviado(false)
                    setEmail("")
                  }}
                  variant="outline"
                  className="text-sm md:text-base"
                >
                  Tentar novamente
                </Button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-[#306FCC] hover:text-[#2557a7] underline text-sm md:text-base"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
