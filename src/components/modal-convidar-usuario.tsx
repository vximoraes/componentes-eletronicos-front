import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/lib/fetchData';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

interface ModalConvidarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ConvidarUsuarioRequest {
  nome: string;
  email: string;
}

export default function ModalConvidarUsuario({
  isOpen,
  onClose,
  onSuccess
}: ModalConvidarUsuarioProps) {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ nome?: string; email?: string }>({});

  const convidarMutation = useMutation({
    mutationFn: async (data: ConvidarUsuarioRequest) => {
      return await post('/usuarios/convidar', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['usuarios']
      });

      toast.success('Convite enviado com sucesso!', {
        position: 'bottom-right',
        autoClose: 3000,
      });

      setNome('');
      setEmail('');
      setErrors({});
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      console.error('Erro ao enviar convite:', error);

      if (error?.response?.data) {
        const errorData = error.response.data;

        if (errorData.errors && Array.isArray(errorData.errors)) {
          const newErrors: { nome?: string; email?: string } = {};
          errorData.errors.forEach((err: { path: string; message: string }) => {
            if (err.path === 'nome') {
              newErrors.nome = err.message;
            } else if (err.path === 'email') {
              newErrors.email = err.message;
            }
          });
          setErrors(newErrors);
        }
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setNome('');
      setEmail('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors: { nome?: string; email?: string } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    convidarMutation.mutate({
      nome: nome.trim(),
      email: email.trim()
    });
  };

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
        className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-visible animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="px-6 pb-6 space-y-6">
          <div className="text-center pt-4 px-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Convidar Usuário
            </h2>
            <p className="text-gray-600 text-sm">
              Preencha os dados para enviar um convite por e-mail
            </p>
          </div>

          {/* Campo Nome */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="nome" className="block text-base font-medium text-gray-700">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-gray-500">
                {nome.length}/100
              </span>
            </div>
            <input
              id="nome"
              type="text"
              placeholder="Digite o nome completo"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (errors.nome) {
                  setErrors(prev => ({ ...prev, nome: undefined }));
                }
              }}
              maxLength={100}
              className={`w-full px-4 py-3 bg-white border rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${errors.nome ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={convidarMutation.isPending}
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Campo E-mail */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="email" className="block text-base font-medium text-gray-700">
                E-mail <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-gray-500">
                {email.length}/100
              </span>
            </div>
            <input
              id="email"
              type="email"
              placeholder="Digite o e-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              maxLength={100}
              className={`w-full px-4 py-3 bg-white border rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={convidarMutation.isPending}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mensagem de erro da API */}
          {convidarMutation.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              <div className="font-medium mb-1">Não foi possível enviar o convite</div>
              <div className="text-red-500">
                {(convidarMutation.error as any)?.response?.data?.message ||
                  (convidarMutation.error as any)?.message ||
                  'Erro desconhecido'}
              </div>
            </div>
          )}
        </div>

        {/* Footer com ações */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={convidarMutation.isPending}
              className="flex-1 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={convidarMutation.isPending}
              className="flex-1 text-white hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: '#306FCC' }}
            >
              {convidarMutation.isPending ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
