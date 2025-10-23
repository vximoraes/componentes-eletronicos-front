"use client"
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ExternalLink, Copy, Check } from 'lucide-react'
import api from '@/lib/api'
import { Fornecedor } from '@/types/fornecedores'

interface ModalDetalhesFornecedorProps {
  isOpen: boolean
  onClose: () => void
  fornecedorId: string
}

export default function ModalDetalhesFornecedor({
  isOpen,
  onClose,
  fornecedorId
}: ModalDetalhesFornecedorProps) {
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && fornecedorId) {
      loadFornecedor()
    }
  }, [isOpen, fornecedorId])

  const loadFornecedor = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get(`/fornecedores/${fornecedorId}`)
      setFornecedor(response.data.data)
    } catch (err: any) {
      console.error('Erro ao carregar fornecedor:', err)
      setError(err?.response?.data?.message || 'Erro ao carregar dados do fornecedor')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleClose = () => {
    setFornecedor(null)
    setError(null)
    setCopiedField(null)
    onClose()
  }

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const modalContent = (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4"
      style={{
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="Fechar"
          >
            <X size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Detalhes do Fornecedor
            </h2>
          </div>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">

          {/* Mensagem de erro */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              <div className="font-medium mb-1">Não foi possível carregar o fornecedor</div>
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
              </div>
            </div>
          ) : fornecedor ? (
            <div className="space-y-4 text-left">
              {/* Nome */}
              <div>
                <label className="text-lg font-semibold text-gray-900 block mb-2">
                  Nome
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-900 truncate flex-1" title={fornecedor.nome}>
                    {fornecedor.nome || '-'}
                  </p>
                  {fornecedor.nome && (
                    <button
                      onClick={() => handleCopy(fornecedor.nome, 'nome')}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0 cursor-pointer"
                      title="Copiar nome"
                    >
                      {copiedField === 'nome' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="text-lg font-semibold text-gray-900 block mb-2">
                  URL
                </label>
                {fornecedor.url ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={fornecedor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 flex-1 min-w-0"
                      title={fornecedor.url}
                    >
                      <span className="truncate">{fornecedor.url}</span>
                      <ExternalLink size={16} className="flex-shrink-0" />
                    </a>
                    <button
                      onClick={() => handleCopy(fornecedor.url!, 'url')}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0 cursor-pointer"
                      title="Copiar URL"
                    >
                      {copiedField === 'url' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                ) : (
                  <p className="text-base text-gray-900">-</p>
                )}
              </div>

              {/* Contato */}
              <div>
                <label className="text-lg font-semibold text-gray-900 block mb-2">
                  Contato
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-900 truncate flex-1" title={fornecedor.contato}>
                    {fornecedor.contato || '-'}
                  </p>
                  {fornecedor.contato && (
                    <button
                      onClick={() => handleCopy(fornecedor.contato!, 'contato')}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0 cursor-pointer"
                      title="Copiar contato"
                    >
                      {copiedField === 'contato' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="text-lg font-semibold text-gray-900 block mb-2">
                  Descrição
                </label>
                {fornecedor.descricao ? (
                  <div className="flex items-start gap-2">
                    <p
                      className="text-base text-gray-900 whitespace-pre-wrap flex-1"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                      title={fornecedor.descricao}
                    >
                      {fornecedor.descricao}
                    </p>
                    <button
                      onClick={() => handleCopy(fornecedor.descricao!, 'descricao')}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0 cursor-pointer mt-0.5"
                      title="Copiar descrição"
                    >
                      {copiedField === 'descricao' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                ) : (
                  <p className="text-base text-gray-900">-</p>
                )}
              </div>

              {/* Datas */}
              {(fornecedor.createdAt || fornecedor.updatedAt) && (
                <div className="pt-4 border-t grid grid-cols-2 gap-4">
                  {fornecedor.createdAt && (
                    <div>
                      <label className="text-base font-medium text-gray-700 block mb-2">
                        Criado em
                      </label>
                      <p className="text-base text-gray-600">
                        {new Date(fornecedor.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                  {fornecedor.updatedAt && (
                    <div>
                      <label className="text-base font-medium text-gray-700 block mb-2">
                        Atualizado em
                      </label>
                      <p className="text-base text-gray-600">
                        {new Date(fornecedor.updatedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )

  return typeof window !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null
}
