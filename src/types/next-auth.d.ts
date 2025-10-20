import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessToken: string;
      refreshToken: string;
      ativo: boolean;
      permissoes: any[];
      grupos: string[];
      fotoPerfil?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    ativo?: boolean;
    permissoes?: any[];
    grupos?: string[];
    fotoPerfil?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    ativo: boolean;
    permissoes: any[];
    grupos: string[];
    fotoPerfil?: string;
  }
}
