"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

export function useSession() {
  const { data: session, status } = useNextAuthSession();
  
  const hasPermission = (rota: string, metodo: 'buscar' | 'enviar' | 'modificar' | 'substituir' | 'excluir') => {
    if (!session?.user?.permissoes) return false;
    
    return session.user.permissoes.some((permissao: any) => 
      permissao.rota === rota && 
      permissao.ativo && 
      permissao[metodo]
    );
  };
  
  return {
    session,
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    accessToken: session?.user?.accessToken,
    refreshToken: session?.user?.refreshToken,
    hasPermission,
  };
}
