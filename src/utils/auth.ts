import axios from "axios";

interface LoginResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    user: {
      accesstoken: string;
      refreshtoken: string;
      _id: string;
      nome: string;
      email: string;
      ativo: boolean;
      permissoes: any[];
      grupos: string[];
    };
  };
  errors: any[];
}

export async function mockLogin(): Promise<string | null> {
  try {
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      email: "admin@admin.com",
      senha: "Senha@123"
    });
    
    const responseData = response.data;
    const token = responseData.data?.user?.accesstoken || 
                  (responseData as any).accessToken || 
                  (responseData as any).access_token || 
                  (responseData as any).token;
    
    if (!token) {
      console.error("Token não encontrado na resposta do login");
      return null;
    }
    
    return token;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Erro no login:", err.response?.data);
    } else {
      console.error("Erro ao fazer login:", err);
    }
    return null;
  }
}

export async function authenticatedRequest<T = any>(
  url: string, 
  options: any = {}, 
  token?: string | null
): Promise<T> {
  let authToken = token;
  
  if (!authToken) {
    authToken = await mockLogin();
    if (!authToken) {
      throw new Error("Falha na autenticação");
    }
  }

  try {
    const response = await axios({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const newToken = await mockLogin();
      if (newToken) {
        const retryResponse = await axios({
          url,
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          }
        });
        return retryResponse.data;
      }
    }
    throw err;
  }
}