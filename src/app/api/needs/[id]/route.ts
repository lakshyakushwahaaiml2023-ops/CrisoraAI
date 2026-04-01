import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, assigned_to, description } = body;

    const need = await prisma.need.update({
      where: { id },
      data: {
        status,
        assigned_to_id: assigned_to,
        description
      }
    });

    return NextResponse.json(need);
  } catch (error) {
    console.error('DATABASE_UPDATE_ERROR:', error);
    return NextResponse.json({ error: 'Failed to update record.' }, { status: 500 });
  }
}
