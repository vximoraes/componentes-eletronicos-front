import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
      senha: string;
      ativo: boolean;
      permissoes: any[];
      grupos: string[];
      __v?: number;
    };
  };
  errors: any[];
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error("Email e senha são obrigatórios");
        }

        try {
          const response = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            {
              email: credentials.email,
              senha: credentials.senha
            }
          );

          const { data } = response.data;

          if (data?.user) {
            const user: User = {
              id: data.user._id,
              name: data.user.nome,
              email: data.user.email,
              accessToken: data.user.accesstoken,
              refreshToken: data.user.refreshtoken,
              ativo: data.user.ativo,
              permissoes: data.user.permissoes,
              grupos: data.user.grupos,
            };
            return user;
          }

          return null;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Erro no login:", error.response?.data);
            throw new Error(error.response?.data?.message || "Erro ao fazer login");
          }
          throw new Error("Erro ao fazer login");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.ativo = (user as any).ativo;
        token.permissoes = (user as any).permissoes;
        token.grupos = (user as any).grupos;
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          ativo: token.ativo as boolean,
          permissoes: token.permissoes as any[],
          grupos: token.grupos as string[],
        };
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
