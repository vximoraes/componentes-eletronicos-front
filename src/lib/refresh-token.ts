import axios from "axios";

interface RefreshTokenResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    accesstoken?: string;
    user?: {
      accesstoken?: string;
      refreshtoken?: string;
    };
  };
}

export async function refreshAccessToken(currentAccessToken: string): Promise<string | null> {
  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
      {
        accesstoken: currentAccessToken,
      }
    );

    const newAccessToken =
      response.data?.data?.accesstoken ||
      response.data?.data?.user?.accesstoken ||
      response.data?.data;

    if (typeof newAccessToken === 'string' && newAccessToken) {
      return newAccessToken;
    }

    console.error("Novo access token não encontrado na resposta:", response.data);
    return null;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao fazer refresh do token:", error.response?.data);
    } else {
      console.error("Erro ao fazer refresh do token:", error);
    }
    return null;
  }
}
