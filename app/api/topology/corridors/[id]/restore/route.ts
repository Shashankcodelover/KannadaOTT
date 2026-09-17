import { NextRequest, NextResponse } from 'next/server';
import { ottTopologyService } from '@/lib/ottTopologyService';
export const runtime = 'nodejs';
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const corridor = ottTopologyService.restoreCorridor(id);
    return NextResponse.json({ success: true, corridor });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}