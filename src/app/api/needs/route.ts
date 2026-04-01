import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const needs = await prisma.need.findMany({
      orderBy: { created_at: 'desc' },
      include: { 
        reported_by: true,
        assigned_to: { include: { user: true } }
      }
    });
    return NextResponse.json(needs);
  } catch (error) {
    console.error('DATABASE_FETCH_ERROR:', error);
    return NextResponse.json({ error: 'FAILED_TO_LOAD_STREP' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      reported_by, need_type, urgency_level, urgency_label, 
      people_affected, description, location 
    } = body;

    // Ensure User exists for the relation
    const user = await prisma.user.upsert({
      where: { id: reported_by },
      update: {},
      create: {
        id: reported_by,
        email: `vic_${reported_by}@ndrs.gov.in`,
        role: 'victim',
        lat: location.lat,
        lng: location.lng
      }
    });

    const need = await prisma.need.create({
      data: {
        reported_by_id: user.id,
        need_type,
        urgency_level,
        urgency_label,
        people_affected,
        description,
        lat: location.lat,
        lng: location.lng,
        status: 'pending'
      }
    });

    return NextResponse.json(need);
  } catch (error) {
    console.error('DATABASE_INSERT_ERROR:', error);
    return NextResponse.json({ error: 'FAILED_TO_LOG_DISTRESS' }, { status: 500 });
  }
}
