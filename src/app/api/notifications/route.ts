import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Simulando algumas notificações para teste
    const mockNotifications = [
      {
        id: '1',
        userId: session.user.id,
        title: 'Bem-vindo!',
        body: 'Bem-vindo ao sistema de componentes eletrônicos',
        read: false,
        createdAt: new Date()
      },
      {
        id: '2',
        userId: session.user.id,
        title: 'Novo componente disponível',
        body: 'Um novo componente foi adicionado ao catálogo',
        read: false,
        createdAt: new Date()
      }
    ];

    return NextResponse.json(mockNotifications);

  } catch (error) {
    console.error('[GET] /api/notifications:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}