"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cabecalho from "@/components/cabecalho"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/fetchData'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AdicionarFornecedorPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [url, setUrl] = useState('')
  const [contato, setContato] = useState('')
  const [descricao, setDescricao] = useState('')
  const [errors, setErrors] = useState<{ nome?: string; contato?: string; url?: string }>({})
  const queryClient = useQueryClient()

  const createFornecedorMutation = useMutation({
    mutationFn: async (data: any) => {
      return await post('/fornecedores', data)
    },
    onSuccess: (data: any) => {
      queryClient.resetQueries({ queryKey: ['fornecedores'] })
      const fornecedorId = data.data?._id || data._id
      router.push(`/fornecedores?success=created&id=${fornecedorId}`)
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar fornecedor: ${error?.response?.data?.message || error.message}`, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { nome?: string; contato?: string; url?: string } = {}

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (url.trim() && !isValidUrl(url)) {
      newErrors.url = 'URL inválida'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const fornecedorData: any = {
      nome: nome.trim(),
    }

    if (contato.trim()) {
      fornecedorData.contato = contato.trim()
    }

    if (url.trim()) {
      fornecedorData.url = url.trim()
    }

    if (descricao.trim()) {
      fornecedorData.descricao = descricao.trim()
    }

    createFornecedorMutation.mutate(fornecedorData)
  }

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleCancel = () => {
    router.push('/fornecedores')
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Cabecalho pagina="Fornecedores" acao="Adicionar" />

      <div className="flex-1 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6 flex flex-col overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-3 sm:p-4 md:p-8 flex flex-col gap-3 sm:gap-3 sm:gap-4 md:gap-6 overflow-y-auto">
              {/* Grid de 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Nome */}
                <div>
                  <Label htmlFor="nome" className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Nome do fornecedor"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (errors.nome) {
                        setErrors(prev => ({ ...prev, nome: undefined }))
                      }
                    }}
                    className={`w-full !px-3 sm:!px-4 !h-auto !min-h-[38px] sm:!min-h-[46px] text-sm sm:text-base ${errors.nome ? '!border-red-500' : ''}`}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nome}</p>
                  )}
                </div>

                {/* URL */}
                <div>
                  <Label htmlFor="url" className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                    URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://exemplo.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (errors.url) {
                        setErrors(prev => ({ ...prev, url: undefined }))
                      }
                    }}
                    className={`w-full !px-3 sm:!px-4 !h-auto !min-h-[38px] sm:!min-h-[46px] text-sm sm:text-base ${errors.url ? '!border-red-500' : ''}`}
                  />
                  {errors.url && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.url}</p>
                  )}
                </div>
              </div>

              {/* Contato - largura total */}
              <div>
                <Label htmlFor="contato" className="text-sm md:text-base font-medium text-gray-900 mb-2 block">
                  Contato
                </Label>
                <Input
                  id="contato"
                  type="text"
                  placeholder="email@exemplo.com ou telefone"
                  value={contato}
                  onChange={(e) => {
                    setContato(e.target.value)
                    if (errors.contato) {
                      setErrors(prev => ({ ...prev, contato: undefined }))
                    }
                  }}
                  className={`w-full !px-3 sm:!px-4 !h-auto !min-h-[38px] sm:!min-h-[46px] text-sm sm:text-base ${errors.contato ? '!border-red-500' : ''}`}
                />
                {errors.contato && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contato}</p>
                )}
              </div>

              {/* Descrição - largura total */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="descricao" className="text-sm md:text-base font-medium text-gray-900">
                    Descrição
                  </Label>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {descricao.length}/200
                  </span>
                </div>
                <textarea
                  id="descricao"
                  placeholder="Breve descrição do fornecedor..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  maxLength={200}
                  className="w-full flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
                />
              </div>
            </div>

            {/* Footer com botões */}
            <div className="flex justify-end gap-2 sm:gap-3 px-4 md:px-8 py-3 sm:py-4 border-t bg-gray-50 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="min-w-[80px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base px-3 sm:px-4"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="min-w-[80px] sm:min-w-[120px] text-white cursor-pointer hover:opacity-90 text-sm sm:text-base px-3 sm:px-4"
                style={{ backgroundColor: '#306FCC' }}
                disabled={createFornecedorMutation.isPending}
              >
                {createFornecedorMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable={false}
        transition={Slide}
      />
    </div>
  )
}
