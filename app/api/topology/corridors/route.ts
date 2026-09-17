import { NextRequest, NextResponse } from 'next/server';
import { ottTopologyService } from '@/lib/ottTopologyService';
export const runtime = 'nodejs';
export async function GET() { return NextResponse.json({ corridors: ottTopologyService.getCorridors() }); }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const corridor = ottTopologyService.addCorridor(body);
    return NextResponse.json({ success: true, corridor });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}