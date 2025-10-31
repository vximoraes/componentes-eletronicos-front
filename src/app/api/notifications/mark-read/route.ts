import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await request.json();

    // Aqui você implementaria a lógica real de marcar como lida
    // Por enquanto retornamos sucesso
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[POST] /api/notifications/mark-read:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// Configurações do NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_secret_aqui
NEXT_PUBLIC_API_URL=http://localhost:3010